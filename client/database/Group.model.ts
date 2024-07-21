import { Schema, model, models } from "mongoose";
import { IGroup } from "@/interfaces";

const GroupSchema = new Schema({
  groupName: { type: String, required: true },
  groupId: {
    type: String,
    required: true,
    unique: true,
  },
  onlineUsers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: [],
    },
  ],
  groupPic: {
    type: String,
    default:
      "https://www.kindpng.com/picc/m/407-4070751_xbox-profile-pics-transparent-hd-png-download.png",
  },
});

const Group = models?.Group || model<IGroup>("Group", GroupSchema);

export default Group;
