// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

/** Google Analytics Data API sample application demonstrating the creation
of a funnel report.

See https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1alpha/properties/runFunnelReport
for more information.

 Before you start the application, please review the comments starting with
 "TODO(developer)" and update the code to use correct values.

 Usage:
 npm install
 node runFunnelReport.js
 */

function main(propertyId = 'YOUR-GA4-PROPERTY-ID') {
  // [START analyticsdata_run_funnel_report]

  // TODO(developer): Uncomment this variable and replace with your
  // Google Analytics 4 property ID before running the sample.
  // propertyId = 'YOUR-GA4-PROPERTY-ID';

  // Imports the Google Analytics Data API client library.
  const {AlphaAnalyticsDataClient} = require('@google-analytics/data').v1alpha;

  // Initialize client that will be used to send requests. This client only
  // needs to be created once, and can be reused for multiple requests.
  const analyticsDataClient = new AlphaAnalyticsDataClient();

  // Runs a funnel query to build a report with 5 funnel steps.
  // Step 1: First open/visit (event name is `first_open` or `first_visit`).
  // Step 2: Organic visitors (`firstUserMedium` dimension contains the term
  // "organic").
  // Step 3: Session start (event name is `session_start`).
  // Step 4: Screen/Page view (event name is `screen_view` or `page_view`).
  // Step 5: Purchase (event name is `purchase` or `in_app_purchase`).

  // The report configuration reproduces the default funnel report provided in
  // the Funnel Exploration template of the Google Analytics UI.
  // See more at https://support.google.com/analytics/answer/9327974
  async function runFunnelReport() {
    const [response] = await analyticsDataClient.runFunnelReport({
      property: `properties/${propertyId}`,
      dateRanges: [{startDate: '30daysAgo', endDate: 'today'}],
      funnelBreakdown: {
        breakdownDimension: { name: 'deviceCategory' },
      },
      funnel: {
        steps: [
          {
            name: 'First open/visit',
            filterExpression: {
              orGroup: {
                expressions: [
                  { funnelEventFilter: {eventName: 'first_open'}},
                  { funnelEventFilter: {eventName: 'first_visit'}}
                ]
              }
            }
          },
          {
            name: 'Organic visitors',
            filterExpression: {
              funnelFieldFilter: {
                fieldName: 'firstUserMedium',
                stringFilter: {
                  matchType: 'CONTAINS',
                  caseSensitive: false,
                  value: 'organic'
                }
              }
            }
          },
          {
            name: 'Session start',
            filterExpression: {
              funnelEventFilter: {
                eventName: 'session_start',
              }
            }
          },
          {
            name: 'Screen/Page view',
            filterExpression: {
              orGroup: {
                expressions: [
                  { funnelEventFilter: {eventName: 'screen_view'}},
                  { funnelEventFilter: {eventName: 'page_view'}},
                ]
              }
            }
          },
          {
            name: 'Screen/Page view',
            filterExpression: {
              orGroup: {
                expressions: [
                  { funnelEventFilter: {eventName: 'screen_view'}},
                  { funnelEventFilter: {eventName: 'page_view'}},
                ]
              }
            }
          },
          {
            name: 'Purchase',
            filterExpression: {
              orGroup: {
                expressions: [
                  { funnelEventFilter: {eventName: 'purchase'}},
                  { funnelEventFilter: {eventName: 'in_app_purchase'}},
                ]
              }
            }
          },
        ]
      }
    });
    printRunFunnelReportResponse(response);
  }

  // [START analyticsdata_print_run_funnel_report_response]
  // Prints contents of a FunnelSubReport object.
  function printFunnelSubReport(funnelSubReport) {
    console.log('Dimension headers:');
    funnelSubReport.dimensionHeaders.forEach(dimensionHeader => {
      console.log(dimensionHeader.name);
    });
    console.log('\nMetric headers:');
    funnelSubReport.metricHeaders.forEach(metricHeader => {
      console.log(metricHeader.name);
    });
    console.log('\nDimensions and metric values for each row in the report:');
    funnelSubReport.rows.forEach((row, rowIndex) => {
      console.log(`\nRow #${rowIndex}`);
      row.dimensionValues.forEach((dimensionValue, dimensionIndex) => {
        const dimensionName = funnelSubReport.dimensionHeaders[dimensionIndex].name;
        console.log(`\n${dimensionName}: ${dimensionValue.value}`);
      })

      row.metricValues.forEach((metricValue, metricIndex) => {
        const metricName = funnelSubReport.metricHeaders[metricIndex].name;
        console.log(`\n${metricName}: ${metricValue.value}`);
      })
    });

    console.log('\nSampling metadata for each date range:');
    funnelSubReport.metadata.samplingMetadatas.forEach((metadata, metadataIndex) => {
      console.log(`Sampling metadata for date range #${metadataIndex}: `
        `samplesReadCount=${metadata.samplesReadCount}, `
        `samplingSpaceSize=${metadata.samplingSpaceSize}`
        );
    });
  }

  // Prints results of a runFunnelReport call.
  function printRunFunnelReportResponse(response) {
    console.log('Report result:');
    console.log('=== FUNNEL VISUALIZATION ===');
    printFunnelSubReport(response.funnelVisualization);

    console.log('=== FUNNEL TABLE ===');
    printFunnelSubReport(response.funnelTable);
  }
  // [END analyticsdata_print_run_funnel_report_response]

  runFunnelReport();
  // [END analyticsdata_run_funnel_report]
}

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});
main(...process.argv.slice(2));
