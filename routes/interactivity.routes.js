const interactivity = require('../controller/interaction.controller');
const router = require('express').Router();

router.use('/buttons', interactivity.interactions);

module.exports = router;
