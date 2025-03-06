import { useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";

interface MessageBubbleProps {
    message: string;
    timestamp: string;
    senderId: string;
    userId: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, timestamp, senderId }) => {
    const user = useSelector((state: RootState) => state.user._id);
    console.log(user,"userdata")
    const manager = useSelector((state: RootState) => state.manager._id);
    console.log(manager,"managerData")
    const UserID=user|| manager;
    const isSender = UserID === senderId;

    useEffect(() => {
        console.log("isSender:", isSender);
    }, []); // Only logs once

    return (
        <div className={`flex ${isSender ? "justify-end" : "justify-start"} mb-2`}>
            <div>
                <p
                    className={`px-3 py-2 rounded-lg max-w-fit ${isSender ? "bg-blue-200 text-black" : "bg-gray-200 text-black"}`}
                >
                    {message}
                </p>
                <span className="text-xs text-gray-500 mt-1">{timestamp}</span>
            </div>
        </div>
    );
};

export default MessageBubble;
