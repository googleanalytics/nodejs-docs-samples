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
 * Google Analytics Admin API sample quickstart application.
 * This application demonstrates the usage of the Analytics Admin API using
 * service account credentials.
 *
 * Before you start the application, please review the comments starting with
 * "TODO(developer)" and update the code to use correct values.
 *
 * Usage:
 * npm install
 * node quickstart.js
 */

function main() {
  // [START analytics_admin_quickstart]

  // Imports the Google Analytics Admin API client library.
  const analyticsAdmin = require('@google-analytics/admin');

  // Using a default constructor instructs the client to use the credentials
  // specified in GOOGLE_APPLICATION_CREDENTIALS environment variable.
  const analyticsAdminClient = new analyticsAdmin.AnalyticsAdminServiceClient();

  // Lists all Google Analytics accounts available to the authenticated user.
  async function listAccounts() {
    // Uses listAccounts() with no arguments to fetch all pages. For more
    // information on pagination in the Node.js library, see:
    // https://github.com/googleapis/gax-nodejs/blob/main/client-libraries.md#auto-pagination
    const [response] = await analyticsAdminClient.listAccounts();

    console.log('Accounts:');
    for (const account of response) {
      console.log('Account name:', account.name);
      console.log('Display name:', account.displayName);
      console.log('Region code:', account.regionCode);
      console.log('Create time:', account.createTime.seconds);
      console.log('Update time:', account.updateTime.seconds);
    }
  }

  listAccounts();
  // [END analytics_admin_quickstart]
}

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});
main(...process.argv.slice(2));
