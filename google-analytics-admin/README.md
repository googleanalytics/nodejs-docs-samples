# Google Analytics Admin API examples

[![Open in Cloud Shell][shell_img]][shell_link]

[shell_img]: http://gstatic.com/cloudssh/images/open-btn.png
[shell_link]: https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleanalytics/nodejs-docs-samples&page=editor&open_in_editor=/google-analytics-admin/README.md

These samples show how to use the
[Google Analytics Admin API](https://developers.google.com/analytics/devguides/config/admin/v1) from Node.js.

## Build and Run

1.  **Enable APIs** - [Enable the Analytics Admin API](https://console.cloud.google.com/flows/enableapi?apiid=analyticsadmin.googleapis.com)
    and create a new project or select an existing project.
2.  **Download The Credentials** - Configure your project using [Application Default Credentials][adc].
    Click "Go to credentials" after enabling the APIs. Click "Create Credentials"
    and select "Service Account Credentials" and download the credentials file. Then set the path to
    this file to the environment variable `GOOGLE_APPLICATION_CREDENTIALS`:
    ```sh
    export GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
    ```
3.  **Clone the repo** and cd into this directory.
    ```sh
    git clone https://github.com/googleanalytics/nodejs-docs-samples
    cd nodejs-docs-samples/google-analytics-admin
    ```
4.  Install dependencies.
    ```sh
    npm install
    ```
5.  **Review the comments starting with `TODO(developer)` and update the code
    to use correct values.**
6.  **Run** with the command `node SAMPLE_FILE`. For example:
    ```sh
    node quickstart.js
    ```

[adc]: https://cloud.google.com/docs/authentication#adc
