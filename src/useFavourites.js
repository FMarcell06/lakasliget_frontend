import { useState, useEffect, useContext } from "react";
import { readFavourites, toggleFavourite } from "./myBackend";
import { MyUserContext } from "./context/MyUserProvider";

export const useFavourites = () => {
    const { user } = useContext(MyUserContext);
    const [favourites, setFavourites] = useState([]);

    useEffect(() => {
        if (!user) return;
        const unsubscribe = readFavourites(user.uid, setFavourites);
        return () => unsubscribe();
    }, [user]);

    const toggle = (apartmentId) => {
        if (!user) return alert("A kedveléshez be kell jelentkezned!");
        toggleFavourite(user.uid, apartmentId);
    };

    const isFav = (apartmentId) => favourites.includes(apartmentId);

    return { favourites, toggle, isFav };
};