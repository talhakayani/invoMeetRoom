const {
  sendPrivateMessage,
  sendMessageToSlackUrl,
} = require('../services/commands/command.services');
const {
  generateMessageForRooms,
  generateMesssageForMeetings,
  generateMessageForMeetingHistory,
} = require('../services/messages/message.services');
const {
  getAllRooms,
  getGoogleAuthToken,
  getInProgressMeetingsByUser,
  getAllRoomsWithAllMeetingsInProgress,
  getMeetingHistory,
} = require('../services/api/api.services');
require('dotenv').config('../../.env');
const fs = require('fs');
const { sendErrorMessage } = require('../services/utils/helper-functions');
const { authorize } = require('../services/google_calander/auth');

exports.roomsAvailable = async (req, res, _next) => {
  try {
    res.status(200).send();

    const { token, channel_id, user_id, command, text, response_url } =
      req.body;
    if (fs.existsSync(`tempData${user_id}.json`))
      fs.unlinkSync(`tempData${user_id}.json`);

    const rooms = await getAllRooms();
    if (rooms.length) {
      const message = generateMessageForRooms(rooms);
      sendMessageToSlackUrl(channel_id, 'Available Rooms', message);

      return res.status(200).send();
    }
    sendPrivateMessage(
      channel_id,
      user_id,
      'Confirmation Message',
      sendErrorMessage(
        "We're really sorry, currently no rooms are available. Please try again later"
      )
    );
    console.log('everything is running');
  } catch (err) {
    return res.status(400).end('Something went wrong');
  }
};

exports.connectToGoogleCalendar = async (req, res, _next) => {
  try {
    res.status(200).send();
    const { token, channel_id, user_id, command, text, response_url } =
      req.body;
    const credentials = JSON.parse(process.env.CREDENTIALS);

    const data = await getGoogleAuthToken(user_id);
    if (!data) {
      authorize(credentials, channel_id, user_id, false);
      return res.status(200).send();
    }

    sendPrivateMessage(
      channel_id,
      user_id,
      'Google Calendar Already Configured',
      sendErrorMessage('Google Calendar Already Configured')
    );
    return res.status(200).send();
  } catch (err) {
    console.log(err);
    return res.status(400).send();
  }
};

exports.my_meetings = async (req, res, _next) => {
  try {
    res.status(200).send();
    const { body } = req;
    const { user_id, channel_id } = body;
    const meetings = await getInProgressMeetingsByUser(user_id);
    if (!meetings.length) {
      sendPrivateMessage(
        channel_id,
        user_id,
        'Your meeting details',
        sendErrorMessage("You don't have any meeting for now")
      );
      return res.status(200).send();
    }
    const message = generateMesssageForMeetings(meetings);
    
    sendPrivateMessage(channel_id, user_id, 'Your Meetings', message);
   
  } catch (err) {
    console.log(err);
    return res.status(200).send();
  }
};

exports.getInfoReservedRooms = async (req, res, _next) => {
  try {
    res.status(200).send();
    const rooms = await getAllRoomsWithAllMeetingsInProgress();
    const { user_id, channel_id } = req.body;
    if (!rooms.length) {
      sendPrivateMessage(
        channel_id,
        user_id,
        'No meeting found in any room',
        sendErrorMessage('Currently there is no meeting room is reserved')
      );
      return res.status(200).send();
    }
    const message = generateMesssageForMeetings(rooms);

    sendPrivateMessage(
      channel_id,
      user_id,
      'Reserved Rooms Information',
      message
    );
    return res.status(200).send();
  } catch (err) {
    console.log(err);
    return res.status(400).send();
  }
};

exports.getEndMeetingsHistory = async (req, res, _next) => {
  try {
    res.status(200).send();
    const { user_id, channel_id } = req.body;
    const history = await getMeetingHistory(user_id);
    if (!history.length) {
      sendPrivateMessage(
        channel_id,
        user_id,
        'Your history is ready',
        sendErrorMessage(
          "Currently you don't have any history for meetings may be you reserve meetings but untill they are end it will not considered as history"
        )
      );
      return res.status(200).send();
    }
    const message = generateMessageForMeetingHistory(history);
    result = await sendPrivateMessage(
      channel_id,
      user_id,
      'Your history',
      message
    );
    return res.status(200).send();
  } catch (err) {
    console.log(err);
    return res.status(400).send();
  }
};
