const os = require('os');
const path = require('path');
const core = require('@actions/core');
const tc = require('@actions/tool-cache');
const axios = require('axios');

const VERSION_ARG = 'version';

const getDownloadUrl = async () => {
  const version = core.getInput(VERSION_ARG);

  try {
    const { data } = await axios.get(
      `https://api.configu.com/cli/download?version=${version}&os=${os.platform()}&arch=${os.arch()}`,
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

const setup = async () => {
  try {
    core.startGroup('Setup Configu CLI');

    const downloadUrl = await getDownloadUrl();
    core.info(`Downloading Configu CLI from ${downloadUrl}`);
    const tarballPath = await tc.downloadTool(downloadUrl);
    const extractedPath = await tc.extractTar(tarballPath);
    const cliPath = path.join(extractedPath, 'configu', 'bin');
    core.addPath(cliPath);
  } catch (error) {
    core.setFailed(error.message);
  } finally {
    core.endGroup();
  }
};

setup();
