const { Room, Meeting } = require('../models');
exports.getPost = (req, res, _next) => {
  return res.status(200).json({ status: 200, message: 'Server is connected' });
};

exports.addRoom = async (req, res, _next) => {
  try {
    const body = req.body;
    if (!body) throw new Error('Please provide the body');
    const result = await Room.create(body);
    if (!result) throw new Error('Unable to create user');
    return res
      .status(200)
      .json({ status: 200, message: 'user created', result });
  } catch (err) {
    return res.status(400).json({ status: 400, message: err.message });
  }
};

exports.getAllRooms = async (req, res, _next) => {
  try {
    const rooms = await Room.findAll();
    let message = 'Rooms Found!';
    if (!rooms.length) message = 'No room found';
    return res.status(200).json({ status: 200, message, rooms });
  } catch (err) {
    return res
      .status(400)
      .json({ status: 400, message: err.message, rooms: [] });
  }
};
exports.removeRoom = async (req, res, _next) => {
  try {
    const { name } = req.params;
    if (!name) throw new Error('Please attach the name as path parameter');
    const result = await Room.destroy({
      where: {
        name: name,
      },
    });
    let message = 'Room Deleted';
    if (!result) message = 'Room not found, Unable to delete the room';
    return res.status(200).json({ status: 200, message });
  } catch (err) {
    return res.status(400).json({ status: 400, message: err.message });
  }
};

exports.getAllRoomsAndMeetings = async (req, res, _next) => {
  try {
    const rooms = await Room.findAll({
      include: {
        model: Meeting,
        as: 'meetings',
        where: {
          inProgress: 'InProgress',
        },
      },
    });
    let message = 'Rooms Found!';
    if (!rooms.length) message = 'No room found';
    return res.status(200).json({ status: 200, message, rooms });
  } catch (err) {
    return res
      .status(400)
      .json({ status: 400, message: err.message, rooms: [] });
  }
};

exports.getMeetingsByRoom = async (req, res, _next) => {
  try {
    const { name } = req.params;
    if (!name) throw new Error('Please attach the name as path params ');
    const rooms = await Room.findAll({
      where: {
        name: name,
      },
      include: {
        model: Meeting,
        as: 'meetings',
      },
    });
    let message = 'Rooms Found!';
    if (!rooms.length) message = 'No room found';
    return res.status(200).json({ status: 200, message, rooms });
  } catch (err) {
    return res
      .status(400)
      .json({ status: 400, message: err.message, rooms: [] });
  }
};

exports.getMeetingsByUser = async (req, res, _next) => {
  try {
    const { reservedBy } = req.params;
    if (!reservedBy) throw new Error('Please attach the name as path params ');
    const rooms = await Room.findAll({
      include: {
        model: Meeting,
        as: 'meetings',
        where: {
          reservedBy: reservedBy,
        },
      },
    });
    let message = 'Rooms Found!';
    if (!rooms.length) message = 'No room found';
    return res.status(200).json({ status: 200, message, rooms });
  } catch (err) {
    return res
      .status(400)
      .json({ status: 400, message: err.message, rooms: [] });
  }
};

exports.getInProgressMeetingsByUser = async (req, res, _next) => {
  try {
    const { reservedBy } = req.params;
    if (!reservedBy) throw new Error('Please attach the name as path params ');
    const rooms = await Room.findAll({
      include: {
        model: Meeting,
        as: 'meetings',
        where: {
          reservedBy: reservedBy,
          inProgress: 'InProgress',
        },
      },
    });
    let message = 'Rooms Found!';
    if (!rooms.length) message = 'No room found';
    return res.status(200).json({ status: 200, message, rooms });
  } catch (err) {
    return res
      .status(400)
      .json({ status: 400, message: err.message, rooms: [] });
  }
};

exports.getRoomId = async (req, res, _next) => {
  try {
    const { name } = req.params;
    if (!name) throw new Error('Please attach the name of the room');
    const rooms = await Room.findOne({
      where: {
        name: name,
      },
    });
    let message = 'Room Found!';
    if (!rooms) message = 'No room found';
    return res.status(200).json({ status: 200, message, rooms });
  } catch (err) {
    return res
      .status(400)
      .json({ status: 400, message: err.message, rooms: [] });
  }
};

exports.getRoomInfo = async (req, res, _next) => {
  try {
    const { name } = req.params;
    if (!name) throw new Error('Please provide the name of the room');
    const rooms = await Room.findOne({
      where: {
        name: name,
      },
    });
    let message = 'Rooms Found!';
    if (!rooms) message = 'No room found';
    return res.status(200).json({ status: 200, message, rooms });
  } catch (err) {
    return res
      .status(400)
      .json({ status: 400, message: err.message, rooms: {} });
  }
};
