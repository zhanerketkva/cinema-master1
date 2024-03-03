const mongoose = require('mongoose');
const Role = require('../models/Role');
const User = require('../models/User');

mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  const createRolesAndUsers = async () => {
    try {
      await Role.createCollection();
      await User.createCollection();

      const roles = [
        { id: 1, value: "USER" },
        { id: 2, value: "ADMIN" }
      ]
      await Role.insertMany(roles);

      const users = [
        { username: 'user1', password: 'password1', roles: ["USER"] },
        { username: 'admin1', password: 'password1', roles: ["ADMIN"] }
      ];
      await User.insertMany(users);
    } catch (error) {
    } finally {
      await mongoose.disconnect();
    }
  };

  createRolesAndUsers().then(() => {
    process.exit(0);
  });

}).catch(error => {
  process.exit(1);
});