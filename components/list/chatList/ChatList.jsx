import React, { useEffect } from "react";
import "./chatList.css";
import AddUser from "./AddUser";
import { useUserStore } from "../../../lib/userStore";
import { db } from "../../../lib/firebase";
import { onSnapshot, doc, updateDoc } from "firebase/firestore";
import {getDoc} from "firebase/firestore";
import { useChatStore } from "../../../lib/chatStore";
const ChatList = () => {
  const [addChat, setAddChat] = React.useState(false);
  const [chats, setChats] = React.useState([]);

  const { currentUser } = useUserStore();
  const { changeChat, user } = useChatStore();
  const handleSelect = async(chat) => {
    const userChats = chats.map((item) => {
      const {user, ...rest} = item;

      return rest;
    });

    const chatIndex = userChats.findIndex((item) => item.chatId === chat.chatId);
    
    userChats[chatIndex].isSeen = true;

    const userChatRef = doc(db, "userchats", currentUser.id);
    try {
      await updateDoc(userChatRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (error) {
      console.error(error);
    }

    
  }

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async(res) => {
      const items = res.data().chats;

      const promises = items.map(async (item) => {
        const userDocRef = await doc(db, "users", item.receiverId);
        const userDocSnap = await getDoc(userDocRef);

        const user = userDocSnap
        return {...item, user};
      }
      );
      const chatData = await Promise.all(promises);
      setChats(chatData);
      console.log(chats);
    });
    return () => unSub();
  }, [currentUser.id]);
  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input type="text" placeholder="search" />
        </div>
        <img
          src={addChat ? "./minus.png" : "./plus.png"}
          className="add"
          alt=""
          srcset=""
          onClick={() => setAddChat((prev) => !prev)}
        />
      </div>
      {chats &&
        chats.map((chat) => (
          <div className="item" key={chat.chatId} onClick={() => handleSelect(chat)}>
            <img src={chat.user && chat.user.data().avatar || './avatar.png'} alt="" />
            <div className="texts">
              <span>{chat.user && chat.user.data().username}</span>
              <p>{chat.lastMessage}</p>
            </div>
          </div>
        ))}

      {addChat && <AddUser />}
    </div>
  );
};

export default ChatList;
