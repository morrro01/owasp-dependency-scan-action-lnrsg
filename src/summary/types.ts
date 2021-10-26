/**
 * Defines normalized confidence levels used in the summary of a parsed report.
 */
export enum Confidence {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
    Highest = 'Highest'
}

/**
 * Defines normalized severity levels used in the summary of a parsed report.
 */
export enum Severity {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High'
}

/**
 * Defines basic informational counts found in a parsed report.
 */
export interface ISummaryCounts {

    /**
     * @memberof ISummaryCounts
     * 
     * Number of dependencies scanned.
     */
    scanned: number;

    /**
     * @memberof ISummaryCounts
     * 
     * Number of vulnerable dependencies with a 'High' severity.
     */
    high: number;

    /**
     * @memberof ISummaryCounts
     * 
     * Number of vulnerable dependencies with a 'Medium' severity.
     */
    medium: number;

    /**
     * @memberof ISummaryCounts
     * 
     * Number of vulnerable dependencies with a 'Low' severity.
     */
    low: number;
}

/**
 * Defines shared properties in summarizing specific vulnerabilities or packages
 * found in a parsed report.
 */
export interface ISummaryVulnerableDependencyData {

    /**
     * @memberof ISummaryVulnerableDependencyData
     * 
     * Name of the vulnerability or package.
     */
    name: string;

    /**
     * @memberof ISummaryVulnerableDependencyData
     * 
     * URL to the detailed summary of the vulnerability or package, if provided.
     */
    url?: string;
}

/**
 * Defines an informational summary of a vulnerable dependency found in a parsed
 * report.
 */
export interface ISummaryVulnerableDependency {

    /**
     * @memberof ISummaryVulnerableDependency
     * 
     * Name of the vulnerable dependency.
     */
    name: string;

    /**
     * @memberof ISummaryVulnerableDependency
     * 
     * Confidence of the highest found vulnerability.
     */
    confidence: Confidence;

    /**
     * @memberof ISummaryVulnerableDependency
     * 
     * Number of total vulnerabilities found in the dependency.
     */
    cves: number;

    /**
     * @memberof ISummaryVulnerableDependency
     * 
     * Number of total evidence found across vendor, product, and version
     * reporting for all vulnerabilities.
     */
    evidence: number;

    /**
     * @memberof ISummaryVulnerableDependency
     * 
     * Summary of packages reported by the scan.
     */
    packages: ISummaryVulnerableDependencyData[];

    /**
     * @memberof ISummaryVulnerableDependency
     * 
     * Severity of the highest found vulnerability.
     */
    severity: Severity;

    /**
     * @memberof ISummaryVulnerableDependency
     * 
     * Summary of vulnerabilities reported by the scan.
     */
    vulnerabilities: ISummaryVulnerableDependencyData[];
}

/**
 * Defines a summary of a parsed report.
 */
export interface ISummary {

    /**
     * @memberof ISummary
     * 
     * Name of the project to which the report applies.
     */
    project: string;

    /**
     * @memberof ISummary
     * 
     * Informational counts found in the parsed report.
     */
    counts: ISummaryCounts;

    /**
     * @memberof ISummary
     * 
     * Vulnerable dependencies found in the parsed report.
     */
    dependencies: ISummaryVulnerableDependency[];
}