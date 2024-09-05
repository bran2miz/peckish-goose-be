'use strict';

module.exports = (capability) => (req, res, next) => {
  try {
    if (req.user.capabilities.includes(capability)) {
      next();
    } else {
      console.error('Access Denied: User lacks capability', capability);
      next('Access Denied: You do not have the required capability');
    }
  } catch (e) {
    next('Invalid Login, (acl middleware)');
  }
};