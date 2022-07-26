const os = require('os');
const path = require('path');
const core = require('@actions/core');
const tc = require('@actions/tool-cache');
const { exec } = require('@actions/exec');
const axios = require('axios');

const VERSION_ARG = 'version';
const ORG_ARG = 'org';
const TOKEN_ARG = 'token';

const getDownloadUrl = async () => {
  const version = core.getInput(VERSION_ARG);

  try {
    const { data } = await axios.get(
      `https://api.configu.io/cli/download?version=${version}&os=${os.platform()}&arch=${os.arch()}`,
      {
        responseType: 'text',
      },
    );
    return data;
  } catch (error) {
    core.error(error);
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
