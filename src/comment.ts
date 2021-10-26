import * as core from '@actions/core';
import * as github from '@actions/github';
import { IActionInputs } from './types';
import * as summary from './summary';
import * as report from './report';
import * as constants from './constants';

/**
 * If enabled, a pull request comment will be added to the current context
 * using markdown generated from parsing the JSON report into a summary.
 * 
 * @param {IActionInputs} params 
 */
export async function generate( params: IActionInputs ): Promise<summary.ISummary | undefined> {
    let parsedSummary: summary.ISummary | undefined;

    core.startGroup( '✏️ PR Comment' );

    if ( params.comment_on_pr ) {

        const parsedReport = await report.getReport( constants.SCAN_OUTPUT_PATH_JSON );
        if ( !parsedReport ) {
            core.warning( `Report at "${constants.SCAN_OUTPUT_PATH_JSON}" failed to parse.` );
            return;
        }

        parsedSummary = summary.getSummary( parsedReport );
        if ( !parsedSummary ) {
            core.warning( `Failed to generate a summary from the report at "${constants.SCAN_OUTPUT_PATH_JSON}".` );
            return;
        }

        const message = summary.getSummaryMarkdown( params.comment_title, parsedSummary );
        
        const sent = await send( params.github_token, message );
        if ( !sent )
            core.warning( 'GitHub PR comment failed.' );
        else
            core.info( 'GitHub PR comment successful.' );
    } else {
        core.info( 'Not enabled; skipping.' );
    }

    core.endGroup();
}

/**
 * Adds a comment to the pull request in GitHub.
 * 
 * @param {string} token
 * @param {string} message 
 * @returns {boolean}
 */
async function send( token: string, message: string ): Promise<boolean> {
    let sent = false;

    try {
        const context = github.context;
        if ( !context.payload.pull_request || context.payload.pull_request === null )
            throw new Error( 'Action must be triggered by a pull_request.' );

        const pull_request = context.payload.pull_request;
        const octokit = github.getOctokit( token );

        await octokit.rest.issues.createComment({
            ...context.repo,
            issue_number: pull_request.number,
            body: message
        });

        sent = true;
    } catch ( err: any ) {
        core.warning( err.message );
    }

    return sent;
}