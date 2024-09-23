import {create} from 'zustand';
import {db} from './firebase';
import {getDoc, doc} from 'firebase/firestore';
const useUserStore = create((set) => ({
    currentUser: null,
    isLoading: false,
    fetchUserInfo: async (uid) => {
        if(!uid) return set({currentUser: null, isLoading: false});
        try {
            const userDoc = await getDoc(doc(db, "users", uid));
            if(userDoc.exists()) {
                const user = userDoc.data();
                
                set({currentUser: user, isLoading: false});
            } else {
                set({currentUser: null, isLoading: false});
            }
        } catch (error) {
            console.error(error);
            return set({currentUser: null, isLoading: false});
        }
    }
}));

export {useUserStore};