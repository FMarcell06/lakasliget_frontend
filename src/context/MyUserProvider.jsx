import {
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { auth, db } from "../firebaseApp.js";
import { useNavigate } from "react-router-dom";
import { updateAvatar } from "../myBackend.js";
import { uploadImage } from "../cloudinaryUtils.js";
import { doc, getDoc } from "firebase/firestore";

export const MyUserContext = createContext();

export const MyUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState({});
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setMsg({});
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        setIsAdmin(docSnap.exists() && docSnap.data().isAdmin === true);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const signUpUser = async (email, displayName, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, { displayName });
      await sendEmailVerification(auth.currentUser);
      setMsg(
        (prev) => (
          { ...prev },
          { signUp: "Kattints az email címben küldött linkre!" }
        ),
      );
      logoutUser();
    } catch (error) {
      console.log(error);
      setMsg({ err: error.message });
    }
  };

  const logoutUser = async () => {
    await signOut(auth);
    setMsg({ signIn: false });
  };

  const signInUser = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const currentUser = auth.currentUser;
      if (!currentUser.emailVerified) {
        setMsg({
          signUp: "Kérlek kattints a az aktiváló linkre!",
          info: "Kérlek kattints a az aktiváló linkre!",
        });
        logoutUser();
        return;
      }
      setMsg({ signIn: true });
    } catch (error) {
      console.log(error);
      setMsg({ err: error.message });
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMsg({ resetPw: "A jelszó visszaállítási email elküldve!" });
    } catch (error) {
      setMsg({ err: error.message });
    }
  };

  const photoUpdate = async (file) => {
    try {
      const imageData = await uploadImage(file); // { url, public_id }
      if (imageData && imageData.url) {
        // 1. Firebase Auth profil frissítése
        await updateProfile(auth.currentUser, { photoURL: imageData.url });
        // 2. Firestore frissítése - most már az avatarUrl-t is átadjuk!
        await updateAvatar(
          auth.currentUser.uid,
          imageData.public_id,
          imageData.url,
        );
        // 3. Helyi állapot frissítése
        await auth.currentUser.reload();
        setUser({ ...auth.currentUser });
        setMsg({ updateProfile: "Sikeres mentés!" });
      }
    } catch (error) {
      setMsg({ err: "Hiba történt a profilkép frissítésekor!" });
    }
  };

  const deleteAccount = async (password) => {
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        password,
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await deleteUser(auth.currentUser);
      setMsg(null);
      setMsg({ serverMsg: "Felhasználói fiók törölve!" });
    } catch (error) {
      console.log(error);
      if (error.code == "auth/wrong-password") setMsg({ err: "Hibás jelszó!" });
      else setMsg({ err: "Hiba történt a fiók törlésekor!" });
    }
  };

  return (
    <MyUserContext.Provider
      value={{
        user,
        isAdmin,
        signUpUser,
        logoutUser,
        signInUser,
        msg,
        setMsg,
        resetPassword,
        photoUpdate,
        deleteAccount,
      }}
    >
      {children}
    </MyUserContext.Provider>
  );
};
