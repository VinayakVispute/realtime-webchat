import ChatSideBar from "../../../components/Chat/ChatSideBar";
import SendMessage from "../../../components/Chat/SendMessage";
import ReceivedMessage from "../../../components/Chat/ReceivedMessage";
const Chat = () => {
  return (
    <div className=" text-gray-800 dark:text-gray-100">
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        <ChatSideBar />
        <div className="flex flex-col flex-auto h-full">
          <div className="flex flex-col flex-auto flex-shrink-0  rounded-2xl bg-[rgba(255,255,255,0.1)] dark:bg-gray-900 h-full">
            <div className="flex flex-col overflow-x-hidden max-h-[74vh] mb-4">
              <div className="flex flex-col h-full">
                <div className="grid grid-cols-12 gap-y-2">
                  <SendMessage />
                  <ReceivedMessage />
                  <SendMessage />
                  <ReceivedMessage />
                  <ReceivedMessage />
                  <SendMessage />
                  <ReceivedMessage />
                  <SendMessage />
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center h-16 rounded-xl bg-white dark:bg-gray-800 w-full px-4">
              <div>
                <button className="flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex-grow ml-4">
                <div className="relative w-full">
                  <input
                    type="text"
                    className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10 bg-white dark:bg-gray-700 dark:border-gray-600"
                  />
                  <button className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-400">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="ml-4">
                <button className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0">
                  <span>Send</span>
                  <span className="ml-2">
                    <svg
                      className="w-4 h-4 transform rotate-45 -mt-px"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
