/* eslint-disable no-unused-vars */
import path from 'path';
import os from 'os';
import core from '@actions/core';
import tc from '@actions/tool-cache';
import { exec } from '@actions/exec';

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

    // todo: handle authentication args (org, token)
  } catch (error) {
    core.setFailed(error.message);
  } finally {
    core.endGroup();
  }
};

setup();
