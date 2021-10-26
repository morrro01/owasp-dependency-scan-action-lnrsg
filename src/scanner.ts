import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as fsp from 'fs/promises';
import { IActionInputs } from './types';
import * as inputs from './inputs';
import {
    REPORT_FILENAME_PREFIX,
    SCAN_OUTPUT_PATH,
    SCAN_PATH
} from './constants';

/**
 * Runs the dependency scanner using the provided action inputs.
 * 
 * @param {IActionInputs} inputs 
 */
export async function scan( params: IActionInputs ): Promise<void> {
    core.startGroup( '🔬 OWASP Scan' );

    try {
        const args = inputs.getScannerArgs( params );

        core.info( `Command: '${SCAN_PATH} ${args.join( ' ' )}'` );
        await exec.exec( SCAN_PATH, args );

        const generated = await didReportsGenerate();
        if ( !generated )
            throw new Error( `Dependency scan failed; no files found in "${SCAN_OUTPUT_PATH}".` );

        core.info( 'OWASP scan successful.' );
    } catch ( err: any ) {
        core.warning( err.message );
    }

    core.endGroup();
}

/**
 * Whether the scan successfully completed, as determined by checking for the
 * presence of any appropriately named files in the output directory.
 * 
 * @returns {Promise<boolean>}
 */
export async function didReportsGenerate(): Promise<boolean> {
    let generated = false;

    try {
        const generatedFiles = await fsp.readdir( SCAN_OUTPUT_PATH );
        if ( generatedFiles.length > 0 ) {

            generated = generatedFiles.some( generatedFile =>
                generatedFile.indexOf( REPORT_FILENAME_PREFIX ) !== -1 );
        }
    } catch { }

    return generated;
}