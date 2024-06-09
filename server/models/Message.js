const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  isGroup: {
    type: Boolean,
    default: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Author is required"],
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: [true, "Group is required"],
  },
  isFile: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    required: [true, "Message is required"],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", messageSchema);
