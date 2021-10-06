require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');
const routes = require('./routes');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', routes);
// app.use('/api/slack-routes', (req, res) => {
//   return res.status(200).send(req.body.challenge);
// });
app.listen(PORT, async () => {
  await sequelize.sync();
  console.log(`Server is up and is running`);
});
