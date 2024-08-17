"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  SendHorizonal,
  Paperclip,
  Image,
  FileText,
  Video,
  Smile,
} from "lucide-react";
import { useSocket } from "@/context/SocketProvider";
import { IChatLowerBarParams } from "@/interfaces";
import { useChat } from "@/context/ChatProvider";
import UploadDialog from "../Upload/UploadDialog";
import { uploadImageDirectly } from "@/lib/cloudinary";
import { toBase64Image } from "@/lib/utils";

const ChatLowerBar = ({ userName }: IChatLowerBarParams) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { state, dispatch } = useChat();
  const { currentActiveUser, groupDetails, author } = state;
  const { socket } = useSocket();

  const handleSendMessage = async () => {
    if (
      !socket?.connected ||
      !userName ||
      !currentActiveUser ||
      !currentActiveUser.groupType
    ) {
      console.log("Socket not connected or invalid user details");
      return;
    }

    if (!currentMessage && selectedImages.length === 0) {
      return;
    }

    const baseMessageData = {
      author,
      timestamp: new Date().toISOString(),
      group: groupDetails,
      isGroup: currentActiveUser.groupType === "group",
      receiver:
        currentActiveUser.groupType === "personal"
          ? {
              userName: currentActiveUser.groupName,
              _id: currentActiveUser._id,
              socketId: currentActiveUser.groupId,
            }
          : null,
    };

    let messagesToSend = [];

    if (selectedImages.length > 0) {
      const base64Images = await Promise.all(
        selectedImages.map((file) => toBase64Image(file))
      );
      console.log("base64Images", base64Images);

      const uploadedImages = await uploadImageDirectly({
        // Convert files to base64 strings
        base64Images: base64Images,
      });
      if (!uploadedImages || !uploadedImages.success) {
        console.error("Error uploading images");
        console.log(uploadedImages?.message);
        return;
      }
      const { data } = uploadedImages;
      messagesToSend = Object.values(data).map((imageUrl) => ({
        ...baseMessageData,
        isFile: true,
        message: imageUrl,
      }));
      setIsImageUploadOpen(false);
      setSelectedImages([]);
    } else {
      messagesToSend.push({
        ...baseMessageData,
        isFile: false,
        message: currentMessage,
      });
    }

    messagesToSend.forEach((messageData) => {
      socket.emit("send_message", messageData);
      dispatch({ type: "ADD_MESSAGE", payload: messageData });
    });

    setCurrentMessage("");
  };

  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedImages(files);
    setIsImageUploadOpen(true);
  };

  const handleImageUpdate = (updatedImages: File[]) => {
    setSelectedImages(updatedImages);
  };

  // const handleImageSubmit = (images: File[]) => {
  //   // Handle image upload and sending logic here
  //   console.log("Submitting images:", images);
  //   setIsImageUploadOpen(false);
  //   setSelectedImages([]);
  // };

  return (
    <div className="flex items-center h-16 rounded-xl bg-white dark:bg-gray-800 w-full px-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <Paperclip className="w-5 h-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start">
          <Command>
            <CommandInput placeholder="Select option..." />
            <CommandList>
              <CommandItem onSelect={handleImageSelect}>
                <Image className="mr-2 h-4 w-4" /> Images
              </CommandItem>
              <CommandItem>
                <FileText className="mr-2 h-4 w-4" /> Documents
              </CommandItem>
              <CommandItem>
                <Video className="mr-2 h-4 w-4" /> Videos
              </CommandItem>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
      />
      <Input
        onKeyUp={(e) => {
          e.key === "Enter" && handleSendMessage();
        }}
        type="text"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
        placeholder="Type a message"
        className="flex-grow ml-4 border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10 bg-white dark:bg-gray-700 dark:border-gray-600"
      />

      <Button
        onClick={handleSendMessage}
        className="ml-4 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
      >
        <span>Send</span>
        <SendHorizonal className="w-4 h-4 ml-2 -mt-px" />
      </Button>
      <Smile className="w-8 h-8 ml-2 -mt-px" />

      <Dialog open={isImageUploadOpen} onOpenChange={setIsImageUploadOpen}>
        <DialogContent className="sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%] bg-gray-800 border-gray-700">
          <UploadDialog
            images={selectedImages}
            onUpdate={handleImageUpdate}
            onSubmit={handleSendMessage}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatLowerBar;
