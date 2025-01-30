const User = require('../models/user.model');

exports.checkPermission = (requiredPermission) => async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('role');
    if (user.role.permissions.includes(requiredPermission)) {
      next();
    } else {
      res.status(403).json({ error: 'Permission denied' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};