import { create } from "zustand";
import { db } from "./firebase";
import { getDoc, doc } from "firebase/firestore";
import { useUserStore } from "./userStore";
import { toast } from "react-toastify";
import { updateDoc } from "firebase/firestore";
const useChatStore = create((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,
  changeChat: (chatId, user) => {
    const currentUser = useUserStore.getState().currentUser;
    console.log(currentUser);
    // check if user is BLOCKED
    if (user.data().blocked.includes(currentUser.id)) {
      return set({
        chatId,
        user: null,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
      });
    }
    // check if receiver is BLOCKED
    else if (currentUser.blocked.includes(user.id)) {
      return set({
        chatId,
        user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
      });
    } else {
      return set({
        chatId,
        user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: false,
      });
    }
  },

  blockUser: async (user) => {
    const currentUser = useUserStore.getState().currentUser;
    const userRef = doc(db, "users", currentUser.id); // Correct reference using doc
    const userDoc = await getDoc(userRef);
    const blockedUsers = userDoc.data().blocked || []; // Ensure blocked array exists
    blockedUsers.push(user.id); // Use the updateDoc method with the correct reference

    await updateDoc(userRef, { blocked: blockedUsers });

    set((state) => ({ ...state, isReceiverBlocked: true }));
    toast.success(`You have blocked ${user.data().username}`);
  },

  changeBlock: (user) => {
    set((state) => ({ ...state, isReceiverBlocked: !state.isReceiverBlocked }));
  },

  unBlockUser: async (user) => {
    const currentUser = useUserStore.getState().currentUser;
    const userRef = doc(db, "users", currentUser.id); // Correct reference using doc
    const userDoc = await getDoc(userRef);
    const blockedUsers = userDoc.data().blocked || []; // Ensure blocked array exists
    const newBlockedUsers = blockedUsers.filter((id) => id !== user.id);
    await updateDoc(userRef, { blocked: newBlockedUsers });
    set((state) => ({ ...state, isReceiverBlocked: false }));
    toast.success(`You have unblocked ${user.data().username}`);
  },
}));

export { useChatStore };
