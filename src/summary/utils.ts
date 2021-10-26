import {
    IReportDependencyVulnerability,
    IReportDependencyVulnerabilityData
} from '../report'
import {
    Confidence,
    ISummaryVulnerableDependency,
    ISummaryVulnerableDependencyData,
    Severity
} from './types';

/**
 * Whether a collection of reported vulnerabilities or vulnerability IDs contains
 * a given normalized confidence or severity.
 * 
 * @param {IReportDependencyVulnerability[] | IReportDependencyVulnerabilityData[]} values
 * @param {string} type 
 * @param {Confidence | Severity} match 
 * @returns {boolean}
 */
const hasConfidenceSeverity = (
    values: IReportDependencyVulnerability[] | IReportDependencyVulnerabilityData[],
    type: 'confidence' | 'severity',
    match: Confidence | Severity ): boolean => {

    return ( type === 'confidence' )
        ? ( values as IReportDependencyVulnerabilityData[] ).find( value =>
            value.confidence.toLowerCase() === match.toLowerCase() ) !== undefined
        : ( values as IReportDependencyVulnerability[] ).find( value =>
            value.severity.toLowerCase() === match.toLowerCase() ) !== undefined;
}

/**
 * Finds the highest confidence in a collection of reported dependency
 * vulnerabilities, and returns a normalized value. Defaults to "Low".
 * 
 * @param {IReportDependencyVulnerabilityData[]} vulnerabilityIds
 * @returns {Confidence}
 */
export const highestVulnerabilityConfidence = ( vulnerabilityIds: IReportDependencyVulnerabilityData[] ): Confidence => {
    let confidence: Confidence = Confidence.Low;

    if ( hasConfidenceSeverity( vulnerabilityIds, 'confidence', Confidence.Low ))
        confidence = Confidence.Low;

    if ( hasConfidenceSeverity( vulnerabilityIds, 'confidence', Confidence.Medium ))
        confidence = Confidence.Medium;

    if ( hasConfidenceSeverity( vulnerabilityIds, 'confidence', Confidence.High ))
        confidence = Confidence.High;

    if ( hasConfidenceSeverity( vulnerabilityIds, 'confidence', Confidence.Highest ))
        confidence = Confidence.Highest;

    return confidence;
}

/**
 * Finds the highest severity in a collection of reported dependency vulnerabilities,
 * and returns a normalized value. Defaults to "Low".
 * 
 * @param {IReportDependencyVulnerability[]} vulnerabilities
 * @returns {Severity}
 */
export const highestVulnerabilitySeverity = ( vulnerabilities: IReportDependencyVulnerability[] ): Severity => {
    let severity: Severity = Severity.Low;

    if ( hasConfidenceSeverity( vulnerabilities, 'severity', Severity.Low ))
        severity = Severity.Low;

    if ( hasConfidenceSeverity( vulnerabilities, 'severity', Severity.Medium ))
        severity = Severity.Medium;

    if ( hasConfidenceSeverity( vulnerabilities, 'severity', Severity.High ))
        severity = Severity.High;

    return severity;
}

/**
 * Returns the number of summarized vulnerable dependencies reporting a specific
 * severity level.
 * 
 * @param {ISummaryVulnerableDependency[]} summaries
 * @param {Severity} severity 
 * @returns {number}
 */
export const severityCount = ( summaries: ISummaryVulnerableDependency[], severity: Severity ): number =>
    summaries.filter( summary => summary.severity === severity ).length;

/**
 * Returns a markdown string from a collection of summarized dependencies or
 * packages, generating a link for those with a populated "url" property.
 * 
 * @param {ISummaryVulnerableDependencyData[]} values
 * @returns {string}
 */
export const packageVulnerabilityMarkdown = ( values: ISummaryVulnerableDependencyData[] ): string =>
    values
        .map( value => value.url ? `[${value.name}](${value.url})` : value.name )
        .join( '<br />' );