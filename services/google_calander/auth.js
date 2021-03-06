const { google } = require('googleapis');
require('dotenv').config('../../.env');
const fs = require('fs');
const { sendMessageToSlackUrl } = require('../command.services');
const { generateMessageForToken } = require('../message.services');
const { getGoogleAuthToken } = require('../api.services');
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

exports.authorize = async (credentials, channel_id, user_id, forResponse) => {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  if (!forResponse) {
    return getAccessToken(oAuth2Client, channel_id, user_id);
  } else {
    const data = await getGoogleAuthToken(user_id);
    if (data) oAuth2Client.setCredentials(data);
  }
  return oAuth2Client;
};

function getAccessToken(oAuth2Client, channel_id, user_id) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  const message = generateMessageForToken(authUrl);
  sendMessageToSlackUrl(channel_id, 'Google Calendar Authentication', message);
  return oAuth2Client;
}
