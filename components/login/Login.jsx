import React from "react";
import "./Login.css";
import {toast} from "react-toastify";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import { auth } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import upload from "../../lib/upload";
const Login = () => {
  const [avatar, setAvatar] = React.useState({
    file: null,
    url: "",
  });
  const [loading, setLoading] = React.useState(false);
  const handleRegister = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData(e.target);
    const {username, email, password} = Object.fromEntries(formData);
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const imgUrl = await upload(avatar.file)
        await setDoc(doc(db, "users", res.user.uid), {
            username,
            email,
            avatar: imgUrl,
            id: res.user.uid,
            blocked: [],
        });
        await setDoc(doc(db, "userchats", res.user.uid), {
            chats: [],
        });
        toast.success("User created successfully");
        
    }catch (error) {
        toast.error(error);
        //console.log(error);
    } finally {
        setLoading(false);
    }
  }
  const handleAvatar = (e) => {
    if (e.target.files.length > 0) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };
  const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const {email, password} = Object.fromEntries(formData);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Login successfully");
        }catch (error) {
            toast.error(error);
            console.log(error);
        }finally {
            setLoading(false);
            
        }
    }
  return (
    <div className="login">
      <div className="item">
        <h2>Welcome back</h2>
        <form onSubmit={handleLogin}>
          <input type="text" name="email" placeholder="Email" id="" />
          <input type="password" name="password" placeholder="Password" id="" />
          <button disabled = {loading}>Sign In</button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
        <h2>Create an Account</h2>
        <form action="" onSubmit={handleRegister}>
          <label htmlFor="file">
            <img src= {avatar.url ? avatar.url : "./avatar.png"} alt="" />
            Upload an Image</label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleAvatar}
          />
          <input type="text" name="username" placeholder="Username" id="" />
          <input type="text" name="email" placeholder="Email" id="" />
          <input type="password" name="password" placeholder="Password" id="" />
          <button disabled = {loading}> {loading ? 'Loading...' : 'SignUp'}</button>
        </form>
      </div>
      
    </div>
  );
};

export default Login;
