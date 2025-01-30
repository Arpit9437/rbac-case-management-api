const User = require('../models/user.model');
const Role = require('../models/role.model');
const jwt = require('jsonwebtoken');

const authController = {
  async createSuperAdmin(req, res) {
    const {username, email, password} = req.body;
    try {
      const existingSuperAdmin = await User.findOne({ 'role.name': 'superAdmin' });

      if (existingSuperAdmin) {
        return res.status(400).json({ error: 'Super admin already exists' });
      }

      const superAdminRole = await Role.findOne({ name: 'superAdmin' });
      if (!superAdminRole) {
        return res.status(500).json({ error: 'Super admin role not found' });
      }

      const user = new User({
        username,
        email,
        password,
        role: superAdminRole._id,
        status: 'active'
      });

      await user.save();

      res.status(201).json({ 
        message: 'Super admin created successfully',
        username: user.username 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async login(req, res) {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username }).populate('role');
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role.name }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
      );

      res.json({ 
        token, 
        user: {
          id: user._id,
          username: user.username,
          role: user.role.name
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async logout(req, res) {
    // In a stateless JWT setup, we don't need to do anything server-side
    // The client should remove the token from storage
    res.json({ message: 'Logged out successfully' });
  }
};

module.exports = authController;