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
import { notify, updateAvatar } from "../myBackend.js";
import { uploadImage } from "../cloudinaryUtils.js";
import { collection, query, where, getDocs, deleteDoc, getDoc, doc, setDoc } from "firebase/firestore";
import axios from "axios";
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
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;

    await updateProfile(newUser, { displayName });
    await sendEmailVerification(newUser);

    // Előbb setDoc, AZTÁN logout
    await setDoc(doc(db, "users", newUser.uid), {
      uid: newUser.uid,
      contactName: displayName,
      contactEmail: email,
      contactPhone: "",
      contactType: "Magánszemély",
      avatarUrl: null,
      public_id: null,
      isAdmin: false,
    });

    await signOut(auth); // logoutUser helyett közvetlenül, hogy ne fusson notify
    notify.success("Kattints az email címben küldött linkre!");
    navigate("/signin");

  } catch (error) {
    console.log(error);
    notify.error("Hiba történt a regisztrációnál: " + error.message);
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
      notify.warning("Kérlek erősítsd meg az email címed!");
      logoutUser();
      return;
    }
    notify.success("Sikeres bejelentkezés!");
    setMsg({ signIn: true }); // ezt megtartod ha máshol még figyeled
    navigate("/")
  } catch (error) {
    console.log(error);
    notify.error("Hibás email vagy jelszó!");
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
        notify.success("Sikeres mentés!")
        setMsg({ updateProfile: "Sikeres mentés!" });
      }
    } catch (error) {
      notify.error("Hiba történt a profilkép firrítésekor!")
      setMsg({ err: "Hiba történt a profilkép frissítésekor!" });
    }
  };

const deleteAccount = async (password) => {
  try {
    // 1. Re-auth
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      password,
    );
    await reauthenticateWithCredential(auth.currentUser, credential);

    const uid = auth.currentUser.uid;

    // 2. Összes hirdetés törlése képekkel együtt
    const q = query(collection(db, "apartments"), where("uid", "==", uid));
    const snapshot = await getDocs(q);
    for (const apartmentDoc of snapshot.docs) {
      const data = apartmentDoc.data();
      if (data.thumbnail?.delete_url) await axios.get(data.thumbnail.delete_url).catch(() => {});
      if (data.images?.length > 0) {
        for (const img of data.images) {
          if (img.delete_url) await axios.get(img.delete_url).catch(() => {});
        }
      }
      await deleteDoc(doc(db, "apartments", apartmentDoc.id));
    }

    // 3. Profilkép törlése ha van
    const userSnap = await getDoc(doc(db, "users", uid));
    if (userSnap.exists() && userSnap.data().public_id) {
      await deleteImage(userSnap.data().public_id).catch(() => {});
    }

    // 4. Kedvencek törlése
    await deleteDoc(doc(db, "favourites", uid)).catch(() => {});

    // 5. User doc törlése
    await deleteDoc(doc(db, "users", uid));

    // 6. Auth user törlése
    await deleteUser(auth.currentUser);

    notify.success("Fiók sikeresen törölve!");
    setMsg(null);

  } catch (error) {
    console.log(error);
    if (error.code === "auth/wrong-password") setMsg({ err: "Hibás jelszó!" });
    else notify.error("Hiba történt a fiók törlésekor!");
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
