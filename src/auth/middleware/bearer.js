'use strict';

const { users } = require('../../models/index');

module.exports = async (req, res, next) => {
  try {
    // Check if the authorization header exists
    if (!req.headers.authorization) {
      return _authError();
    }

    // Extract the token from the Authorization header
    const token = req.headers.authorization.split(' ').pop();

    // Authenticate the token
    const validUser = await users.authenticateToken(token);

    // Attach the authenticated user to the request
    req.user = validUser;
    req.token = validUser.token;
    next();
  } catch (e) {
    console.error('Authentication error:', e);  // Log the error for debugging
    _authError();
  }

  function _authError() {
    res.status(401).json({ message: 'Invalid Login' });
  }
};
