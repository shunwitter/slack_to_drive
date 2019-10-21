Upload Slack image post to Google Drive.

## Project Setup

### Google Cloud Platform

```
$ gcloud config configurations create your-gcp-project-id
$ gcloud config set project your-gcp-project-id

# Log-in
$ gcloud auth login
```


### Environment Variables

```
GOOGLE_APPLICATION_CREDENTIALS=''
SLACK_ACCESS_TOKEN = ''
```

Make sure you share your Google Drive folder with service account associated with GCP project.
Go to Slack API > Install App > OAuth Access Token to get `SLACK_ACCESS_TOKEN`.


## Local Development

Get service account credential (JSON file) from GCP console and save it in `./credentials` directory.

Use [localtunnel](https://github.com/localtunnel/localtunnel) or whatever you like.
Change Slack API > Event Subscriptions > Request URL to your local https URL.

```
npx functions-framework --target=photo_to_drive
```

`npm start` triggers the command above.
