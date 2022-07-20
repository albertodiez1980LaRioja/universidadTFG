'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = async function (req, res, next) {

    console.log('El sincronismo');
    next();
}


