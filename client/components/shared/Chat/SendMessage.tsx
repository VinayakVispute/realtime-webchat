import { getInitials } from "@/utils";
import { format } from "date-fns";

interface SendMessageProps {
  message: string;
  timestamp?: Date;
  name: string;
}

const SendMessage = ({
  message = "How are you doing today?",
  timestamp = new Date(),
  name = "Vinayak Vispute",
}: SendMessageProps) => {
  // Format the timestamp to a readable format
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
        <div className="relative mr-3 text-sm bg-indigo-100 dark:bg-indigo-700 py-2 px-4 shadow rounded-xl">
          <div>{message}</div>
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

export default SendMessage;
