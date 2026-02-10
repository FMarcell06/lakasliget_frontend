import { createUserWithEmailAndPassword, deleteUser, EmailAuthProvider, onAuthStateChanged, reauthenticateWithCredential, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { createContext } from 'react'
import { auth } from '../firebaseApp.js'
import { useNavigate } from 'react-router-dom'
import { updateAvatar } from '../myBackend.js'


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
      const uploadResult = await uploadImage(file)
      console.log(uploadResult);
      if(uploadResult?.url) await updateProfile(auth.currentUser,{photoURL:uploadResult.url})
        await updateAvatar(user.uid,uploadResult.public_id)
        setUser({...auth.currentUser})
        setMsg(null)
        setMsg({updateProfile:"Sikeres profilmódosítás!"})
      
    } catch (error) {
        setMsg({err:error.message})
    }
  }

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
