import React from "react";
import "../../addUser/AddUser.css";
import { db } from "../../../lib/firebase";
import { toast } from "react-toastify";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  getDoc,
  serverTimestamp,
  setDoc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { where } from "firebase/firestore";
import { useUserStore } from "../../../lib/userStore";
const AddUser = () => {
  const [users, setUsers] = React.useState([]);
  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setUsers(querySnapshot.docs[0].data());
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleAdd = async () => {
    // check if the current chat list already has the user thats about to be added here


    const chatCollectionRef = collection(db, "chats"); // Referencing the chats collection
    const userChatRef = doc(db, "userchats", users.id); // Referencing user chat for a specific user
    
    try {
      // check if the current chat list already has the user thats about to be added here
      const userChatDoc = await getDoc(userChatRef);
      const userChatData = userChatDoc.data();
      console.log(userChatData);
      const chatExists = userChatData.chats.some(
        (chat) => chat.receiverId === currentUser.id
      );  
      if (chatExists) {
        toast.error("Chat already exists");
        return;
      }
      // Create a new document in the 'chats' collection with an auto-generated ID
      const newChatRef = await addDoc(chatCollectionRef, {
        messages: [],
        createdAt: serverTimestamp(),
      });

      // Update the userchats document with the new chat ID
      await updateDoc(userChatRef, {
        chats: arrayUnion({
          chatId: newChatRef.id, // ID of the newly created chat
          receiverId: currentUser.id, // Assuming currentUser is defined elsewhere
          lastMessage: "",
          updatedAt: Date.now(),
        }),
      });

      // Update the currentUser's chats in userchats collection
      await updateDoc(doc(db, "userchats", currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          receiverId: users.id,
          lastMessage: "",
          updatedAt: Date.now(),
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="addUser">
      <form action="" onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" />
        <button>Search</button>
      </form>
      {users && (
        <div className="user">
          <div className="detail">
            <img src={users.avatar || "./avatar.png"} alt="" />
            <span>{users.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
