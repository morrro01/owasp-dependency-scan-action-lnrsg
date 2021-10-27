/* istanbul ignore file */

import { SCAN_OUTPUT_PATH } from "../src/constants";
import {
    FailureMode,
    IActionInputs,
    ReportFormat
} from "../src/types";

//
// TYPES
//
interface IActionInputsTestBase {
    title: string;
    inputs: {
        name: string;
        value: string;
    }[];
}

interface IActionInputsTest extends IActionInputsTestBase {
    output: IActionInputs | string;
}

interface IActionInputsScannerArgsTest extends IActionInputsTestBase {
    output: string[] | string;
}

//
// HELPER FUNCTIONS
//

/**
 * Helper function returning a GitHub action input in the correct normalized
 * format.
 * 
 * @param {string} name 
 * @returns {string}
 */
export const getActionInputName = ( name: string ): string =>
    `INPUT_${name.replace( / /g, '_' ).toUpperCase()}`;

/**
 * Helper function for setting a GitHub action input as an environment variable.
 * 
 * @param {string} name 
 * @param {string} value 
 */
export const setActionInput = ( name: string, value: string ) =>
    process.env[ getActionInputName( name )] = value;

/**
 * Helper function for resetting a GitHub action input environment variable.
 * 
 * @param {string} name 
 */
export const resetActionInput = ( name: string ) =>
    delete process.env[ getActionInputName( name )];

/**
 * Helper function for resetting all GitHub action input environment variables.
 */
export const resetActionInputs = () => {
    resetActionInput( 'github_token' );
    resetActionInput( 'project' );
    resetActionInput( 'path' );
    resetActionInput( 'format' );
    resetActionInput( 'scan_args' );
    resetActionInput( 'comment_on_pr' );
    resetActionInput( 'comment_title' );
    resetActionInput( 'upload_artifact' );
    resetActionInput( 'artifact_name' );
    resetActionInput( 'artifact_retention_days' );
    resetActionInput( 'failure_mode' );
}

//
// MOCK DATA
//

/**
 * inputs.test.ts
 * 
 * Valid tests.
 */
export const ValidInputsTests: IActionInputsTest[] = [
    {
        title: '"with" minimum valid action inputs',
        inputs: [
            { name: 'project', value: 'Test Project' },
            { name: 'path', value: '.' },
            { name: 'format', value: 'jSoN' },
            { name: 'comment_on_pr', value: 'false' },
            { name: 'upload_artifact', value: 'false' },
            { name: 'failure_mode', value: 'none' }
        ],
        output: {
            github_token: '',
            project: 'Test Project',
            path: '.',
            format: [ ReportFormat.JSON ],
            scan_args: [],
            comment_on_pr: false,
            comment_title: '',
            upload_artifact: false,
            artifact_name: '',
            artifact_retention_days: 30,
            failure_mode: FailureMode.None
        }
    },
    {
        title: '"with" valid pr commenting action inputs',
        inputs: [
            { name: 'github_token', value: 'abcd1234' },
            { name: 'project', value: 'Test Project' },
            { name: 'path', value: '.' },
            { name: 'format', value: 'jSoN,  HTml' },
            { name: 'comment_on_pr', value: 'true' },
            { name: 'upload_artifact', value: 'false' },
            { name: 'failure_mode', value: 'none' }
        ],
        output: {
            github_token: 'abcd1234',
            project: 'Test Project',
            path: '.',
            format: [ ReportFormat.JSON, ReportFormat.HTML ],
            scan_args: [],
            comment_on_pr: true,
            comment_title: '',
            upload_artifact: false,
            artifact_name: '',
            artifact_retention_days: 30,
            failure_mode: FailureMode.None
        }
    },
    {
        title: '"with" valid artifact upload action inputs',
        inputs: [
            { name: 'project', value: 'Test Project' },
            { name: 'path', value: '.' },
            { name: 'format', value: 'jSoN' },
            { name: 'comment_on_pr', value: 'false' },
            { name: 'upload_artifact', value: 'true' },
            { name: 'artifact_name', value: 'scan-report' },
            { name: 'artifact_retention_days', value: '90' },
            { name: 'failure_mode', value: 'none' }
        ],
        output: {
            github_token: '',
            project: 'Test Project',
            path: '.',
            format: [ ReportFormat.JSON ],
            scan_args: [],
            comment_on_pr: false,
            comment_title: '',
            upload_artifact: true,
            artifact_name: 'scan-report',
            artifact_retention_days: 90,
            failure_mode: FailureMode.None
        }
    },
    {
        title: '"with" valid kitchen sink action inputs',
        inputs: [
            { name: 'github_token', value: 'abcd1234' },
            { name: 'project', value: 'Test Project' },
            { name: 'path', value: '.' },
            { name: 'format', value: 'jSoN,  HTml,xml, CSV,JuniT,   SARif' },
            { name: 'scan_args', value: `--failOnCVSS 7
--enableRetired` },
            { name: 'comment_on_pr', value: 'true' },
            { name: 'comment_title', value: 'Scan Summary' },
            { name: 'upload_artifact', value: 'true' },
            { name: 'artifact_name', value: 'scan-report' },
            { name: 'artifact_retention_days', value: '90' },
            { name: 'failure_mode', value: 'low' }
        ],
        output: {
            github_token: 'abcd1234',
            project: 'Test Project',
            path: '.',
            format: [
                ReportFormat.JSON,
                ReportFormat.HTML,
                ReportFormat.XML,
                ReportFormat.CSV,
                ReportFormat.JUNIT,
                ReportFormat.SARIF
            ],
            scan_args: [
                '--failOnCVSS 7',
                '--enableRetired'
            ],
            comment_on_pr: true,
            comment_title: 'Scan Summary',
            upload_artifact: true,
            artifact_name: 'scan-report',
            artifact_retention_days: 90,
            failure_mode: FailureMode.Low
        }
    }
];

export const ValidScannerArgsTests: IActionInputsScannerArgsTest[] = [
    {
        title: 'generates with minimum valid input',
        inputs: [
            { name: 'project', value: 'Test Project' },
            { name: 'path', value: '.' },
            { name: 'format', value: 'jSoN' },
            { name: 'comment_on_pr', value: 'false' },
            { name: 'upload_artifact', value: 'false' },
            { name: 'failure_mode', value: 'none' }
        ],
        output: [
            `--project Test Project`,
            `--scan .`,
            `--out ${SCAN_OUTPUT_PATH}`,
            `--format JSON`,
            '--noupdate'
        ]
    },
    {
        title: 'generates with additional args',
        inputs: [
            { name: 'project', value: 'Test Project' },
            { name: 'path', value: '.' },
            { name: 'format', value: 'jSoN' },
            { name: 'scan_args', value: `--failOnCVSS 7
--enableRetired` },
            { name: 'comment_on_pr', value: 'false' },
            { name: 'upload_artifact', value: 'false' },
            { name: 'failure_mode', value: 'none' }
        ],
        output: [
            `--project Test Project`,
            `--scan .`,
            `--out ${SCAN_OUTPUT_PATH}`,
            `--format JSON`,
            '--noupdate',
            '--failOnCVSS 7',
            '--enableRetired'
        ]
    },
    {
        title: 'generates kitchen sink',
        inputs: [
            { name: 'project', value: 'Test Project' },
            { name: 'path', value: '.' },
            { name: 'format', value: 'jSoN,  HTml,xml, CSV,JuniT,   SARif' },
            {
                name: 'scan_args', value: `--failOnCVSS 7
--enableRetired` },
            { name: 'comment_on_pr', value: 'false' },
            { name: 'upload_artifact', value: 'false' },
            { name: 'failure_mode', value: 'none' }
        ],
        output: [
            `--project Test Project`,
            `--scan .`,
            `--out ${SCAN_OUTPUT_PATH}`,
            `--format JSON,HTML,XML,CSV,JUNIT,SARIF`,
            '--noupdate',
            '--failOnCVSS 7',
            '--enableRetired'
        ]
    },
    {
        title: 'generates kitchen sink as string',
        inputs: [
            { name: 'project', value: 'Test Project' },
            { name: 'path', value: '.' },
            { name: 'format', value: 'jSoN,  HTml,xml, CSV,JuniT,   SARif' },
            {
                name: 'scan_args', value: `--failOnCVSS 7
--enableRetired` },
            { name: 'comment_on_pr', value: 'false' },
            { name: 'upload_artifact', value: 'false' },
            { name: 'failure_mode', value: 'none' }
        ],
        output: `--project Test Project --scan . --out ${SCAN_OUTPUT_PATH} --format JSON,HTML,XML,CSV,JUNIT,SARIF --noupdate --failOnCVSS 7 --enableRetired`
    }
];

/**
 * inputs.test.ts
 *
 * Invalid tests.
 */
export const InvalidInputsTests: IActionInputsTest[] = [
    {
        title: '"with" invalid "project" action input',
        inputs: [
            { name: 'project', value: '' }
        ],
        output: `The "project" input must be provided, and not empty.`
    },
    {
        title: '"with" invalid "path" action input',
        inputs: [
            { name: 'project', value: 'Test Project' },
            { name: 'path', value: '' }
        ],
        output: `The "path" input must be provided, and not empty.`
    },
    {
        title: '"with" invalid "format" action input',
        inputs: [
            { name: 'project', value: 'Test Project' },
            { name: 'path', value: '.' },
            { name: 'format', value: '' }
        ],
        output: `The "format" input must be one or more of '${Object.values( ReportFormat ).join( "', '" )}' in comma-delimited format.`
    },
    {
        title: '"with" invalid "failure_mode" action input',
        inputs: [
            { name: 'project', value: 'Test Project' },
            { name: 'path', value: '.' },
            { name: 'format', value: 'JsOn' },
            { name: 'failure_mode', value: '' },
            { name: 'comment_on_pr', value: 'false' },
            { name: 'upload_artifact', value: 'false' }
        ],
        output: `The "failure_mode" input must be one of '${Object.values( FailureMode ).join( "', '" )}'.`
    },
    {
        title: '"with" invalid "github_token" action input when "comment_on_pr" enabled',
        inputs: [
            { name: 'project', value: 'Test Project' },
            { name: 'path', value: '.' },
            { name: 'format', value: 'JsOn' },
            { name: 'failure_mode', value: 'none' },
            { name: 'comment_on_pr', value: 'true' },
            { name: 'upload_artifact', value: 'false' }
        ],
        output: `The "github_token" input must be provided when "comment_on_pr" is true.`
    },
    {
        title: '"with" invalid "format" action input when "comment_on_pr" enabled',
        inputs: [
            { name: 'github_token', value: 'abcd_1234' },
            { name: 'project', value: 'Test Project' },
            { name: 'path', value: '.' },
            { name: 'format', value: 'hTmL' },
            { name: 'failure_mode', value: 'none' },
            { name: 'comment_on_pr', value: 'true' },
            { name: 'upload_artifact', value: 'false' }
        ],
        output: `The "format" input must include 'JSON' when "comment_on_pr" is true.`
    },
    {
        title: '"with" invalid "artifact_name" action input when "upload_artifact" enabled',
        inputs: [
            { name: 'project', value: 'Test Project' },
            { name: 'path', value: '.' },
            { name: 'format', value: 'hTmL' },
            { name: 'failure_mode', value: 'none' },
            { name: 'comment_on_pr', value: 'false' },
            { name: 'upload_artifact', value: 'true' },
            { name: 'artifact_name', value: '' }
        ],
        output: `The "artifact_name" input must be provided when "upload_artifact" is true.`
    },
    {
        title: '"with" invalid "format" action input when "failure_mode" is enabled',
        inputs: [
            { name: 'project', value: 'Test Project' },
            { name: 'path', value: '.' },
            { name: 'format', value: 'hTmL' },
            { name: 'failure_mode', value: 'high' },
            { name: 'comment_on_pr', value: 'false' },
            { name: 'upload_artifact', value: 'false' }
        ],
        output: `The "format" input must include 'JSON' when "failure_mode" is 'low', 'medium', or 'high'.`
    }
]