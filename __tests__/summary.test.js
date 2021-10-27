import * as summary from '../src/summary';
import * as report from '../src/report';
import * as _fixtures from './_fixtures';

describe( 'getSummary', () => {

    it( 'parses json file', async () => {

        const parsedReport = await report.getReport( _fixtures.MockGeneratedReportPath );
        expect( parsedReport ).toBeDefined();

        if ( !parsedReport )
            return;

        const parsedSummary = summary.getSummary( parsedReport );
        expect( parsedSummary ).toBeDefined();
        
        if ( !parsedSummary )
            return;

        expect( parsedSummary.project ).toEqual( 'Mock API' );
    });
});