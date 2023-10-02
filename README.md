# configu/setup-cli-action

[![Test setup Configu CLI GitHub Actions](https://github.com/configu/setup-cli-action/actions/workflows/setup-cli-action.yml/badge.svg)](https://github.com/configu/setup-cli-action/actions/workflows/setup-cli-action.yml)

The `configu/setup-cli-action` action is a [composite action](https://docs.github.com/en/actions/creating-actions/creating-a-composite-action) that sets up Configu CLI in your GitHub Actions workflow by downloading a specific version of Configu CLI and adding it to the `PATH`.

After you've used the action, subsequent steps in the same job can run arbitrary Configu CLI commands. All of Configu commands work exactly like they do on your local command line.

## Usage

This action can be run on `ubuntu-latest`, `windows-latest`, and `macos-latest` GitHub Actions runners. 

When running on `windows-latest` the shell should be set to Bash.

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
      version: 0.4.4
```

Credentials for [`Configu Platform`](https://app.configu.com/) can be configured.

```yaml
jobs:
  some-job:
    runs-on: ubuntu-latest
    env:
      CONFIGU_ORG: ${{ secrets.CONFIGU_ORG }}
      CONFIGU_TOKEN: ${{ secrets.CONFIGU_TOKEN }}
    steps:
      - name: Setup Configu CLI
        uses: configu/setup-cli-action@v1

      - name: Export configurations
        run: | 
          configu eval --store 'configu' --set 'production' --schema 'path/to/schema.cfgu.json' | configu export
```

## Inputs

The action supports the [following inputs](https://github.com/configu/setup-cli-action/blob/main/action.yml#L7).

## License

This Action is licensed under [Apache License 2.0](https://github.com/configu/setup-cli-action/blob/main/LICENSE).

## References
- [Configu SaaS Platform (app.configu.com)](https://app.configu.com/)
- [Configu Documentation](https://configu.com/docs)
- [GitHub Actions Documentation](https://help.github.com/en/categories/automating-your-workflow-with-github-actions)
