import axios from "axios";
import { db } from "./firebaseApp";
import { addDoc, collection, doc, updateDoc, serverTimestamp, query, orderBy, onSnapshot, getDoc, deleteDoc, setDoc } from "firebase/firestore";
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
        const docRef = doc(db,"users",uid)
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
        const docRef = doc(db,"users",uid)
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
export const deleteHome = async (id, thumbnailDeleteUrl, imagesArray = []) => {
    try {
        // Opcionális: Képek törlése ImgBB-ről (ha a deleteUrl-ek működnek)
        // if (thumbnailDeleteUrl) await axios.get(thumbnailDeleteUrl);
        // for (const img of imagesArray) { if (img.delete_url) await axios.get(img.delete_url); }

        const docRef = doc(db, "apartments", id);
        await deleteDoc(docRef);
        return true;
    } catch (error) {
        console.error("Hiba a törléskor:", error);
        throw error;
    }
};

// 2. Ingatlan FRISSÍTÉSE (Képkezeléssel)
export const updateHome = async (id, updatedData, newThumbnailFile, newImagesFiles = []) => {
    try {
        let thumbnail = updatedData.thumbnail;
        let images = updatedData.images || [];

        // Új borítókép feltöltése, ha érkezett fájl
        if (newThumbnailFile) {
            const results = await uploadToImgBB(newThumbnailFile);
            if (results) thumbnail = results;
        }

        // Új galéria képek hozzáadása, ha érkeztek fájlok
        if (newImagesFiles.length > 0) {
            for (const file of newImagesFiles) {
                const res = await uploadToImgBB(file);
                if (res) images.push(res);
            }
        }

        const docRef = doc(db, "apartments", id);
        await updateDoc(docRef, {
            ...updatedData,
            thumbnail,
            images,
            lastModified: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error("Firestore frissítési hiba:", error);
        throw error;
    }
};

// Galéria kép törlése ImgBB-ről + Firestore-ból
export const deleteGalleryImage = async (apartmentId, imageObj, currentImages) => {
    try {
        // 1. ImgBB törlés
        if (imageObj.delete_url) {
            await axios.get(imageObj.delete_url);
        }

        // 2. Firestore frissítés – kivesszük a törölt képet
        const updatedImages = currentImages.filter(img => img.url !== imageObj.url);
        const docRef = doc(db, "apartments", apartmentId);
        await updateDoc(docRef, { images: updatedImages });

        return updatedImages;
    } catch (error) {
        console.error("Kép törlési hiba:", error);
        throw error;
    }
};


// 3. Egyetlen ingatlan lekérése (A te korábbi readHome-od, kicsit finomítva)
export const readHome = async (id, callback) => {
    try {
        const docRef = doc(db, "apartments", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            callback({ ...docSnap.data(), id: docSnap.id });
        } else {
            callback(null);
        }
    } catch (error) {
        console.error("Hiba a lekéréskor:", error);
    }
};

