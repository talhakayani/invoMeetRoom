const { Meeting, Room } = require('../../models');

exports.addMeeting = async (req, res, _next) => {
  try {
    const { body } = req;
    if (!body.hasOwnProperty('reservedBy')) {
      throw new Error('Please attach the body');
    }
    const result = await Meeting.create(body);
    return res
      .status(200)
      .json({ status: 200, message: 'Meeting created', meeting: result });
  } catch (err) {
    return res
      .status(400)
      .json({ status: 400, message: err.message, meeting: null });
  }
};
exports.getMeetings = async (req, res, _next) => {
  try {
    const meetings = await Meeting.findAll({
      include: {
        model: Room,
        as: 'room',
      },
    });
    let message = 'Meetings Found';
    if (!meetings.length) message = 'No meetings are available';
    return res.status(200).json({ status: 200, message, meetings });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

exports.updateMeetingById = async (req, res, _next) => {
  try {
    const { id } = req.params;
    if (!id) throw new Error('Please provide the Id ');
    const result = await Meeting.update(
      { inProgress: 'EndMeeting' },
      {
        where: {
          id: id,
        },
      }
    );

    let message = 'Meeting End';
    if (!result) message = 'Unable to end the meeting';
    return res.status(200).json({ status: 200, message });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

exports.inProgressMeetings = async (req, res, _next) => {
  try {
    const meetings = await Meeting.findAll({
      where: {
        inProgress: 'InProgress',
      },
      include: {
        model: Room,
        as: 'room',
      },
    });
    let message = 'Meetings Found';
    if (!meetings.length) message = 'No meetings are available';
    return res.status(200).json({ status: 200, message, meetings });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

exports.getMeetingsHistory = async (req, res, _next) => {
  try {
    const { reservedBy } = req.params;
    if (!reservedBy) throw new Error('please provide the user id');
    const meetings = await Meeting.findAll({
      where: {
        reservedBy: reservedBy,
        inProgress: 'EndMeeting',
      },
      include: {
        model: Room,
        as: 'room',
      },
    });
    let message = 'Meetings Found';
    if (!meetings.length) message = 'No meetings are available';
    return res.status(200).json({ status: 200, message, meetings });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

exports.inProgressMeetingsByUser = async (req, res, _next) => {
  try {
    const { reservedBy } = req.params;
    if (!reservedBy) throw new Error('Please provide the reserver id');
    const meetings = await Meeting.findAll({
      where: {
        reservedBy: reservedBy,
        inProgress: 'InProgress',
      },
      include: {
        model: Room,
        as: 'room',
      },
    });
    let message = 'Meetings Found';
    if (!meetings.length) message = 'No meetings are available';
    return res.status(200).json({ status: 200, message, meetings });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};
exports.getInformationByEventId = async (req, res, _next) => {
  try {
    const { googleCalendarEventId } = req.params;
    if (!googleCalendarEventId)
      throw new Error('please provide the Google Calendar Event Id');
    const meeting = await Meeting.findOne({
      where: {
        googleCalendarEventId: googleCalendarEventId,
        inProgress: 'InProgress',
      },
    });
    let message = 'Meeting found';
    if (!meeting) message = 'No meeting found';
    res.status(200).json({
      status: 200,
      message,
      meeting,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

exports.removeHistory = async (req, res, _next) => {
  try {
    const { reservedBy } = req.params;
    if (!reservedBy) throw new Error('Please add the user id as path params');
    const result = await Meeting.destroy({
      where: {
        reservedBy: reservedBy,
      },
    });
    let message = 'History cleared';
    if (!result) message = 'History already cleared';

    return res.status(200).json({
      status: 200,
      message,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};
