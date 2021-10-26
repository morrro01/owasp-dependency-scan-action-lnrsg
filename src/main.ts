import * as core from '@actions/core';
import { FailureMode, IActionInputs } from './types';
import * as upload from './upload';
import { ISummary } from './summary';
import * as scanner from './scanner';
import * as inputs from './inputs';
import * as comment from './comment';

/**
 * Primary entry point of the action.
 */
export async function run(): Promise<void> {
    const params = inputs.getInputs();

    // 1. Run the scanner.
    await scanner.scan( params );
    
    // 2. Generate a PR comment.
    const summary = await comment.generate( params );

    // 3. Upload a reports artifact.
    await upload.generate( params );

    // 4. Check for failure.
    failureCheck( params, summary );
}

/**
 * Final step of the action. If "failure_mode" is enabled, uses the summary
 * counts to determine whether this run meets the threshold and fails the
 * step accordingly.
 * 
 * @param {IActionInputs} params 
 * @param {ISummary | undefined} summary 
 */
function failureCheck( params: IActionInputs, summary: ISummary | undefined ) {

    if ( params.failure_mode !== FailureMode.None ) {

        // Expect a summary.
        if ( !summary ) {
            core.setFailed( 'The action completed, but is failed because "failure_mode" is enabled and no report summary could be parsed.' );
            return;
        }

        let severityVulnerabilities = 0;
        switch ( params.failure_mode ) {
            case FailureMode.High:
                severityVulnerabilities = summary.counts.high;
                break;

            case FailureMode.Medium:
                severityVulnerabilities = summary.counts.medium;
                break;

            case FailureMode.Low:
            default:
                severityVulnerabilities = summary.counts.low;
                break;
        }

        if ( severityVulnerabilities > 0 )
            core.setFailed( `The action completed, but is failed because "failure_mode" is set to "${params.failure_mode}" and ${severityVulnerabilities} vulnerabilities were reported with this severity.` );
    }
}

// RUNNIT!
run();