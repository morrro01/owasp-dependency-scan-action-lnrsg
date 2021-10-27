import * as report from '../src/report';
import * as _fixtures from './_fixtures';

describe( 'getReport', () => {

    it( 'parses json file', async () => {

        const parsedReport = await report.getReport( _fixtures.MockGeneratedReportPath );
        expect( parsedReport ).toBeDefined();
        expect( parsedReport!.projectInfo.name ).toEqual( 'Mock API' );
    });
});