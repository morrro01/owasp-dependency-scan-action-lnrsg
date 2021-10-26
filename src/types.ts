/**
 * Defines the allowed values for the "failure_mode" action input parameter.
 */
export enum FailureMode {
    None = 'none',
    High = 'high',
    Medium = 'medium',
    Low = 'low'
}

/**
 * Defines the allowed values for the comma-delimited "format" action input
 * parameter.
 */
export enum ReportFormat {
    XML = 'XML',
    HTML = 'HTML',
    CSV = 'CSV',
    JSON = 'JSON',
    JUNIT = 'JUNIT',
    SARIF = 'SARIF'
}

/**
 * Defines the parsed action input parameters.
 */
export interface IActionInputs {

    /**
     * @memberof IActionInputs
     * 
     * GitHub API token with repository access.
     */
    github_token: string;

    /**
     * @memberof IActionInputs
     *
     * Name of the project to be scanned.
     */
    project: string;

    /**
     * @memberof IActionInputs
     *
     * Workspace path containing assets to be scanned.
     */
    path: string;

    /**
     * @memberof IActionInputs
     *
     * One or more output formats to generate as a comma-delimited value.
     * Options: XML, HTML, CSV, JSON, JUNIT, SARIF.
     */
    format: ReportFormat[];

    /**
     * @memberof IActionInputs
     *
     * Additional arguments passed to the dependency scanner.
     */
    scan_args?: string[];

    /**
     * @memberof IActionInputs
     *
     * Whether to comment Pull Requests with the scan summary; one of: true, false.
     */
    comment_on_pr: boolean;

    /**
     * @memberof IActionInputs
     *
     * Title of Pull Request comments, if enabled.
     */
    comment_title: string;

    /**
     * @memberof IActionInputs
     *
     * Whether to upload the generated scan report(s) as an artifact; one of: true, false.
     */
    upload_artifact: boolean;

    /**
     * @memberof IActionInputs
     *
     * Name given to the uploaded scan report artifact, if enabled.
     */
    artifact_name: string;

    /**
     * @memberof IActionInputs
     *
     * Number of days to retain the uploaded scan report artifact, if enabled.
     */
    artifact_retention_days: number;

    /**
     * @memberof IActionInputs
     * 
     * If provided, fails the workflow based on the presence of vulnerability
     * severity; one of: "none", "high", "medium", "low".
     */
    failure_mode: FailureMode;
}