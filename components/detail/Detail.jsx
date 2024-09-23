import React from "react";
import "./Detail.css";
import { auth } from "../../lib/firebase";
import {useUserStore} from "../../lib/userStore";
import {useChatStore} from "../../lib/chatStore";
const Detail = () => {

  const {user, blockUser, unBlockUser} = useChatStore();
  const {isReceiverBlocked} = useChatStore();
  const handleBlock = (user) => {
    blockUser(user);
  }
  const handleUnBlock = (user) => {
    unBlockUser(user);
  }
  return (
    <div className="detail">
      <div className="user">
        <img src={user.data().avatar || './avatar.png'} alt="" />
        <h2>{user.data().username}</h2>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy and Help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img src="./arrowDown.png" alt="" />
          </div>
          <div className="photos">
            <div className="photo-item">
              <div className="photoDetail">
                <img src="" alt="" />
                <span>photo_2024_2.png</span>
              </div>
              <img src="./download.png" className="icon" alt="" />
            </div>
            <div className="photo-item">
              <div className="photoDetail">
                <img src="" alt="" />
                <span>photo_2024_2.png</span>
              </div>
              <img src="./download.png" className="icon" alt="" />
            </div>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        {isReceiverBlocked ? <><button onClick ={() => handleUnBlock(user)}>UnBlock User</button></> : <> <button onClick ={() => handleBlock(user)}>Block User</button></>}
        <button className="logout" onClick={() => auth.signOut()}>LogOut</button>
      </div>
    </div>
  );
};

export default Detail;
