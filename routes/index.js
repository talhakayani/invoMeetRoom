const router = require('express').Router();

const commands = require('./commands.routes');
const interaction = require('./interactivity.routes');

const room = require('./room.routes');
const calendar = require('./calendar.routes');
const meeting = require('./meeting.routes');
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

//API Room, Meeting and Calendar Routes
router.use('/calendar', calendar);
router.use('/meetings', meeting);
router.use('/rooms', room);

//Slack Commands and Interaction Routes
router.use('/slack/slash-command', commands);
router.use('/slack/interactivity', interaction);

module.exports = router;
