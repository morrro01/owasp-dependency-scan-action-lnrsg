import * as core from '@actions/core';
import {
    IReport,
    IReportDependency,
    IReportDependencyEvidence,
    IReportDependencyVulnerabilityData
} from '../report';
import {
    highestVulnerabilityConfidence,
    highestVulnerabilitySeverity,
    packageVulnerabilityMarkdown,
    severityCount
} from './utils';
import {
    ISummary,
    ISummaryCounts,
    ISummaryVulnerableDependency,
    ISummaryVulnerableDependencyData,
    Severity
} from './types';
export * from './types';

/**
 * Generates the markdown for a Pull Request comment based on a generated
 * summary.
 * 
 * @param {string} title 
 * @param {ISummary} summary 
 * @returns {string}
 */
export function getSummaryMarkdown( title: string, summary: ISummary ): string {
    let markdown = `### ${title}

#### Overview

|||
|---|---|
|**📦 Project**|${summary.project}|
|**🩺 Scanned Dependencies**|${summary.counts.scanned}|
|**🔥&nbsp;&nbsp;High Severity**|${summary.counts.high}|
|**⚠️ Medium Severity**|${summary.counts.medium}|
|**✔️ Low Severity**|${summary.counts.low}|

#### Summary

| File | IDs | Pkgs | Sev | CI | CVE | Evid |
|---|---|---|---|---|---|---|
`;

    summary.dependencies.forEach( dependency => {
        const vulnerabilitiesMarkdown = packageVulnerabilityMarkdown( dependency.vulnerabilities );
        const packagesMarkdown = packageVulnerabilityMarkdown( dependency.packages );

        markdown += `|${dependency.name}|${vulnerabilitiesMarkdown}|${packagesMarkdown}|${dependency.severity}|${dependency.confidence}|${dependency.cves}|${dependency.evidence}|`;
    });

    return markdown;
}

/**
 * Parses the provided report, and generates a summary.
 * 
 * @param {IReport} report 
 * @returns {ISummary | undefined}
 */
export function getSummary( report: IReport ): ISummary | undefined {
    let summary: ISummary | undefined;

    try {
        const vulnerableDependencies = report.dependencies.filter( dependency =>
            dependency.vulnerabilities && dependency.vulnerabilities.length > 0 );

        const project = report.projectInfo.name;
        const dependencies = getVulnerableDependencySummaries( vulnerableDependencies );
        const counts = getCounts( report.dependencies.length, dependencies );

        summary = {
            project,
            counts,
            dependencies
        };
    } catch ( err: any ) {
        core.warning( err.message );
    }

    return summary;
}

/**
 * Returns a summarized calculation of all scanned dependencies, and the number
 * reporting vulnerabilities at each severity level.
 * 
 * @param {number} scanned 
 * @param {ISummaryVulnerableDependency[]} dependencySummaries
 * @returns {ISummaryCounts}
 */
function getCounts( scanned: number, dependencySummaries: ISummaryVulnerableDependency[] ): ISummaryCounts {
    return {
        scanned,
        high: severityCount( dependencySummaries, Severity.High ),
        medium: severityCount( dependencySummaries, Severity.Medium ),
        low: severityCount( dependencySummaries, Severity.Low )
    };
}

/**
 * Returns a total count of evidentiary sources in support of a dependency's
 * reported vulnerabilities.
 * 
 * @param {IReportDependencyEvidence} evidence 
 * @returns {number}
 */
function getEvidenceCount( evidence: IReportDependencyEvidence ): number {
    let count = 0;

    Object.keys( evidence ).forEach( key =>
        count += evidence[ key ].length );

    return count;
}

/**
 * Returns a collection of summarized name and URLs from the provided
 * dependency packages or vulnerability IDs.
 * 
 * @param {IReportDependencyVulnerabilityData[]} values
 * @returns {ISummaryVulnerableDependencyData[]}
 */
function getPackagesVulnerabilities( values: IReportDependencyVulnerabilityData[] ): ISummaryVulnerableDependencyData[] {
    return values.map( value => ({
        name: value.id,
        url: value.url
    }));
}

/**
 * Returns a collection of summarized vulnerable dependencies from the
 * provided report dependencies.
 * 
 * @param {IReportDependency[]} dependencies
 * @returns {ISummaryVulnerableDependency[]}
 */
function getVulnerableDependencySummaries( dependencies: IReportDependency[] ): ISummaryVulnerableDependency[] {
    let summaries: ISummaryVulnerableDependency[] = [];

    dependencies.forEach( dependency => {
        const dependencyEvidence = dependency.evidenceCollected || {};
        const dependencyPackages = dependency.packages || [];
        const dependencyVulnerabilities = dependency.vulnerabilities || [];
        const dependencyVulnerabilityIds = dependency.vulnerabilityIds || [];

        if ( dependencyVulnerabilities.length > 0 ) {

            const name = dependency.fileName;
            const confidence = highestVulnerabilityConfidence( dependencyVulnerabilityIds );
            const cves = dependencyVulnerabilities.length;
            const evidence = getEvidenceCount( dependencyEvidence );
            const packages = getPackagesVulnerabilities( dependencyPackages );
            const severity = highestVulnerabilitySeverity( dependencyVulnerabilities );
            const vulnerabilities = getPackagesVulnerabilities( dependencyVulnerabilityIds );

            summaries.push({
                name,
                confidence,
                cves,
                evidence,
                packages,
                severity,
                vulnerabilities
            });
        }
    });

    return summaries;
}