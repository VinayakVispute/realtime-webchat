const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: [true, "Clerk ID is required"],
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  userName: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
  },
  socketId: {
    type: String,
    default: null,
  },
  profilePic: {
    type: String,
    default:
      "https://www.kindpng.com/picc/m/699-6997380_super-mii-avatar-png-transparent-png.png",
  },
  joinedGroups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: [],
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
