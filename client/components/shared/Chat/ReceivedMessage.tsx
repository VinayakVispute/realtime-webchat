import { MessageParamsInterface } from "@/interfaces";
import { getInitials } from "@/utils";
import { format } from "date-fns";

const ReceivedMessage = ({
  message = "How are you doing today?",
  timestamp = new Date(),
  isFile,
  sender,
}: MessageParamsInterface) => {
  const customFormat = "MMMM d, h:mm a";

  const formattedTimestamp = timestamp
    ? format(new Date(timestamp), customFormat)
    : "";
  return (
    <div className="col-start-1 col-end-8 p-3 rounded-lg">
      <div className="flex flex-row items-center">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
          {getInitials(sender) ?? "A"}
        </div>
        <div className="relative ml-3 text-sm bg-white dark:bg-gray-800 py-2 px-4 shadow rounded-xl">
          <div>{message ?? ""}</div>
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
