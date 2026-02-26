import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseApp";
import { readHomes } from "../myBackend";
import { ApartCard } from "../components/ApartCard";
import { Header } from "../components/Header";
import { FaPhone, FaEnvelope, FaUser } from "react-icons/fa";

export const PublicProfile = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const [contactData, setContactData] = useState(null);
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      // User kontakt adatok betöltése
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setContactData(docSnap.data());

      // Hirdetések betöltése és szűrés uid alapján
      const allHomes = await readHomes();
      setHomes(allHomes.filter(h => h.uid === uid));
      setLoading(false);
    };
    load();
  }, [uid]);

  return (
    <div>
      <Header />
      {/* profil adatok + hirdetések megjelenítése */}
    </div>
  );
};