/**
 * Filename prefix of report files generated by the dependency scanner.
 */
export const REPORT_FILENAME_PREFIX = 'dependency-check-report';

/**
 * Location of the dependency scanner's bash file entry point.
 */
export const SCAN_PATH = '/usr/share/dependency-check/bin/dependency-check.sh';

/**
 * Output location in which the dependency scanner should place any generated
 * reports.
 */
export const SCAN_OUTPUT_PATH = '/github/workspace/reports';

/**
 * Full expected path to the JSON report file.
 */
export const SCAN_OUTPUT_PATH_JSON = `${SCAN_OUTPUT_PATH}/${REPORT_FILENAME_PREFIX}.json`;