const controller = require('../../controller/roomController/roomController');
const router = require('express').Router();
router.get('/', controller.getAllRooms);
router.get('/ids/:name', controller.getRoomId);
router.post('/add', controller.addRoom);
router.delete('/remove/:name', controller.removeRoom);
router.get('/meetings', controller.getAllRoomsAndMeetings);
router.get('/meetings/:name', controller.getMeetingsByRoom);
router.get('/meetings/user/:reservedBy', controller.getMeetingsByUser);
router.get(
  '/meetings/inProgress/user/:reservedBy',
  controller.getInProgressMeetingsByUser
);
router.get('/find/:name', controller.getRoomInfo);
// router.get('/available', controller.getAvailableRooms);
// router.get('/find/id/:id', controller.getRoomById);
// router.get('/find/location/:floor', controller.getRoomsByFloor);
// router.get('/find/name/:name', controller.getRoomByName);
// router.put('/update/status/:name', controller.updateRoomStatus);
// router.get('/find/meetings/:reservedBy', controller.getMeetingsByReserver);
// router.get('/find/room/isAvailable/:room', controller.isRoomAvailabe);
// router.get('/busy', controller.getBusyRooms);
module.exports = router;
