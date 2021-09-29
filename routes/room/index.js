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
module.exports = router;
