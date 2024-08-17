import { MessageParamsInterface } from "@/interfaces";
import { getInitials } from "@/utils";
import { format } from "date-fns";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Eye, Share, Edit } from "lucide-react";

const SendMessage = ({
  message,
  timestamp,
  name,
  isFile,
}: MessageParamsInterface) => {
  const customFormat = "MMMM d, h:mm a";
  const formattedTimestamp = timestamp
    ? format(new Date(timestamp), customFormat)
    : "";

  return (
    <div className="col-start-6 col-end-13 p-3 rounded-lg">
      <div className="flex items-center justify-start flex-row-reverse">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
          {getInitials(name) ?? "A"}
        </div>

        {isFile ? (
          <div className="bg-indigo-100 dark:bg-indigo-700 mr-3 rounded-xl  py-2 px-4 relative max-w-[65%] ">
            <img
              src="http://localhost:3000/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdkawvablj%2Fimage%2Fupload%2Fv1723498276%2Fmsynitm6jdtminxp9kuy.jpg&w=1920&q=75"
              alt="Image"
              className="mx-auto w-full max-h-[200px] object-contain"
              width={200}
              height={100}
              style={{ aspectRatio: "200 / 100", objectFit: "cover" }}
            />
            <div className="flex items-center justify-between mt-2 text-xs">
              <span>2:34 PM</span>
              <Eye className="h-4 w-4 cursor-pointer" />
              <Share className="h-4 w-4 cursor-pointer" />
              <Edit className="h-4 w-4 cursor-pointer" />
            </div>
          </div>
        ) : (
          <div className="relative mr-3 text-sm bg-indigo-100 dark:bg-indigo-700 py-2 px-4 shadow rounded-xl">
            <div>{message}</div>
          </div>
        )}
        {formattedTimestamp && (
          <div className="text-xs text-gray-500 mt-1">{formattedTimestamp}</div>
        )}
      </div>
    </div>
  );
};

export default SendMessage;
