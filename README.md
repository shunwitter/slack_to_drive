Upload Slack image post to Google Drive.

## Project Setup

### Google Cloud Platform

```
$ gcloud config configurations create your-gcp-project-id
$ gcloud config set project your-gcp-project-id

# Log-in
$ gcloud auth login

# If you have multiple GCP accounts,
$ gcloud config set account you_email_address@example.com
```


### Environment Variables

```
GOOGLE_APPLICATION_CREDENTIALS=''
SLACK_ACCESS_TOKEN = ''
```

- Make sure you share your Google Drive folder with service account associated with GCP project.
- Make sure you also enable Google Drive API and the default service account have permission for it.
  - https://console.cloud.google.com/apis/library/drive.googleapis.com

Typical error log for permissions.

```
The API returned an error: Error: A Forbidden error was returned while attempting to retrieve an access token for the Compute Engine built-in service account. This may be because the Compute Engine instance does not have the correct permission scopes specified. Access Not Configured. Drive API has not been used in project 910402427064 before or it is disabled. Enable it by visiting https://console.developers.google.com/apis/api/drive.googleapis.com/overview?project=910402427064 then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our systems and retry.
```

- Go to Slack API > Install App > OAuth Access Token to get `SLACK_ACCESS_TOKEN`.


## Local Development

Get service account credential (JSON file) from GCP console and save it in `./credentials` directory.

Use [localtunnel](https://github.com/localtunnel/localtunnel) or whatever you like.
Change Slack API > Event Subscriptions > Request URL to your local https URL.

```
npx functions-framework --target=photo_to_drive
```

`npm start` triggers the command above.
