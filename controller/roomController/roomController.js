const { Room, Meeting } = require('../../models');
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

/*
exports.getAvailableRooms = async (req, res, _next) => {
  try {
    const query = {
      where: {
        status: 'available',
      },
    };
    const rooms = await Room.findAll(query);
    let message = 'Rooms Found!';
    //console.log(rooms);
    if (!rooms.length) message = 'No room available';
    return res.status(200).json({ status: 200, message, rooms });
  } catch (err) {
    return res
      .status(400)
      .json({ status: 400, message: err.message, rooms: [] });
  }
};


exports.getRoomsByFloor = async (req, res, _next) => {
  try {
    const floor = req.params.floor;
    if (!floor) throw new Error('Please spacify the room location in the path');
    const rooms = await Room.findAll({
      where: {
        location: floor,
      },
    });
    let message = 'Rooms found';
    if (!rooms.length) message = 'No meeting room found on this floor';
    return res.status(200).json({ status: 200, message, rooms });
  } catch (err) {
    return res
      .status(400)
      .json({ status: 400, message: err.message, rooms: [] });
  }
};

exports.getRoomById = async (req, res, _next) => {
  try {
    const id = req.params.id;
    if (!id) _next();
    const room = await Room.findOne({
      where: {
        id: id,
      },
    });
    let message = 'Room found';
    if (!room) message = 'No room found';
    return res.status(200).json({ status: 200, message, room });
  } catch (err) {
    return res.status(400).json({ status: 400, message: err.message });
  }
};

exports.getRoomByName = async (req, res, _next) => {
  try {
    const name = req.params.name;
    if (!name) throw new Error('Please provide the room id/name');
    const room = await Room.findOne({
      where: {
        name: name,
      },
    });
    let message = 'Room found';
    if (!room) message = 'No room found';
    return res.status(200).json({ status: 200, message, room });
  } catch (err) {
    return res.status(400).json({ status: 400, message: err.message });
  }
};

exports.updateRoomStatus = async (req, res, _next) => {
  try {
    const name = req.params.name;
    const { status, reservedBy, reservedWith, reservedFrom } = req.body;
    if (status == 0) throw new Error('Please attach the body');
    const result = await Room.update(
      { status, reservedBy, reservedWith, reservedFrom },
      {
        where: {
          name: name,
        },
      }
    );
    if (!result) throw new Error('Unable to update the record');
    return res.status(200).json({ status: 200, message: 'data updated' });
  } catch (err) {
    return res.status(400).json({ status: 400, message: err.message });
  }
};

exports.getMeetingsByReserver = async (req, res, _next) => {
  try {
    const { reservedBy } = req.params;
    if (!reservedBy) throw new Error('Please provide the params in the path');
    const query = {
      where: {
        reservedBy: reservedBy,
      },
    };
    const meetings = await Room.findAll(query);
    if (!meetings.length)
      return res
        .status(200)
        .json({ status: 200, message: 'No meeting found', meetings });
    return res
      .status(200)
      .json({ status: 200, message: 'Meetings found', meetings });
  } catch (err) {
    return res.status(300).json({ status: 300, message: err.message });
  }
};

exports.isRoomAvailabe = async (req, res, _next) => {
  try {
    const { room } = req.params;
    if (!room) throw new Error('Please provide the Room name in Path');
    const roomDetails = await Room.findOne({
      where: {
        name: room,
      },
    });
    if (!roomDetails) throw new Error('Something went wrong here');
    const data = roomDetails.dataValues;
    if (data.status === 'available')
      return res
        .status(200)
        .json({ status: 200, message: 'Room is available', isAvailable: true });
    return res.status(200).json({
      status: 200,
      message: `Room is busy`,
      reservedBy: roomDetails.reservedBy,
      reservedFrom: roomDetails.reservedFrom,
      reservedWith: roomDetails.reservedWith,
      isAvailable: false,
    });
  } catch (err) {
    return res.status(300).json({ status: 300, message: err.message });
  }
};

exports.getBusyRooms = async (req, res, _next) => {
  try {
    const rooms = await Room.findAll({
      where: {
        status: 'busy',
      },
    });
    let message = 'Rooms found';
    if (!rooms.length) message = 'No meeting room found on this floor';
    return res.status(200).json({ status: 200, message, rooms });
  } catch (err) {
    return res.status(400).json({ status: 300, message: err.message });
  }
};
*/
