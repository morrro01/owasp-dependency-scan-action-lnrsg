# owasp-dependency-scan-action-lnrsg

## Overview

This is a GitHub action based on [OWASP's Dependency-Check](https://owasp.org/www-project-dependency-check/), a Software Composition Analysis (SCA) tool that attempts to detect publicly disclosed vulnerabilities contained within a project's dependencies.

It is similar to - and based on - the [dependency-check/Dependency-Check_Action](https://github.com/dependency-check/Dependency-Check_Action) action, and its Docker image uses the same [nightly-built base image](https://github.com/dependency-check/DependencyCheck_Builder) to ensure use of the latest vulnerabilities database on each run.

## Basic Usage

The example below illustrates basic usage for scanning a .NET application, but Java application scans are supported as well. Simply replace the build step's run command with an appropriate Maven alternative.

Other examples are available in the [examples folder](examples/).

```yaml
name: Example

on:
  pull_request:
    branches: [ main ]

jobs:
  scan:
    name: Scan
    runs-on: ubuntu-latest

    steps:
      - name: 📚 Checkout
        uses: actions/checkout@v2

      - name: 🔨 Build w/ .NET      
        run: dotnet build --configuration Release

      - name: ⚔️ OWASP
        uses: morrro01/owasp-dependency-scan-action-lnrsg@v1
        with:
          project: 'My Application'
          path: '.'
          format: 'JSON'
          scan_args: >
            --failOnCVSS 7
            --enableRetired
```

## Configuration

The following is a complete listing of options supported by the action using the `with` object property.

| Option | Required | Default | Description |
| ---    | ---      | ---     | ---         |
| `project` | ✔️ | *n/a* | Name of the project passed to the scanner. |
| `path` | ✔️ | *n/a* | Workspace path containing the application to be scanned. |
| `github_token` | ❌ | `${{ github.token }}` | GitHub API token required if `comment_on_pr` is true. By default, attempts to use the token from the GitHub workflow context. Depending upon the security configuration of your repository, you may need to use `${{ secrets.github_token }}` or provide a [Personal Access Token (PAT)](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token). |
| `format` | ❌ | `'JSON'` | Report output format(s) to generate. Multiple formats can be provided as a comma-delimited string.<br/><br/>**Options:** XML, HTML, CSV, JSON, JUNIT, SARIF<br/><br/>**Examples:**<br/>- `format: 'CSV'`<br/>- `format: 'CSV,XML'` |
| `scan_args` | ❌ | *n/a* | Additional command line arguments passed to the scanner. A full list of arguments can be found on the scanner's [official documentation site](https://jeremylong.github.io/DependencyCheck/dependency-check-cli/arguments.html). See the [Basic Usage](#basic-usage) example for syntax. |
| `comment_on_pr` | ❌ | `true` | Whether the action should add a Pull Request comment with a summary of the results.<br/><br/>**Note:** comments will only be added to Pull Requests if the value of `format` includes `'JSON'`. Other formats can also be used, but JSON is required for parsing of the summary used in the Pull Request comment. |
| `comment_title` | ❌ | `'OWASP Scan Results'` | Title of the Pull Request comment to use if `comment_on_pr` is `true`. |
| `upload_artifact` | ❌ | `true` | Whether to upload generated reports as a workflow artifact for later downloading and viewing. |
| `artifact_name` | ❌ | `'OWASP Report'` | Name given to the workflow artifact if `upload_artifact` is `true`. |
| `artifact_retention_days` | ❌ | `30` | Number of days to retain the workflow artifact if `upload_artifact` is `true`.<br/><br/>**Note:** GitHub will honor this value so long as it falls within any enterprise or organizational constraints, if applicable (e.g., if your organization has a maximum retention of 7 days, providing a value of 30 days will be ignored). |
| `failure_mode` | ❌ | `'high'` | If provided, fails the job if any vulnerabilities of a given severity are detected. To disable this - and allow the workflow to proceed regardless of detected vulnerabilities - use a value of `'none'`.<br/><br/>**Options:** none, low, medium, high<br/><br/>**Note:** this check can only be accommodated if the value of `format` includes `'JSON'`. Other formats can also be used, but JSON is required for generating a parsed summary for detection. |

## Pull Request Comments

When `comment_on_pr` is enabled, a summary of the scan results will be injected into a Pull Request comment containing an overview with at-a-glance count information along with a summary of specific vulnerable dependencies. 

![Example PR Comment](/.github/images/example-pr-comment.jpg)

The following is a legend of the information presented in a summary:

**Overview**
- **Project:** the name of the project as provided via the `project` configuration value.
- **Scanned Dependencies:** a count of the project dependencies that the scanner detected and validated.
- **High Severity:** a count of found vulnerabilities considered high.
- **Medium Severity:** a count of found vulnerabilities considered moderate.
- **Low Severity:** a count of found vulnerabilities considered low.

**Summary**

For each row of the table:
- **File:** filename of a dependency with one or more vulnerabilities.
- **IDs:** one or more vulnerability IDs associated with the dependency; if available, links to the [NIST](https://www.nist.gov/) vulnerability detail page are included.
- **Pkgs:** one or more package IDs associated with the dependency; if available, links to the [OSS Index](https://ossindex.sonatype.org/) package detail page are included.
- **Sev:** the highest severity of vulnerability found for the dependency.
- **CI:** the highest confidence found for the dependency's vulnerabilities.
- **CVE:** a count of found vulnerabilities for the dependency.
- **Evid:** a count of evidentiary sources for the dependency's vulnerabilities.

The summary may be enough for most needs, but in cases where more granular detail is desired it's recommended to use `'JSON,HTML'` as the `format`, and ensure that `upload_artifact` is enabled. This will generate an artifact containing a more detailed report that can be downloaded from the bottom of your workflow's Summary view.

## Credits

This GitHub action is conceptually a composite of a few other actions combined into a single functionality.

- [actions/upload-artifact](https://github.com/actions/upload-artifact) by GitHub
- [dependency-check/Dependency-Check_Action](https://github.com/dependency-check/Dependency-Check_Action) by [Javier Domínguez Ruiz](https://github.com/javixeneize)