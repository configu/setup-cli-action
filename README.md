# configu/setup-cli-action

[![Tests Setup Configu CLI Action](https://github.com/configu/setup-cli-action/actions/workflows/setup-cli-action.yml/badge.svg)](https://github.com/configu/setup-cli-action/actions/workflows/setup-cli-action.yml)

The configu/setup-cli-action action is a JavaScript action that sets up Configu CLI in your GitHub Actions workflow by downloading a specific version of Configu CLI and adding it to the `PATH`.

After you've used the action, subsequent steps in the same job can run arbitrary Configu CLI commands. All of Configu commands work exactly like they do on your local command line.

## Usage

This action can be run on `ubuntu-latest`, `windows-latest`, and `macos-latest` GitHub Actions runners. When running on `windows-latest` the shell should be set to Bash.

The default configuration installs the latest version of Configu CLI.

```yaml
steps:
  - uses: configu/setup-cli-action@v1
```

A specific version of Configu CLI can be installed.

```yaml
steps:
  - uses: configu/setup-cli-action@v1
    with:
      version: 0.0.105
```

Credentials for Configu SaaS platform ([app.configu.io](https://app.configu.io/)) can be configured.

via inputs:
```yaml
steps:
  - uses: configu/setup-cli-action@v1
    with:
      org: ${{ secrets.CONFIGU_ORG }}
      token: ${{ secrets.CONFIGU_TOKEN }}
```

via env:
```yaml
jobs:
  job1:
    runs-on: ubuntu-latest
    env:
      CONFIGU_ORG: ${{ secrets.CONFIGU_ORG }}
      CONFIGU_TOKEN: ${{ secrets.CONFIGU_TOKEN }}
    steps:
      - name: Setup Configu CLI
        uses: configu/setup-cli-action@v1
      
      - name: Validate Configu API access
        run: configu list
```

## Inputs

The action supports the [following inputs](https://github.com/configu/setup-cli-action/blob/main/action.yml#L4):
- `version` (optional) - The version of Configu CLI to install. A value of `latest` will install the latest version of Configu CLI. Defaults to `latest`.
- `org` (optional) - The organization id of a Configu SaaS instance to place within the credentials block of the Configu CLI configuration file.
- `token` (optional) - The access token for a Configu SaaS instance to place within the credentials block of the Configu CLI configuration file.


## License

This Action is licensed under [Apache License 2.0](https://github.com/configu/setup-cli-action/blob/main/LICENSE).

## References
- [Configu SaaS platform (app.configu.io)](https://app.configu.io/)
- [Configu Documentation](https://configu.io/docs)
- [GitHub Actions Documentation](https://help.github.com/en/categories/automating-your-workflow-with-github-actions)
