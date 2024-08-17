import { MessageParamsInterface } from "@/interfaces";
import { getInitials } from "@/utils";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Eye, Share, Edit } from "lucide-react";

const ReceivedMessage = ({
  message,
  timestamp,
  isFile,
  name,
}: MessageParamsInterface) => {
  const customFormat = "MMMM d, h:mm a";
  const formattedTimestamp = timestamp
    ? format(new Date(timestamp), customFormat)
    : "";

  return (
    <div className="col-start-1 col-end-8 p-3 rounded-lg">
      <div className="flex flex-row items-center">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
          {getInitials(name) ?? "A"}
        </div>
        <div className="relative ml-3 text-sm bg-white dark:bg-gray-800 py-2 px-4 shadow rounded-xl">
          {isFile ? (
            <div>
              <img
                src={message}
                alt="Uploaded file"
                className="rounded-lg mb-2"
              />
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <Share className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div>{message ?? ""}</div>
          )}
          {formattedTimestamp && (
            <div className="text-xs text-gray-500 mt-1">
              {formattedTimestamp}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceivedMessage;
