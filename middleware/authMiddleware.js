const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Role = require('../models/role.model');

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.userId }).populate('role');

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

exports.isSuperAdmin = async (req, res, next) => {
  try {
    const superAdminRole = await Role.findOne({ name: 'superAdmin' });
    
    if (req.user.role._id.toString() === superAdminRole._id.toString()) {
      next();
    } else {
      res.status(403).send({ error: 'Access denied.' });
    }
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
};