const fs = require('fs');
const path = require('path');
const app = require('../../connection/slack.connection');
const { getUsersInformation } = require('../command.services');

// this function will save the information for single time
exports.insertInformation = (fileName, data, type) => {
  let readedJSON = {};
  if (!fs.existsSync(fileName)) {
    fs.writeFileSync(fileName, '');
  } else {
    readedJSON = JSON.parse(fs.readFileSync(fileName));
  }
  switch (type) {
    case 'room-selection':
      readedJSON.selected_room = data;
      break;
    case 'meeting-with':
      readedJSON.selected_users = data;
      break;
    case 'meeting-date':
      readedJSON.selected_date = data;
      break;
    case 'meeting-time':
      readedJSON.selected_time = data;
      break;
  }

  fs.writeFileSync(fileName, JSON.stringify(readedJSON));
};

exports.getInformationFromTheFile = fileName => {
  // it will return an error when there no tempData.json file is exsits
  if (!fs.existsSync(fileName))
    return {
      error: true,
      message: "You're not providing any meeting related information",
    };
  const data = JSON.parse(fs.readFileSync(fileName));
  // it will return the JSON object when user select the room date and time
  if (
    data.hasOwnProperty('selected_room') &&
    data.hasOwnProperty('selected_date') &&
    data.hasOwnProperty('selected_time')
  ) {
    if (!data.selected_date && !data.selected_room && !data.selected_time)
      return {
        error: true,
        message:
          "please don't forget to select the Rooms Available, Meeting Date and Meeting time. Thank you",
      };
    return data;
  }

  // this will be return if user forget to select the date time and room for meeting
  return {
    error: true,
    message:
      "please don't forget to select the Rooms Available, Meeting Date and Meeting time. Thank you",
  };
};

exports.generatedTextForUsers = users => {
  if (!users.length) return '';
  if (users.length == 1) return `<@${users[0]}>`;
  let text = ' ';
  for (let i = 0; i < users.length - 1; i++) {
    text += '<@' + users[i] + '>, ';
  }
  text += `and <@${users[users.length - 1]}>`;
  return text;
};

exports.generatedTextForUsersWithName = users => {
  if (!users.length) return '';
  if (users.length == 1) return `${users[0]}`;
  let text = ' ';
  for (let i = 0; i < users.length - 1; i++) {
    text += '' + users[i] + ', ';
  }
  text += `and ${users[users.length - 1]}`;
  return text;
};

exports.sendErrorMessage = message => {
  return [
    {
      type: 'section',
      text: { type: 'mrkdwn', text: message },
    },
  ];
};

/**
 * Implementation of google calendar event
 */

const TIMEOFFSET = '+05:00';

const dateTimeForCalander = (dateTime, hours = 1) => {
  dateTime.replace(/-/g, ' ');
  const event = new Date(dateTime);
  const startDate = event;
  const endDate = new Date(
    new Date(startDate).setHours(startDate.getHours() + hours)
  );
  return {
    start: startDate,
    end: endDate,
  };
};

exports.eventForGoogleCalendar = information => {
  let dateTime = dateTimeForCalander(information.dateTime);
  let event = {
    summary: 'InvoMeet Room Reservation',
    location: information.location,
    sendNotifications: true,
    sendUpdates: 'all',
    description: information.message.replace(/\*/g, '').replace('/n', ' '),
    start: {
      dateTime: dateTime['start'],
      timeZone: 'Asia/Karachi',
    },
    end: {
      dateTime: dateTime['end'],
      timeZone: 'Asia/Karachi',
    },
    recurrence: ['RRULE:FREQ=DAILY;COUNT=1'],
    attendees: information.attendees,
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 10 },
      ],
    },
  };
  return event;
};

exports.getDateFromText = text => {
  let date = new Date();
  if (text.includes('today')) {
    return (
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    );
  }
  if (text.includes('yesterday')) {
    const yesterday = new Date();
    console.log('yesterday ' + yesterday.setDate(date.getDate() - 1));
    return (
      yesterday.getFullYear() +
      '-' +
      (yesterday.getMonth() + 1) +
      '-' +
      yesterday.getDate()
    );
  }
  const index = text.search(/([1-9])\w+/);
  if (index < 0) return null;

  date = text.slice(index, index + 10);
  date = date.split(' ')[0].split('-');
  if (date.length == 1) return null;
  if (date[1].length == 1) date[1] = '0' + date[1];
  if (date[2].length == 1) date[2] = '0' + date[2];
  return date.join('-');
};

exports.getDateAndTime = dateTimeForCalander;
