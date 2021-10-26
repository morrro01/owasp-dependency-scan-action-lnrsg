import * as core from '@actions/core';
import { promises as fsp } from 'fs';
import { IReport } from './types';
export * from './types';

/**
 * Fetches a JSON-based report found at the provided file path.
 * 
 * @param {string} filePath 
 * @returns {Promise<IReport | undefined >}
 */
export async function getReport( filePath: string ): Promise<IReport | undefined> {
    let report: IReport | undefined;

    try {
        const content = await fsp.readFile( filePath, 'utf8' );
        const json = JSON.parse( content );

        if ( typeof json !== 'object' || json === null )
            throw new Error( `"${filePath}" is not a valid JSON file.` );

        report = ( json as IReport );
    } catch ( err: any ) {
        core.warning( err.message );
    }

    return report;
}