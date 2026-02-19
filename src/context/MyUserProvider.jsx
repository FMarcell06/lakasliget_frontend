import { createUserWithEmailAndPassword, deleteUser, EmailAuthProvider, onAuthStateChanged, reauthenticateWithCredential, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { createContext } from 'react'
import { auth } from '../firebaseApp.js'
import { useNavigate } from 'react-router-dom'
import { updateAvatar } from '../myBackend.js'
import { uploadImage } from '../cloudinaryUtils.js'


export const MyUserContext = createContext()

export const MyUserProvider = ({children}) => {
  const [user,setUser] = useState(null)
  const [msg,setMsg] = useState({})

  const navigate = useNavigate()
  useEffect(()=>{
    const unsubsrcibe = onAuthStateChanged(auth,(currentUser)=>{
      setMsg({})
      setUser(currentUser)
    })
    return ()=>unsubsrcibe()
  },[])

  const signUpUser = async (email,displayName,password)=>{
    console.log(email,displayName,password);
    try {
      await createUserWithEmailAndPassword(auth,email,password)
      await updateProfile(auth.currentUser,{displayName})
      await sendEmailVerification(auth.currentUser)
      console.log("visszaigazolo email elkuldve");
      
      console.log("sikerers regisztracio");
    setMsg(prev=>({...prev},{signUp:"Kattints az email címben küldött linkre!"}))
    logoutUser()
    } catch (error) {
      console.log(error);
      setMsg({err:error.message})
      
    }
    
  }

  const logoutUser = async ()=>{
    await signOut(auth)
    setMsg({signIn:false})
  }

  const signInUser = async (email,password)=>{
      try {
        await signInWithEmailAndPassword(auth,email,password)
        const currentUser = auth.currentUser
        if(!currentUser.emailVerified){
          setMsg({signUp:"Kérlek kattints a az aktiváló linkre!",info:"Kérlek kattints a az aktiváló linkre!"})
          logoutUser()
          return
        }
        console.log("Sikeres bejelentkezes");
        setMsg({signIn:true})
      } catch (error) {
        console.log(error);
        setMsg({err:error.message})
      }
  }

  const resetPassword = async (email)=> {
    let success = false
    try {
      await sendPasswordResetEmail(auth,email)
      setMsg({resetPw:"A jelszó visszaállítási email elküldve!"})
      console.log(msg);
      
      success = true
    } catch (error) {
      setMsg({err:error.message})
    }finally{
      
    }

    console.log(msg);
    
  }

const photoUpdate = async (file) => {
  try {
    // 1. Feltöltés a Cloudinary-ra a segédfüggvényünkkel
    const imageData = await uploadImage(file); // Megkapjuk: { url, public_id }
    
    if (imageData && imageData.url) {
      // 2. Firebase Auth profil frissítése (hogy látszódjon a kép)
      await updateProfile(auth.currentUser, { photoURL: imageData.url });

      // 3. Adatbázis (Firestore) frissítése a public_id-val
      await updateAvatar(auth.currentUser.uid, imageData.public_id);

      // 4. Frissítjük a helyi állapotot, hogy a UI azonnal változzon
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
      const credential = EmailAuthProvider.credential(auth.currentUser.email,password)
      await reauthenticateWithCredential(auth.currentUser,credential)
      await deleteUser(auth.currentUser)
      setMsg(null)
      setMsg({serverMsg:"Felhasználói fiók törölve!"})
    } catch (error) {
      console.log(error);
      if(error.code=="auth/wrong-password") setMsg({err:"Hibás jelszó!"})
      else setMsg({err:"Hiba történt a hiba törlésekor!"})
    }
  }

  return (
    <MyUserContext.Provider value={{user,signUpUser,logoutUser,signInUser,msg,setMsg,resetPassword,photoUpdate,deleteAccount}}>
      {children}
    </MyUserContext.Provider>
  )
}
