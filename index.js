require('dotenv').config();
const { PassThrough } = require('stream');
const request = require('request');
const { google } = require('googleapis');

const SCOPES = [
  'https://www.googleapis.com/auth/drive',
];

exports.slack_to_drive = async (req, res) => {
  console.log('--- index.js ---');
  const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME;

  if (req.body.challenge) {
    // Verify Request URL only the first time
    return res.send({ challenge: req.body.challenge });
  }

  // Send 200 otherwize Slack retries multiple times
  // https://stackoverflow.com/questions/50715387/slack-events-api-triggers-multiple-times-by-one-message
  res.sendStatus(200);

  const { type, event } = req.body;
  const { text, files, user } = event;

  if (type !== 'event_callback') {
    return res.status(500).send('This event is not valid');
  }

  slackFile = files ? files[0] : undefined;
  if (!slackFile) {
    return res.status(500).send('No file from Slack');
  }

  const auth = await google.auth.getClient({ scopes: SCOPES });
  const drive = google.drive({ version: 'v3', auth });
  drive.files.list({
    corpora: 'allDrives',
    includeItemsFromAllDrives: true,
    supportsAllDrives: true,
    pageSize: 1,
    q: `name='${folderName}'`,
    fields: 'nextPageToken, files(id, name)',
  }, (driveError, driveRes) => {
    if (driveError) return console.log('The API returned an error: ' + driveError);
    const files = driveRes.data.files;
    if (files.length) {
      const folder = files.find(file => file.name === folderName);
      console.log('Folder id: ', folder.id);

      const photoUrl = slackFile.url_private;
      console.log('download url', photoUrl);
      const stream = request({
        url: photoUrl,
        method: 'GET',
        encoding: null,
        headers: {
          'Authorization': `Bearer ${process.env.SLACK_ACCESS_TOKEN}`,
          'Content-Type': 'application/json; charset=utf-8',
        },
      });

      // Use PassThrough otherwize stream will be empty
      // https://stackoverflow.com/questions/19553837/node-js-piping-the-same-readable-stream-into-multiple-writable-targets/40874999#40874999
      // https://github.com/aws/aws-sdk-js/issues/1277
      const pass = new PassThrough()
      stream.pipe(pass);

      const filename = text == null || text == '　' || text.match(/^\s$/) ? slackFile.name : text.replace(/\n/, '_');

      drive.files.create({
        requestBody: {
          parents: [folder.id],
          mimeType: slackFile.mimetype,
          originalFilename: slackFile.name,
          name: filename,
          contentHints: {
            indexableText: user,
          }
        },
        media: {
          mimeType: slackFile.mimetype,
          body: pass,
        },
        fields: 'id',
      }, (fileError, file) => {
        if (fileError) {
          console.error(fileError);
          returnres.status(500).end();
        } else {
          // console.log('File: ', file);
          res.status(200).end();
        }
      });

    } else {
      console.log('No files found.');
      res.status(500).end();
    }
  });

};
