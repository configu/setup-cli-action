/* eslint-disable no-unused-vars */
const os = require('os');
const path = require('path');
const fs = require('fs').promises;

const core = require('@actions/core');
const tc = require('@actions/tool-cache');
const io = require('@actions/io');
const { exec } = require('@actions/exec');

const VERSION_ARG = 'version';
const ORG_ARG = 'org';
const TOKEN_ARG = 'token';

const getDownloadUrl = () => {
  // todo: handle version arg
  const version = core.getInput(VERSION_ARG);
  return `https://configu.io/cli/channels/stable/configu-${os.platform()}-${os.arch()}.tar.gz`;
};

const setup = async () => {
  try {
    core.startGroup('Setup Configu CLI');

    const downloadUrl = getDownloadUrl();
    core.debug(`Downloading Configu CLI from ${downloadUrl}`);
    const tarballPath = await tc.downloadTool(downloadUrl);
    const cliPath = await tc.extractTar(tarballPath);
    const binPath = path.join(cliPath, 'bin');
    core.addPath(binPath);

    console.log(downloadUrl, tarballPath, cliPath, binPath);
    const files = await fs.readdir(cliPath);
    files.forEach((file) => {
      console.log(file);
    });

    // todo: handle authentication args (org, token)
  } catch (error) {
    core.setFailed(error.message);
  } finally {
    core.endGroup();
  }
};

setup();
