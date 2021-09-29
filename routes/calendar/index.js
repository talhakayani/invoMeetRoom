const controller = require('../../controller/google-calendar.controller');
const router = require('express').Router();

router.post('/token/add', controller.addToken);
router.get('/token/:user_id', controller.getToken);
router.get('/token', controller.getAllTokens);
router.put('/add/:user_id', controller.addCalendar);
router.get('/find/:user_id', controller.getCalendarId);
module.exports = router;
