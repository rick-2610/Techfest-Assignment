import { useState, useEffect, useContext, createContext } from 'react'
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext()
export const UserAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [dbUser, setDbUser] = useState(null); // Django user profile

    const googleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);

        const res = await fetch('http://localhost:8000/api/add-user/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Email': result.user.email,
                'Name': result.user.displayName,
            },
        });

        const data = await res.json();
        setDbUser(data.user);

        return result;
    };

    const logOut = async () => {
        await signOut(auth);
        setDbUser(null);
    };

    // On page refresh, re-fetch Django profile if Firebase session exists
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser?.email) {
                try {
                    const res = await fetch('http://localhost:8000/api/user-details/',
                      {
                        headers: { 'Email': currentUser.email },
                      }
                    );
                    if (res.ok) {
                        const data = await res.json();
                        setDbUser(data);
                    }
                } catch (err) {
                    console.error('Failed to fetch user profile:', err);
                }
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, dbUser, setDbUser, googleSignIn, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};