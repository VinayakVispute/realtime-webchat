const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: [true, "Group name is required"],
  },
  groupId: {
    type: String,
    required: [true, "Group id is required"],
  },
  onlineUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  groupPic: {
    type: String,
    default:
      "https://www.kindpng.com/picc/m/407-4070751_xbox-profile-pics-transparent-hd-png-download.png",
  },
});

module.exports = mongoose.model("Group", groupSchema);
