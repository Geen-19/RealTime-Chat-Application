import React, { useEffect } from "react";
import "./Chat.css";
import EmojiPicker from "emoji-picker-react";
import { useUserStore } from "../../lib/userStore";
import { db } from "../../lib/firebase";
import {
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
const Chat = () => {
  const { chatId, user } = useChatStore();
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState("");
  const [chats, setChats] = React.useState([]);
  const [img, setImg] = React.useState({
    file : null,
    url : null
  });
  const {isReceiverBlocked} = useChatStore();
  const endRef = React.useRef(null);
  const { currentUser } = useUserStore();
  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), async (res) => {
      const items = res.data();
      setChats(items);
    });
    return () => unSub();
  }, [chatId]);
  const handleImage = (e) => {
    if(e.target.files[0]) {
      setImg({
        file : e.target.files[0],
        url : URL.createObjectURL(e.target.files[0])
      });
    }

  };
  const handleClickSend = async () => {
    if (text.trim() === "") return;
    let imgUrl = null;
    
    try {
      const newMessage = {
        text,
        senderId: currentUser.id,
        createdAt: new Date(),
      };
  
      // Update the chat messages in Firestore
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion(newMessage),
      });
  
      // Update the last message and isSeen status for both users
      const userIDs = [currentUser.id, user.id];
      for (const id of userIDs) {
        const userChatRef = doc(db, "userchats", id); // Fetch user chat by id
        const userChatSnap = await getDoc(userChatRef);
  
        if (userChatSnap.exists()) {
          const userChatData = userChatSnap.data();
          const chatIndex = userChatData.chats.findIndex(
            (chat) => chat.chatId === chatId
          );
  
          if (chatIndex !== -1) {
            // Update chat data
            userChatData.chats[chatIndex].lastMessage = text;
            userChatData.chats[chatIndex].isSeen = id === currentUser.id;
            userChatData.chats[chatIndex].updatedAt = Date.now();
  
            // Update Firestore with modified chat data
            await updateDoc(userChatRef, {
              chats: userChatData.chats,
            });
          }
        }
      }
    } catch (err) {
      console.error("Error sending message: ", err);
    } finally {
      setText(""); // Reset input field
      endRef.current.scrollIntoView({ behavior: "smooth" }); // Scroll to the latest message
    }
  };
  
  const handleSend = async (e) => {
    if (text.trim() === "") return;
    // check if the current user is blocked by the receiver

    // Send message when Enter key is pressed
    if (e.keyCode === 13 || e.key === "Enter") {
      try {
        const newMessage = {
          text,
          senderId: currentUser.id,
          createdAt: new Date(),
        };
  
        // Update the chat messages in Firestore
        await updateDoc(doc(db, "chats", chatId), {
          messages: arrayUnion(newMessage),
        });
  
        // Update the last message and isSeen status for both users
        const userIDs = [currentUser.id, user.id];
        for (const id of userIDs) {
          const userChatRef = doc(db, "userchats", id); // Fetch user chat by id
          const userChatSnap = await getDoc(userChatRef);
  
          if (userChatSnap.exists()) {
            const userChatData = userChatSnap.data();
            const chatIndex = userChatData.chats.findIndex(
              (chat) => chat.chatId === chatId
            );
  
            if (chatIndex !== -1) {
              // Update chat data
              userChatData.chats[chatIndex].lastMessage = text;
              userChatData.chats[chatIndex].isSeen = id === currentUser.id;
              userChatData.chats[chatIndex].updatedAt = Date.now();
  
              // Update Firestore with modified chat data
              await updateDoc(userChatRef, {
                chats: userChatData.chats,
              });
            }
          }
        }
      } catch (err) {
        console.error("Error sending message: ", err);
      } finally {
        setText(""); // Reset input field
        endRef.current.scrollIntoView({ behavior: "smooth" }); // Scroll to the latest message
      }
    }
  };
  
  const handleEmojiClick = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user.data().avatar || './avatar.png'} alt="" />
          <div className="texts">
            <span>{user.data().username}</span>
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>
        </div>
        <div className="icons">
          <img src="../phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="center">
        {chats.messages &&
          chats.messages.map((message) => (
            <div className={message.senderId === currentUser.id ? 'message own' : 'message'} key={message.id}>
              <div className="texts">
                <p>{message.text}</p>
              </div>
            </div>
          ))}

        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.png" alt="" />
          </label>
          <input type = "file" id = "file" style={{display: "none"}} onChange={handleImage} />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input
          type="text"
          name=""
          id=""
          value={text}
          placeholder={isReceiverBlocked ? "You can't send messages to this user, you have blocked this contact " : "Type a message"}
          onChange={(e) => setText(e.target.value)}
          onKeyUp={handleSend}
          disabled = {isReceiverBlocked}
        />
        <div className="emoji">
          <img
            src="./emoji.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmojiClick} />
          </div>
        </div>
        <button className="sendButton" onClick={handleClickSend} >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
