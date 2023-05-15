const express = require('express');
const app = express.Router();

require('./endpoints/auth')(app);
require('./endpoints/user')(app);
require('./endpoints/product')(app);
require('./endpoints/category')(app);
require('./endpoints/subCategory')(app);
require('./endpoints/location')(app);
require('./endpoints/private')(app);
require('.//endpoints/pharse')(app);
require('./endpoints/keystore')(app);

module.exports = app;