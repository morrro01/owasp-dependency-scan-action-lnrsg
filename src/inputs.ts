import * as core from '@actions/core';
import { SCAN_OUTPUT_PATH } from './constants';
import {
    FailureMode,
    IActionInputs,
    ReportFormat
} from './types';

/**
 * Returns an object containing the parsed inputs provided to the action.
 * 
 * @returns {IActionInputs}
 */
export function getInputs(): IActionInputs {
    const github_token = core.getInput( 'github_token' );
    
    const project = core.getInput( 'project' );
    if ( project.length === 0 )
        throw new Error( `The "project" input must be provided, and not empty.` );

    const path = core.getInput( 'path' );
    if ( path.length === 0 )
        throw new Error( `The "path" input must be provided, and not empty.` );

    let format: ReportFormat[] = [];
    core.getInput( 'format' )
        .split( ',' )
        .map( value => value.trim().toUpperCase() )
        .forEach( value => {
            if (( <any>Object ).values( ReportFormat ).includes( value )) {
                format.push( value as ReportFormat );
            } else {
                core.warning( `"${value}" is not a valid option for the "format" input, and will be ignored.` );
            }
        });
    if ( format.length === 0 )
        throw new Error( `The "format" input must be one or more of '${Object.values( ReportFormat ).join( "', '" )}' in comma-delimited format.` );

    const scan_args = core.getMultilineInput( 'scan_args' );
    const comment_on_pr = core.getBooleanInput( 'comment_on_pr' );
    const comment_title = core.getInput( 'comment_title' );
    const upload_artifact = core.getBooleanInput( 'upload_artifact' );
    const artifact_name = core.getInput( 'artifact_name' );
    const artifact_retention_days = Number( core.getInput( 'artifact_retention_days' ) || 30 );

    const failureModeValue = core.getInput( 'failure_mode' ).toLowerCase();
    if ( !( <any>Object ).values( FailureMode ).includes( failureModeValue ))
        throw new Error( `The "failure_mode" input must be one of '${Object.values( FailureMode ).join( "', '" )}'.` );
    const failure_mode = failureModeValue as FailureMode;

    // Validate commenting params.
    if ( comment_on_pr ) {
        if ( github_token.length === 0 )
            throw new Error( `The "github_token" input must be provided when "comment_on_pr" is true.` );

        if ( !format.includes( ReportFormat.JSON ))
            throw new Error( `The "format" input must include 'JSON' when "comment_on_pr" is true.` );
    }

    // Validate artifact params.
    if ( upload_artifact ) {
        if ( artifact_name.length === 0 )
            throw new Error( `The "artifact_name" input must be provided when "upload_artifact" is true.` );
    }

    // Validate failure mode param.
    if ( failure_mode !== FailureMode.None ) {
        if ( !format.includes( ReportFormat.JSON ))
            throw new Error( `The "format" input must include 'JSON' when "failure_mode" is 'low', 'medium', or 'high'.` );
    }

    return {
        github_token,
        project,
        path,
        format,
        scan_args,
        comment_on_pr,
        comment_title,
        upload_artifact,
        artifact_name,
        artifact_retention_days,
        failure_mode
    };
}

/**
 * Returns a collection of arguments passed to the scanner based on the provided
 * action inputs.
 * 
 * @param {IActionInputs} inputs 
 * @returns {string[]}
 */
export function getScannerArgs( inputs: IActionInputs ): string[] {
    let args: string[] = [
        `--project "${inputs.project}"`,
        `--scan ${inputs.path}`,
        `--out ${SCAN_OUTPUT_PATH}`,
        `--noupdate`
    ];

    inputs.format.forEach( format =>
        args.push( `--format ${format}` ));

    if ( inputs.scan_args )
        inputs.scan_args.forEach( arg => args.push( arg ));

    return args;
}

/**
 * Returns space-delimited string of arguments passed to the scanner based on
 * the provided action inputs.
 * 
 * @param {IActionInputs} inputs 
 * @returns {string}
 */
export function getScannerArgsString( inputs: IActionInputs ): string {
    const args = getScannerArgs( inputs );
    return args.join( ' ' );
}