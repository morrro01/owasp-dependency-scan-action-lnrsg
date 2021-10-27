import * as exec from '@actions/exec';
import * as scanner from '../src/scanner';
import * as inputs from '../src/inputs';
import * as _fixtures from './_fixtures';
import { SCAN_OUTPUT_PATH, SCAN_PATH } from '../src/constants';

describe( 'scan', () => {

    it( 'calls exec', async () => {
        const spy: jest.SpyInstance = jest.spyOn( exec, 'exec' );
        spy.mockImplementation(() => Promise.resolve( expect.any( Number )));

        const inputArgs = [
            { name: 'project', value: 'Test Project' },
            { name: 'path', value: '.' },
            { name: 'format', value: 'jSoN' },
            { name: 'comment_on_pr', value: 'false' },
            { name: 'upload_artifact', value: 'false' },
            { name: 'failure_mode', value: 'none' }
        ];

        // Reset all environment variables.
        _fixtures.resetActionInputs();

        // Prepare the inputs.
        inputArgs.forEach( input =>
            _fixtures.setActionInput( input.name, input.value ));

        // Read/parse the inputs.
        const parsed = inputs.getInputs();

        // Call it.
        await scanner.scan( parsed );
        const cmd = `${SCAN_PATH} --project "Test Project" --scan . --out ${SCAN_OUTPUT_PATH} --noupdate --format JSON`;
        expect( spy ).toHaveBeenCalledWith( cmd );
    })
});