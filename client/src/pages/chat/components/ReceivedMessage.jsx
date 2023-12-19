const ReceivedMessage = ({
  message = "Get Andrés on this movie ASAP!",
  sender = "Tom Cruise",
  timestamp = "12:45 pm",
}) => {
  return (
    <div className="flex items-start mb-2">
      <div className="bg-green-100 rounded-lg p-3 max-w-[70%]">
        <p className="text-xs text-gray-500">{sender}</p>
        <p className="text-sm">{message}</p>
        <p className="text-xs text-right text-gray-500 mt-1">{timestamp}</p>
      </div>
    </div>
  );
};

export default ReceivedMessage;
