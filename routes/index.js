const router = require('express').Router();

const commands = require('./commands');
const interaction = require('./Interactivity');

const room = require('./room');
const calendar = require('./calendar');
const meeting = require('./meeting');
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

router.use('/calendar', calendar);
router.use('/meetings', meeting);

router.use('/rooms', room);
router.use('/slack/slash-command', commands);
router.use('/slack/interactivity', interaction);
module.exports = router;
