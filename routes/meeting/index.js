const controller = require('../../controller/meetingController/meetingController');
const router = require('express').Router();

router.get('/', controller.getMeetings);
router.post('/add', controller.addMeeting);
router.put('/update/:id', controller.updateMeetingById);
router.get('/inProgress', controller.inProgressMeetings);
router.get('/history/:reservedBy', controller.getMeetingsHistory);
router.get('/inProgress/:reservedBy', controller.inProgressMeetingsByUser);
router.get('/info/:googleCalendarEventId', controller.getInformationByEventId);
router.delete('/history/remove/:reservedBy', controller.removeHistory);
module.exports = router;
