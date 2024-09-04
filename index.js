'use strict';

require('dotenv').config();
const PORT = process.env.PORT;
const app = require('./src/server.js');
const { db } = require('./src/models/index.js');
console.log(db)
db.sync()
  .then(() => {
    app.start(PORT, () => console.log('server up'));
  })
  .catch((e) => {
    console.log(PORT)
    console.error('Could not start server', e.message);
  });