const axios = require('axios');

const DOMAIN = 'https://invomeetroom.herokuapp.com';
/**
 *  Rooms api Services
 */

exports.getAllRooms = async () => {
  try {
    const { data } = await axios.get(DOMAIN + '/rooms');
    return data.rooms;
  } catch (err) {
    console.log(err);
    return [];
  }
};

exports.getRoomInfoByName = async name => {
  try {
    const { data } = await axios.get(DOMAIN + `/rooms/find/${name}`);
    if (!data) return null;
    return data.rooms;
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.getAllRoomsWithAllMeetingsInProgress = async () => {
  try {
    const { data } = await axios.get(DOMAIN + '/rooms/meetings');
    return data.rooms;
  } catch (err) {
    console.log(err);
    return [];
  }
};

exports.getRoomIdByRoomName = async roomName => {
  try {
    const { data } = await axios.get(DOMAIN + `/rooms/ids/${roomName}`);
    if (!data.rooms.hasOwnProperty('id')) return null;
    return data.rooms.id;
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.getInProgressMeetingsByRooms = async roomName => {
  try {
    const { data } = await axios.get(DOMAIN + `/rooms/meetings/${roomName}`);
    if (!data) throw new Error('Something went wrong');
    return data.rooms;
  } catch (err) {
    console.log(err);
    return [];
  }
};

exports.getInProgressMeetingsByUser = async reservedBy => {
  try {
    const { data } = await axios.get(
      DOMAIN + `/rooms/meetings/inProgress/user/${reservedBy}`
    );
    if (!data) return [];
    return data.rooms;
  } catch (err) {
    console.log(err);
    return [];
  }
};

exports.getAllMeetingsByUser = async reservedBy => {
  try {
    const { data } = await axios.get(
      DOMAIN + `/rooms/meetings/user/${reservedBy}`
    );
    if (!data) return [];
    return data.rooms;
  } catch (err) {
    console.log(err);
    return [];
  }
};

/**
 * Google Calendar Configrations
 */
exports.addGoogleAuthToken = async (userId, token, calendarId) => {
  try {
    const { data } = await axios({
      method: 'post',
      url: DOMAIN + '/calendar/token/add',
      data: { userId, token, calendarId },
      headers: { 'Content-Type': 'application/json' },
    });
    if (!data) return null;
    return data;
  } catch (err) {
    console.log(err.message);
    return null;
  }
};

exports.getGoogleAuthToken = async user_id => {
  try {
    const { data } = await axios.get(DOMAIN + `/calendar/find/${user_id}`);
    if (!data.hasOwnProperty('data')) return null;
    return JSON.parse(data.data.token);
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.addGoogleCalendar = async (user_id, { calendarId }) => {
  try {
    const { data } = await axios.put(DOMAIN + `/calendar/add/${user_id}`, {
      calendarId,
    });
    if (!data) return null;
    return data.message;
  } catch (err) {
    console.log(err);
    return null;
  }
};
exports.getGoogleCalendarId = async user_id => {
  try {
    const { data } = await axios.get(DOMAIN + `/calendar/find/${user_id}`);
    if (!data) return null;
    return data.data.calendarId;
  } catch (err) {
    console.log(err);
    return null;
  }
};

/**
 *  Meeting API
 */

exports.addInvoMeeting = async (
  reservedBy,
  reservedWith,
  reservedFrom,
  reservedTo,
  inProgress = 'InProgress',
  roomId,
  googleCalendarEventId
) => {
  try {
    const { data } = await axios({
      method: 'post',
      url: DOMAIN + '/meetings/add',
      data: {
        reservedBy,
        reservedWith,
        reservedFrom,
        reservedTo,
        inProgress,
        roomId,
        googleCalendarEventId,
      },
      headers: { 'Content-Type': 'application/json' },
    });

    if (!data) throw new Error('No data found');
    return { data: true, meeting: data };
  } catch (err) {
    return {
      data: false,
      message: err.response.data.message.replace('Validation error:', ''),
    };
  }
};

exports.updateMeetingStatus = async meetingId => {
  try {
    console.log(meetingId);
    const { data } = await axios.put(DOMAIN + `/meetings/update/${meetingId}`);
    if (!data) return null;
    return data.message;
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.getMeetingHistory = async reservedBy => {
  try {
    const { data } = await axios.get(
      DOMAIN + `/meetings/history/${reservedBy}`
    );
    if (!data) return null;
    return data.meetings;
  } catch (err) {
    console.log(err);
    return err;
  }
};

exports.getInformationByMeetingId = async googleCalendarMeetingId => {
  try {
    const { data } = await axios.get(
      DOMAIN + `/meetings/info/${googleCalendarMeetingId}`
    );
    if (!data) return null;
    return data.meeting;
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.removeHistory = async userId => {
  try {
    const { data } = await axios.delete(
      DOMAIN + `/meetings/history/remove/${userId}`
    );
    if (!data) return null;
    return data.message;
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.getMeetingHistoryByDate = async (userId, date) => {
  try {
    const { data } = await axios.get(
      DOMAIN + `/meetings/history/${userId}/${date}`
    );
    if (!data) return null;
    return data.meetings;
  } catch (err) {
    console.log(err);
    return err;
  }
};
