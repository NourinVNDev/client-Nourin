import React from 'react';
import { Button } from "@nextui-org/react";

interface ChatUIProps {
  selectedManager: string | null;
  allMessages: { message: string; timestamp: string }[];
  senderId: string;
  userId: string;
  postNewMessage: (message: string) => void;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setSelectedManager: React.Dispatch<React.SetStateAction<string | null>>;
}

const ChatUI: React.FC<ChatUIProps> = ({ selectedManager, allMessages, senderId, userId, postNewMessage, message, setMessage, setSelectedManager }) => {
  return (
    <div className={`w-2/3 min-h-screen p-4 transition-all ${selectedManager ? "block" : "hidden md:block"}`}>
    {selectedManager ? (
      <div className="flex flex-col h-full">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-3 bg-purple-500 text-white rounded-t-lg">
          <h2 className="text-lg font-bold">{selectedManager}</h2>
          <Button onClick={() => setSelectedManager(null)}>Close</Button>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100 rounded-b-lg">
      {allMessages.length > 0 ? (
        allMessages.map((msgObj, index) => (
          <div
            key={index}
            className={`flex ${senderId === userId ? "justify-end" : "justify-start"} mb-2`}
          >
            <div>
              <p
                className={`px-3 py-2 rounded-lg max-w-fit ${
                  senderId === userId ? "bg-blue-200 text-black" : "bg-gray-200 text-black"
                }`}
              >
                {msgObj.message}
              </p>
              <span className="text-xs text-gray-500 mt-1">
              {msgObj.timestamp}  {/* Display the current time */}
            </span>

            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Start the conversation...</p>
      )}
    </div>




        {/* Message Input */}
        <div className="flex items-center p-3 border-t bg-white rounded-b-lg">
          <input
            className="bg-white text-black rounded-lg px-4 py-2 flex-1 focus:ring-2 focus:ring-purple-500"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && message.trim()) postNewMessage(message);
            }}
          />
          <Button
            className="ml-3 px-4 py-2 text-white bg-purple-700 rounded-lg hover:bg-purple-800 transition"
            onClick={() => postNewMessage(message)}
            disabled={!message.trim()} // Disable button if message is empty
          >
            Send
          </Button>
        </div>
      </div>
    ) : (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a manager to start a chat
      </div>
    )}
  </div>
  );
};

export default ChatUI;
