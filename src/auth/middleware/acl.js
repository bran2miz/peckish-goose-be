'use strict';

module.exports = (capability) => (req, res, next) => {
  try {
    if (req.user.capabilities.includes(capability)) {
      next();
    } else {
      next('Access Denied');
    }
  } catch (e) {
    next('Invalid Login, (acl middleware)');
  }
};