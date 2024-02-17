const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Username is required"],
  },
  socketId: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("User", userSchema);
