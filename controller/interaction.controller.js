const { generateMessageForUpdate } = require('../services/message.services');
const { scheduleJob } = require('node-schedule');
const {
  updateMessage,
  sendPrivateMessage,
  getUsersInformation,
} = require('../services/command.services');
const {
  updateMeetingStatus,
  addInvoMeeting,
  getRoomIdByRoomName,
  addGoogleAuthToken,
  getInformationByMeetingId,
  removeHistory,
} = require('../services/api.services');
require('dotenv').config('../../.env');
const fs = require('fs');
const { authorize } = require('../services/google_calander/auth');
const {
  addEvent,
  deleteGoogleCalendarEvent,
} = require('../services/google_calander/utils/operations');
const {
  insertInformation,
  getInformationFromTheFile,
  generatedTextForUsers,
  sendErrorMessage,
  eventForGoogleCalendar,
  getDateAndTime,
  generatedTextForUsersWithName,
} = require('../services/utils/helper-functions');

exports.interactions = async (req, res, _next) => {
  try {
    res.status(200).send();
    const payload = JSON.parse(req.body.payload);
    const { user, actions, container, channel } = payload;
    const credentials = JSON.parse(process.env.CREDENTIALS);
    if (!actions.length)
      return res.status(400).send('Please interact with elements');
    const [data] = actions;

    const { action_id } = data;
    let information,
      btnClicked = false;

    if (action_id == 'room-selection') {
      information =
        data.selected_option != null
          ? data.selected_option.text.text.split(' ')[0]
          : '';
    }
    if (action_id == 'meeting-with') {
      information = data.selected_users != null ? data.selected_users : [];
    }
    if (action_id == 'meeting-date') {
      information = data.selected_date != null ? data.selected_date : '';
    }
    if (action_id == 'meeting-time') {
      information = data.selected_time != null ? data.selected_time : '';
    }
    if (action_id == 'reserve-room-btn') {
      btnClicked = true;
      const selectedInformation = getInformationFromTheFile(
        `tempData${user.id}.json`
      );
      if (selectedInformation.error) {
        sendPrivateMessage(
          channel.id,
          user.id,
          'Something missing in given information, for correction please select different option first and then select back the orignial option that you want, Thank you',
          sendErrorMessage(selectedInformation.message)
        );
        return res.status(300).send();
      }

      const { blockJson, roomInfo } = await generateMessageForUpdate(
        selectedInformation
      );
      const { selected_room, selected_date, selected_time } =
        selectedInformation;
      let selected_users = null,
        emails = [],
        users_names = [];
      if (
        selectedInformation.hasOwnProperty('selected_users') &&
        selectedInformation.selected_users.length
      ) {
        selected_users = selectedInformation.selected_users;
        selected_users = await getUsersInformation(selected_users);
        for (let i = 0; i < selected_users.length; i++) {
          emails.push({ email: selected_users[i].user.profile.email });
          users_names.push(selected_users[i].user.profile.real_name);
        }
      }
      const messageForGoogleEvent = `*${selected_room} Room* is reserved for you with ${generatedTextForUsersWithName(
        users_names
      )} on *${selected_date}* at *${selected_time}*\nRoom is located at *${
        roomInfo.location
      }*`;

      let information = {
        dateTime: selected_date + ':' + selected_time,
        message: messageForGoogleEvent,
        attendees: emails != null ? emails : [],
        location: roomInfo.location + ', at InvoZone office',
      };
      const event = eventForGoogleCalendar(information);

      const oAuth2Client = await authorize(
        credentials,
        channel.id,
        user.id,
        true
      );

      const data = await addEvent(event, oAuth2Client);

      if (!data) {
        updateMessage(
          container.channel_id,
          container.message_ts,
          'Meeting Reserved',
          sendErrorMessage(
            "We're unable to create google event for now please try again or first configure the google calendar"
          )
        );
        if (fs.existsSync(`tempData${user.id}.json`))
          fs.unlinkSync(`tempData${user.id}.json`);

        return res.status(200).send();
      }
      const googleCalendarEventId = data.id;
      const meetingTime = getDateAndTime(information.dateTime, 1);
      const roomId = await getRoomIdByRoomName(
        selectedInformation.selected_room
      );
      const meeting = await addInvoMeeting(
        user.id,
        selectedInformation.selected_users + '',
        meetingTime.start,
        meetingTime.end,
        'InProgress',
        roomId,
        googleCalendarEventId
      );
      if (!meeting.data) {
        updateMessage(
          container.channel_id,
          container.message_ts,
          'Unable to create meeting',
          sendErrorMessage(
            meeting.hasOwnProperty('message')
              ? meeting.message
              : 'Something went wrong, please try agian later'
          )
        );
        const result = await deleteGoogleCalendarEvent(
          googleCalendarEventId,
          'primary',
          oAuth2Client
        );

        if (result) console.log('Event Deleted');
        else console.log('unable to delete an event');
        console.log('Meeting end');

        if (fs.existsSync(`tempData${user.id}.json`))
          fs.unlinkSync(`tempData${user.id}.json`);
        return res.status(200).send();
      }

      const meeting_id = meeting.meeting.meeting.id;

      scheduleJob(meetingTime.end, async () => {
        updateMeetingStatus(meeting_id);
        const result = await deleteGoogleCalendarEvent(
          googleCalendarEventId,
          'primary',
          oAuth2Client
        );

        if (result) console.log('Event Deleted');
        else console.log('unable to delete an event');
        console.log('Meeting end');
      });
      console.log('Meeting will end on: ' + meetingTime.end);

      blockJson.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Meeting will be end on: ${meetingTime.end}`,
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'End Meeting Now',
            emoji: true,
          },
          value: 'event is deleted',
          action_id: `endMeeting-${googleCalendarEventId}`,
        },
      });

      updateMessage(
        container.channel_id,
        container.message_ts,
        'Meeting Reserved',
        blockJson
      );

      if (fs.existsSync(`tempData${user.id}.json`))
        fs.unlinkSync(`tempData${user.id}.json`);
      return res.status(200).send();
    }

    if (action_id.includes('endMeeting')) {
      btnClicked = true;
      let googleCalendarRegisteredEventId;
      if (action_id.includes('private')) {
        googleCalendarRegisteredEventId = action_id.split('-')[2];
      } else {
        googleCalendarRegisteredEventId = action_id.split('-')[1];
      }

      console.log(googleCalendarRegisteredEventId);
      const meeting = await getInformationByMeetingId(
        googleCalendarRegisteredEventId
      );

      if (!meeting) {
        sendPrivateMessage(
          channel.id,
          user.id,
          'Unable to end meeting',
          sendErrorMessage('Meeting is already ended')
        );
        return res.status(200).send();
      }

      const oAuth2Client = await authorize(
        credentials,
        channel.id,
        user.id,
        true
      );
      const result = await deleteGoogleCalendarEvent(
        meeting.googleCalendarEventId,
        'primary',
        oAuth2Client
      );
      if (!result) {
        sendPrivateMessage(
          channel.id,
          user.id,
          'Unable to end meeting',
          sendErrorMessage(
            "We're really sorry for this because we're unable to end your meeting for you at the moment pleae verify that you're ending the meeting which is currently in progress, Thank you"
          )
        );

        return res.status(200).send();
      }
      const meetingInProgressUpdateResult = await updateMeetingStatus(
        meeting.id
      );

      if (action_id.includes('private')) {
        const textForUsers = generatedTextForUsers(
          meeting.reservedWith.split(',')
        );
        sendPrivateMessage(
          channel.id,
          user.id,
          'Meeting Deleted',
          sendErrorMessage('Your meeting with ' + textForUsers + ' is now end')
        );
        return res.status(200).send();
      }
      updateMessage(
        container.channel_id,
        container.message_ts,
        'Meeting End',
        sendErrorMessage(
          'Your meeting is Ended, It will be showed in your history.\nView your history by entering the command /meetings-history, Thank you'
        )
      );
    }

    if (action_id == 'token-input') {
      btnClicked = true;
      const { value } = actions[0];
      const oAuth2Client = await authorize(
        credentials,
        channel.id,
        user.id,
        true
      );
      oAuth2Client.getToken(value, async (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);

        const result = await addGoogleAuthToken(
          user.id,
          JSON.stringify(token),
          'primary'
        );
        if (!result) {
          updateMessage(
            container.channel_id,
            container.message_ts,
            'Unable to create Google Calendar Auth Token',
            sendErrorMessage('Unable to register the token')
          );
          return res.status(200).send();
        }
        updateMessage(
          container.channel_id,
          container.message_ts,
          'Google Calendar Auth token added',
          sendErrorMessage(
            'Token Saved! now you can run the application without /connect-google-calendar command'
          )
        );
        return res.status(200).send();
      });
      return res.status(200).send();
    }

    if (action_id == 'remove-history') {
      btnClicked = true;
      const response = await removeHistory(user.id);
      sendPrivateMessage(
        channel.id,
        user.id,
        'Message about history',
        sendErrorMessage(response)
      );
      return res.status(200).send();
    }
    if (!btnClicked) {
      insertInformation(`tempData${user.id}.json`, information, action_id);
    }
    return res.status(200).send();
  } catch (err) {
    console.log(err);
    return res.status(400).send();
  }
};
