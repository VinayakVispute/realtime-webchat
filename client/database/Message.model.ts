import { Schema, models, model } from "mongoose";
import { IMessage } from "@/interfaces";

const MessageSchema = new Schema({
  isGroup: { type: Boolean, required: true },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
    default: null,
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: "Group",
    default: null,
  },
  isFile: { type: Boolean, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, required: true },
});

const Message = models?.Message || model<IMessage>("Message", MessageSchema);

export default Message;
