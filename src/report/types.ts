/**
 * Defines properties found in the "vulnerabilities" object array of a JSON
 * scan report.
 */
export interface IReportDependencyVulnerability {

    /**
     * @memberof IReportDependencyVulnerability
     * 
     * Name of the vulnerability.
     */
    name: string;

    /**
     * @memberof IReportDependencyVulnerability
     * 
     * Severity of the vulnerability. Will be one of: 'Low', 'Medium', or 'High'.
     */
    severity: string;
}

/**
 * Defines properties found in the "packages" and "vulnerabilityIds" object
 * arrays of a JSON scan report.
 */
export interface IReportDependencyVulnerabilityData {

    /**
     * @memberof IReportDependencyVulnerabilityData
     * 
     * Unique identifier or name of the package or vulnerabilityId.
     */
    id: string;

    /**
     * @memberof IReportDependencyVulnerabilityData
     * 
     * Confidence of the package or vulnerabilityId. Will be one of: 'LOW',
     * 'MEDIUM', 'HIGH', 'HIGHEST'.
     */
    confidence: string;

    /**
     * @memberof IReportDependencyVulnerabilityData
     * 
     * URL to the detailed summary of the package or vulnerabilityId, if
     * provided.
     */
    url?: string;
}

/**
 * Defines properties found in the "evidenceCollected" object of a JSON scan
 * report.
 */
export interface IReportDependencyEvidence {

    /**
     * @memberof IReportDependencyEvidence
     * 
     * Key-value pair containing collections of evidence in support of a
     * vulnerable dependency.
     */
    [key: string]: any[];
}

/**
 * Defines properties found in the "dependencies" object array of a JSON scan
 * report.
 */
export interface IReportDependency {

    /**
     * @memberof IReportDependency
     * 
     * Filename of the dependency.
     */
    fileName: string;

    /**
     * @memberof IReportDependency
     * 
     * Evidence collected in support of a vulnerable dependency, if applicable.
     */
    evidenceCollected?: IReportDependencyEvidence;

    /**
     * @memberof IReportDependency
     * 
     * Collection of packages associated with a vulnerable dependency, if
     * applicable.
     */
    packages?: IReportDependencyVulnerabilityData[];

    /**
     * @memberof IReportDependency
     * 
     * Collection of vulnerabilities associated with a dependency, if applicable.
     */
    vulnerabilities?: IReportDependencyVulnerability[];

    /**
     * @memberof IReportDependency
     * 
     * Collection of vulnerability identifiers associated with a vulnerable
     * dependency, if applicable.
     */
    vulnerabilityIds?: IReportDependencyVulnerabilityData[];
}

/**
 * Defines properties found in a JSON scan report.
 */
export interface IReport {

    /**
     * @memberof IReport
     * 
     * Object containing basic information about the generated report.
     */
    projectInfo: {
        name: string;
    };

    /**
     * @memberof IReport
     * 
     * Object array containing information about the scanned dependencies found
     * in the generated report.
     */
    dependencies: IReportDependency[];
}