const mongoose = require('mongoose');
const mongoString = process.env.ATLAS_URI;

//Here the function to connect to the database through mongoose

module.exports = {
  connectToServer: function (callback) {
    mongoose.connect(mongoString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }, function (err) {
      if (!err) {
        console.log("Successfully connected to MongoDB.");
      }
      return callback(err);
    });
  },
};
