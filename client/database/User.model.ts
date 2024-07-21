import { IUser } from "@/interfaces";
import { Schema, models, model } from "mongoose";

const UserSchema = new Schema({
  clerkId: { type: String, required: true },
  name: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  socketId: { type: String, default: null },
  profilePic: {
    type: String,
    default:
      "https://www.kindpng.com/picc/m/699-6997380_super-mii-avatar-png-transparent-png.png",
  },
  joinedGroups: [
    {
      type: Schema.Types.ObjectId,
      ref: "Group",
      default: [],
    },
  ],
});

const User = models?.User || model<IUser>("User", UserSchema);

export default User;
