import axios from "axios";
import { db } from "./firebaseApp";
import { addDoc, collection, doc, updateDoc, serverTimestamp, query, orderBy, onSnapshot, getDoc } from "firebase/firestore";
import imageCompression from "browser-image-compression";

const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
const imgbbUrl = `https://api.imgbb.com/1/upload?key=${apiKey}`;

const compressionOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true
};

// 1. Kép tömörítése és feltöltése ImgBB-re
export const uploadToImgBB = async (file) => {
    try {
        const compressedFile = await imageCompression(file, compressionOptions);
        const formData = new FormData();
        formData.append("image", compressedFile);

        const resp = await axios.post(imgbbUrl, formData);
        return {
            url: resp.data.data.url,
            delete_url: resp.data.data.delete_url
        };
    } catch (error) {
        console.error("Feltöltési hiba:", error);
        return null;
    }
};

// 2. Új lakás/recept hozzáadása
export const addHome = async (apartment, imagesArray) => {
    try {
        const collectionRef = collection(db, "apartments");
        await addDoc(collectionRef, {
            ...apartment,      // Ebben már benne van a 'thumbnail' a handleSubmit-ből
            images: imagesArray, 
            timestamp: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error("Firestore mentési hiba:", error);
        throw error;
    }
};

// 3. Meglévő lakás/recept frissítése
export const updateRecipe = async (id, updatedData) => {
    try {
        const docRef = doc(db, "apartments", id);
        await updateDoc(docRef, {
            ...updatedData,
            lastModified: serverTimestamp()
        });
    } catch (error) {
        console.error("Firestore frissítési hiba:", error);
        throw error;
    }
};

// 4. Adatok lekérése (Valós idejű)
export const readHomes = (setRecipes, setLoading) => {
    const collectionRef = collection(db, "apartments");
    const q = query(collectionRef, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        setRecipes(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        setLoading(false);
    });
    return unsubscribe;
}


export const updateAvatar = async (uid , public_id)=>{
    let oldPublicId = null
    try {
        const docRef = doc(db,"avatars",uid)
        const docSnap = await getDoc(docRef)
        if(!docSnap.exists()){
            await setDoc(docRef ,{uid,public_id})
        }else{
            oldPublicId = docSnap.data().public_id
            await updateDoc(docRef,{public_id})
        }
        console.log("oldpublic" + oldPublicId);
        
        if(oldPublicId) await deleteImage(oldPublicId)

    } catch (error) {
        console.log("Hiba az avatár módosításakor!");
        
    }
}

export const deleteAvatar = async (uid) => {
    console.log(uid);
    let publicId = null
    try {
        const docRef = doc(db,"avatars",uid)
        const docSnap = await getDoc(docRef)
        if(!docSnap.exists()) return
        else {
            publicId = docSnap.data().public
            console.log("aasdasdsads"+publicId);
            
            await deleteImage(publicId)
            await deleteDoc(docRef)
        }
    } catch (error) {
        console.log("Avatár törlési hiba!");
        
    }
    
}

// Egyetlen ingatlan lekérése ID alapján
export const readHome = async (id, callback) => {
    try {
        const docRef = doc(db, "apartments", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            callback({ ...docSnap.data(), id: docSnap.id });
        } else {
            console.log("Nincs ilyen dokumentum!");
            callback(null);
        }
    } catch (error) {
        console.error("Hiba a lekéréskor:", error);
    }
};