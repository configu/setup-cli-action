const os = require('os');
const path = require('path');
const core = require('@actions/core');
const tc = require('@actions/tool-cache');
const { exec } = require('@actions/exec');
const { S3Client, ListObjectsCommand } = require('@aws-sdk/client-s3');

const CLI_BLOB_URL = new URL('https://configu.io/cli');
const CLI_BLOB_REGION = 'us-east-1';
const VERSION_ARG = 'version';
const DEFAULT_VERSION = 'latest';
const ORG_ARG = 'org';
const TOKEN_ARG = 'token';

const getDownloadUrl = async () => {
  const version = core.getInput(VERSION_ARG);

  if (version === DEFAULT_VERSION) {
    return `${CLI_BLOB_URL.href}/channels/stable/configu-${os.platform()}-${os.arch()}.tar.gz`;
  }

  try {
    const client = new S3Client({
      region: CLI_BLOB_REGION,
      signer: { sign: async (request) => request },
    });
    const command = new ListObjectsCommand({
      Bucket: CLI_BLOB_URL.hostname,
      Prefix: `${CLI_BLOB_URL.pathname}/versions/${version}/`,
    });
    const data = await client.send(command);

    console.log(data);
    console.log(data?.Contents);
    const objectKey = data?.Contents?.find((content) =>
      content?.Key.includes(`-${os.platform()}-${os.arch()}.tar.gz`),
    )?.Key;
    if (!objectKey) {
      throw new Error(`failed to find ${version} of Configu CLI`);
    }
    return `${CLI_BLOB_URL.origin}/${objectKey}`;
  } catch (error) {
    console.log(error);
    throw new Error(`failed to fetch ${version} of Configu CLI`);
  }
};

const tryAuthenticateCli = async () => {
  const org = core.getInput(ORG_ARG);
  const token = core.getInput(TOKEN_ARG);

  if (!org || !token) {
    return;
  }

  core.info(`Authenticating Configu CLI for ${org} organization`);
  const res = await exec('configu', ['login', '--org', org, '--token', token]);
  if (res !== core.ExitCode.Success) {
    throw new Error('failed to authenticate with supplied org and token');
  }
};

const setup = async () => {
  try {
    core.startGroup('Setup Configu CLI');

    const downloadUrl = await getDownloadUrl();
    core.info(`Downloading Configu CLI from ${downloadUrl}`);
    const tarballPath = await tc.downloadTool(downloadUrl);
    const extractedPath = await tc.extractTar(tarballPath);
    const cliPath = path.join(extractedPath, 'configu', 'bin');
    core.addPath(cliPath);

    await tryAuthenticateCli();
  } catch (error) {
    core.setFailed(error.message);
  } finally {
    core.endGroup();
  }
};

setup();
