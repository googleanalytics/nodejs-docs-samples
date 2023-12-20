// Copyright 2023 Google LLC
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

/**
 * Google Analytics Data API sample quickstart application.
 * This application demonstrates the usage of the Analytics Data API using
 * OAuth2 credentials.
 *
 * Before you start the application, please review the comments starting with
 * "TODO(developer)" and update the code to use correct values.
 *
 * Usage:
 * npm install
 * node quickstart_oauth2.js
 */
const {OAuth2Client} = require('google-auth-library');
const http = require('http');
const url = require('url');
const open = require('open');
const grpc = require('@grpc/grpc-js');
const destroyer = require('server-destroy');

// TODO(developer): Download the OAuth 2.0 client ID JSON from
// https://console.cloud.google.com/apis/credentials for a Desktop or Web
// client, and save it in the nodejs-docs-samples/google-analytics-data directory
// in a file named oauth2.keys.json.  If using a Web client, register
// http://127.0.0.1 as an authorized redirect URI.
const keys = require('./oauth2.keys.json');

async function main(propertyId = 'YOUR-GA4-PROPERTY-ID') {
  const oAuth2Client = await getAuthenticatedClient();

  // Imports the Google Analytics Data API client library.
  const {BetaAnalyticsDataClient} = require('@google-analytics/data');

  // Constructs a BetaAnalyticsDataClient using the credentials obtained above
  // instead of the Application Default Credentials.
  const credentials = grpc.credentials.combineChannelCredentials(
    grpc.credentials.createSsl(),
    grpc.credentials.createFromGoogleCredential(oAuth2Client)
  );
  const analyticsDataClient = new BetaAnalyticsDataClient({
    sslCreds: credentials,
  });

  // Runs a simple report.
  async function runReport() {
    console.log('Running report');
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '2020-03-31',
          endDate: 'today',
        },
      ],
      dimensions: [
        {
          name: 'city',
        },
      ],
      metrics: [
        {
          name: 'activeUsers',
        },
      ],
    });
    console.log('Report result:');
    response.rows.forEach((row) => {
      console.log(row.dimensionValues[0], row.metricValues[0]);
    });
  }

  runReport();
}

/**
* Create a new OAuth2Client, and go through the OAuth2 content workflow.
* Return the full client to the callback.
*/
function getAuthenticatedClient() {
  return new Promise((resolve, reject) => {
    // create an oAuth client to authorize the API call.  Secrets are kept in an
    // `oauth2.keys.json` file, which should be downloaded from the Google
    // Developers Console.
    const oAuth2Client = new OAuth2Client(
        keys.web.client_id,
        keys.web.client_secret,
        keys.web.redirect_uris[0],
    );

    // Generate the url that will be used for the consent dialog.
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/analytics.readonly',
      // Forces a prompt for consent, even if the user previously
      // granted access to the Web client.
      prompt: 'consent',
    });

    // Open an http server to accept the oauth callback. In this simple
    // example, the only request to our webserver is to
    // /oauth2callback?code=<code>
    const server = http
        .createServer(async (req, res) => {
          try {
            if (req.url.indexOf('/oauth2callback') > -1) {
              // acquire the code from the querystring, and close the web
              // server.
              const qs = new url.URL(req.url, 'http://127.0.0.1:3000')
                  .searchParams;
              const code = qs.get('code');
              console.log(`Code is ${code}`);
              res.end(
                  'Authentication successful! Please return to the console.');
              server.destroy();

              // Now that we have the code, use that to acquire tokens.
              const r = await oAuth2Client.getToken(code);
              // Make sure to set the credentials on the OAuth2 client.
              oAuth2Client.setCredentials(r.tokens);
              console.info('Tokens acquired.');
              resolve(oAuth2Client);
            } else {
              console.info(`Doing nothing with request URL ${req.url}`);
            }
          } catch (e) {
            reject(e);
          }
        })
        .listen(3000, () => {
          // open the browser to the authorize url to start the workflow
          open(authorizeUrl, {wait: false}).then((cp) => cp.unref());
          console.info(`Waiting for browser response from: ${authorizeUrl}`);
        });
    destroyer(server);
  });
}

// [END analyticsdata_quickstart_oauth2]

process.on('unhandledRejection', (err) => {
  console.error(err.message);
  process.exitCode = 1;
});
main(...process.argv.slice(2));
