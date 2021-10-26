# owasp-dependency-scan-action-lnrsg Examples

Example files that illustrate usage - or disabling of - various features supported by the action.

| File | Build | Formats | Comment? | Artifact? | Failure |
| ---  | ---   | ---     | ---      | ---       | ---     |
| [0_basic-dotnet.yaml](0_basic-dotnet.yaml) | .NET | JSON | ✔️ | ✔️ | High |
| [1_basic-java.yaml](1_basic-java.yaml) | Maven | JSON | ✔️ | ✔️ | High |
| [2_artifact-only.yaml](2_artifact-only.yaml) | .NET | HTML | ❌ | ✔️ | High |
| [3_pr-comment-only.yaml](3_pr-comment-only.yaml) | .NET | JSON | ✔️ | ❌ | High |
| [4_low-severity-failure.yaml](4_low-severity-failure.yaml) | .NET | JSON | ✔️ | ✔️ | Low |
| [5_kitchen-sink.yaml](5_kitchen-sink.yaml) | .NET | All | ✔️ | ✔️ | ❌ |
