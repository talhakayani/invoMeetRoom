const { CalendarConfig } = require('../models');

exports.addToken = async (req, res, _next) => {
  try {
    const { body } = req;
    if (!body) throw new Error('Please attach the body with this');
    const result = await CalendarConfig.create(body);
    if (!result) throw new Error('Something went wrong');
    return res.status(200).json({
      status: 200,
      message: result,
    });
  } catch (err) {
    return res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
};

exports.getToken = async (req, res, _next) => {
  try {
    const { user_id } = req.params;
    console.log(user_id);
    if (!user_id) throw new Error('Please provide the user id');
    const result = await CalendarConfig.findOne({
      where: {
        userId: user_id,
      },
    });
    if (!result)
      return res
        .status(200)
        .json({ status: 200, message: 'No Token found', token: result });
    return res
      .status(200)
      .json({ status: 200, message: 'Token found', token: result });
  } catch (err) {
    return res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
};

exports.getAllTokens = async (req, res, _next) => {
  try {
    const tokens = await CalendarConfig.findAll();
    if (!tokens.length)
      return res
        .status(200)
        .json({ status: 200, message: 'No Token Found', tokens });
    return res
      .status(200)
      .json({ status: 200, message: 'Tokens  Found', tokens });
  } catch (err) {
    return res.status(400).json({ status: 400, message: err.message });
  }
};
exports.addCalendar = async (req, res, _next) => {
  try {
    const { params, body } = req;
    const { user_id } = params;
    if (!body) throw new Error('Please attach the body with this');
    if (!user_id) throw new Error('Please provide the calendar Id');
    const result = await CalendarConfig.update(body, {
      where: {
        userId: user_id,
      },
    });

    if (result[0] == 0) throw new Error('No User Found');
    return res.status(200).json({
      status: 200,
      message: "User's calendar Id added",
    });
  } catch (err) {
    return res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
};

exports.getCalendarId = async (req, res, _next) => {
  try {
    const { user_id } = req.params;
    if (!user_id) throw new Error('Please attach the path params');
    const calendarId = await CalendarConfig.findOne({
      where: {
        userId: user_id,
      },
    });

    if (!calendarId)
      return res.status(200).json({ status: 200, message: 'No user found' });
    return res
      .status(200)
      .json({ status: 200, message: 'Calendar Id found', data: calendarId });
  } catch (err) {
    return res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
};
