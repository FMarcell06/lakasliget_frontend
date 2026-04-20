# LakásLiget — Ingatlanböngésző Alkalmazás

### LINK: https://lakasliget.netlify.app

## a) Az alkalmazás célja

A LakásLiget egy modern, webalapú ingatlanböngésző platform, amelynek célja, hogy egyszerűvé és átláthatóvá tegye a lakásbérlési folyamatot Budapesten. A platform lehetővé teszi magánszemélyek és ingatlanközvetítők számára, hogy hirdetéseket adjanak fel, illetve bérlők számára, hogy könnyen megtalálják az igényeiknek megfelelő ingatlant.

Az alkalmazás ingyenesen használható, regisztrációhoz kötött hirdetésfeladással, interaktív térképes kereséssel és részletes szűrési lehetőségekkel.

---

## b) Funkciók és menüpontok

### Főoldal (`/`)

A főoldal bemutatja az alkalmazást, kiemelt hirdetéseket jelenít meg, és interaktív térképen mutatja az elérhető ingatlanokat.

![Főoldal - banner](https://res.cloudinary.com/fmenv2025/image/upload/v1776361954/home1_wmlmxe.png)
![Főoldal - kiemelt lakások](https://res.cloudinary.com/fmenv2025/image/upload/v1776361959/home2_ybeida.png)
![Főoldal - térkép](https://res.cloudinary.com/fmenv2025/image/upload/v1776361969/home3_nfy8t0.png)



### Hirdetések (`/listings`)

Az összes aktív hirdetés listázása. Szűrési lehetőségek: ár, alapterület, szobaszám, kategória, bútorozott, kisállat, légkondicionáló, lift. Rendezés: legújabb, ár, terület, szobák szerint — növekvő/csökkenő sorrendben. Automatikus lazy loading görgetéskor.

![Hirdetések - összes hirdetés](https://res.cloudinary.com/fmenv2025/image/upload/v1776361697/apartments1_agbfpt.png)
![Hirdetések - találatok](https://res.cloudinary.com/fmenv2025/image/upload/v1776361698/apartments2_gug5pb.png)



### Hirdetés részletei (`/listing/:id`)

Egy adott ingatlan részletes adatlapja: képgaléria, műszaki jellemzők, leírás, hirdető adatai, interaktív térkép közeli egyetemekkel, boltokkal és edzőtermekkel.

![Hirdetés - képek](https://res.cloudinary.com/fmenv2025/image/upload/v1776361998/listing1_jtrqve.png)
![Hirdetés - adatok](https://res.cloudinary.com/fmenv2025/image/upload/v1776362004/listing2_tk0wpw.png)
![Hirdetés - hirdető](https://res.cloudinary.com/fmenv2025/image/upload/v1776362008/listing3_nom7s7.png)
![Hirdetés - térkép](https://res.cloudinary.com/fmenv2025/image/upload/v1776362008/listing4_yc6wgu.png)



### Hirdetés feladása (`/addnew`)

Bejelentkezett felhasználók hirdetést adhatnak fel. Cím megadható térképen kattintva, automatikus geocodinggal, vagy manuálisan. Képek feltölthetők borítóképként és galériába.

![Form - általános](https://res.cloudinary.com/fmenv2025/image/upload/v1776361879/form3_g7f93w.png)
![Form - térkép](https://res.cloudinary.com/fmenv2025/image/upload/v1776361880/form2_ji57qr.png)
![Form - műszaki](https://res.cloudinary.com/fmenv2025/image/upload/v1776361879/form3_g7f93w.png)
![Form - komfort](https://res.cloudinary.com/fmenv2025/image/upload/v1776361882/form4_o3mgoi.png)
![Form - feladás](https://res.cloudinary.com/fmenv2025/image/upload/v1776361880/form5_imb7t9.png)




### Hirdetés szerkesztése (`/edit/:id`)

Saját hirdetések szerkesztése. Admin felhasználók bármely hirdetést módosíthatják.

![Edit - általános](https://res.cloudinary.com/fmenv2025/image/upload/v1776361809/edit1_zijpim.png)
![Edit - műszaki](https://res.cloudinary.com/fmenv2025/image/upload/v1776361810/edit2_f4gqrw.png)
![Edit - komfort](https://res.cloudinary.com/fmenv2025/image/upload/v1776361811/edit3_vocvav.png)
![Edit - képek](https://res.cloudinary.com/fmenv2025/image/upload/v1776361813/edit4_dr9dnc.png)





### Profil (`/profile`)

A felhasználói saját profil kezelése: profilkép feltöltése/módosítása, elérhetőségi adatok szerkesztése (megjelenik a hirdetéseken), saját hirdetések és kedvencek megtekintése, fiók törlése.

![Profil - saját](https://res.cloudinary.com/fmenv2025/image/upload/v1776362115/profil1_um1cg5.png)
![Profil- kedvenc](https://res.cloudinary.com/fmenv2025/image/upload/v1776362120/profil2_i8tvht.png)
![Profil- kedvenc](https://res.cloudinary.com/fmenv2025/image/upload/v1776362120/profil3_zxivze.png)



### Publikus profil (`/users/:userid`)

A felhasználó nyilvános profilja, ahol más felhasználók láthatják a hirdetéseit és elérhetőségeit.

![Publicprofil](https://res.cloudinary.com/fmenv2025/image/upload/v1776362162/publicprofil1_h7t4qc.png)

### Bejelentkezés / Regisztráció (`/signin`, `/signup`)

Email + jelszó alapú autentikáció, email-megerősítés szükséges a fiók létrehozásához.

![signIn](https://res.cloudinary.com/fmenv2025/image/upload/v1776362213/signIn_qa3t48.png)
![signUp](https://res.cloudinary.com/fmenv2025/image/upload/v1776362223/signUp_v2twmy.png)



### Jelszó visszaállítás (`/pwreset`)

Elfelejtett jelszó esetén email alapú visszaállítás.

![pwreset](https://res.cloudinary.com/fmenv2025/image/upload/v1776362188/pwreset_o1t6cf.png)


### Admin panel (`/admin`)

Csak admin jogosultságú felhasználóknak elérhető. Hirdetések és felhasználók kezelése: szerkesztés, törlés.

![admin - adminpanel](https://res.cloudinary.com/fmenv2025/image/upload/v1776361636/admin1_mwmfbl.png)
![admin - admin felhasználók](https://res.cloudinary.com/fmenv2025/image/upload/v1776361637/admin2_kjvcvv.png)
![admin - hirdetések](https://res.cloudinary.com/fmenv2025/image/upload/v1776361638/admin3_jf3reu.png)



### Rólunk (`/about`)

![Rólunk - banner](https://res.cloudinary.com/fmenv2025/image/upload/v1776361531/about1_n6atwn.png)
![Rólunk - content](https://res.cloudinary.com/fmenv2025/image/upload/v1776361593/about2_yzmpm8.png)



---

## c) Reszponzív megjelenés mobilon

Az alkalmazás optimalizált mobilos nézetre is (reszponzív), 320px képernyőszélességig.

| Elem | Asztali nézet | Mobil nézet |
|---|---|---|
| Header | Vízszintes navigáció | Hamburger menü |
| Hirdetések | Oldalsó szűrő + lista | Szűrő felül, lista alatta |
| Hirdetés kártya | Széles elrendezés | Teljes szélességű |
| Bejelentkezés | Képslider + form egymás mellett | Csak form, logo eltűnik |
| Főoldal kártyák | 3 oszlopos rács | 1 oszlopos lista |

![Mobil - home](https://res.cloudinary.com/fmenv2025/image/upload/v1776362055/mobil1_jmli0k.png)
![Mobil - home](https://res.cloudinary.com/fmenv2025/image/upload/v1776362056/mobil2_fnikic.png)
![Mobil - home](https://res.cloudinary.com/fmenv2025/image/upload/v1776362057/mobil3_d6now6.png)


---
## d) Felhasznált technológiák

### ReactJS

A felhasználói felület React könyvtár segítségével készült. A React egy JavaScript alapú, komponens-orientált könyvtár, amelyet a Meta fejlesztett, és amelyet webalkalmazások felhasználói felületeinek építésére használnak.

**Főbb előnyei:**

| Tulajdonság | Leírás |
|---|---|
| Komponens-alapú felépítés | A felület kis, újrafelhasználható egységekre bontható, amelyek külön-külön fejleszthetők és tesztelhetők |
| Virtuális DOM | Csak a ténylegesen megváltozott részeket frissíti a böngészőben, ami gyorsabb megjelenítést eredményez |
| Egyirányú adatáramlás | Az adatok mindig szülőtől gyermek felé áramlanak, ami átláthatóbbá teszi a kódot |
| Nagy ökoszisztéma | Rengeteg kész könyvtár és eszköz érhető el hozzá, amelyek gyorsítják a fejlesztést |
| Aktív közösség | Széles körű dokumentáció és folyamatos fejlesztés áll mögötte |

**Komponensek**
A React alkalmazás kis, újrafelhasználható egységekre, úgynevezett komponensekre van bontva. Minden komponens a saját megjelenéséért és állapotáért felelős. A LakásLiget projektben például az `ApartCard`, a `Header` vagy az `ApForm` mind-mind egy-egy önálló komponens.

**React Router**
Az oldalak közötti navigációt a `react-router-dom` könyvtár biztosítja. Ez teszi lehetővé, hogy az alkalmazás különböző URL-ekhez különböző oldalakat rendeljen (pl. `/listings`, `/profile`, `/admin`) anélkül, hogy a böngésző ténylegesen új oldalt töltsön be.

**Context API**
A React beépített Context API-ja globális állapotkezelésre szolgál. Lehetővé teszi, hogy a bejelentkezett felhasználó adatai, az admin jogosultság és a különböző függvények (pl. bejelentkezés, kijelentkezés) globálisan elérhetők legyenek anélkül, hogy propsokon keresztül kellene őket mélyen továbbadni. Ez tisztább, átláthatóbb kódot eredményez, és megkönnyíti az állapot központi kezelését az alkalmazás teljes komponensfájában.

---

### Firebase

A backend alapját a Google Firebase szolgáltatása adja. A Firebase adatbázis használata egy React projektben jelentősen leegyszerűsíti a valós idejű adatkezelést, mivel automatikusan szinkronizálja az adatokat a kliensek között. Nem szükséges külön backend szervert építeni, így gyorsabban lehet fejleszteni. Emellett a beépített autentikáció és skálázhatóság lehetővé teszi, hogy kis projektektől egészen nagy alkalmazásokig hatékonyan használható legyen.

A projektben a Firebase két fő szolgáltatása kerül felhasználásra:

| Szolgáltatás | Szerepe a projektben |
|---|---|
| **Firestore** | NoSQL adatbázis — hirdetések, felhasználói adatok és kedvencek tárolása |
| **Authentication** | Regisztráció és bejelentkezés kezelése email-megerősítéssel |
 
**Adatmodell:**

```
┌─────────────────────────────────────────────────────┐
│                    FIRESTORE                        │
│                                                     │
│  users/{uid}                apartments/{id}         │
│  ┌─────────────────┐         ┌──────────────────┐   │
│  │ uid             │◄────────│ uid (ref)        │   │
│  │ contactName     │         │ title            │   │
│  │ contactEmail    │         │ address          │   │
│  │ contactPhone    │         │ price            │   │
│  │ contactType     │         │ area / rooms     │   │
│  │ avatarUrl       │         │ category         │   │
│  │ public_id       │         │ thumbnail        │   │
│  │ isAdmin         │         │ images[]         │   │
│  └─────────────────┘         │ lat / lon        │   │
│                              │ hidden           │   │
│  favourites/{uid}            │ timestamp        │   │
│  ┌─────────────────┐         │ contactName      │   │
│  │ ids[]           │         │ contactEmail     │   │
│  └─────────────────┘         │ contactPhone     │   │
│                              └──────────────────┘   │
└─────────────────────────────────────────────────────┘

  Firebase Auth          Cloudinary
  ┌──────────────┐       ┌──────────────────┐
  │ uid          │       │ avatarUrl        │
  │ email        │       │ public_id        │
  │ displayName  │       │ (képtárolás)     │
  │ photoURL     │       └──────────────────┘
  └──────────────┘
```

---

### Cloudinary

A profilképek tárolása Cloudinary felhőszolgáltatáson keresztül történik. Beépített képoptimalizálási és átméretezési lehetőségei révén gyorsabb betöltést biztosít különböző eszközökön. Emellett egyszerű API-ja megkönnyíti a képek feltöltését és kezelését.

---

### ImgBB

A hirdetések képeinek tárolása az ImgBB felhőszolgáltatáson keresztül történik. Ingyenes és egyszerűen integrálható képtároló megoldás, amely közvetlen elérési URL-t és törlési linket biztosít minden feltöltött képhez. Egyszerű REST API-ja révén a képfeltöltés és -kezelés gyorsan megvalósítható, a visszakapott URL-ek és törlési linkek pedig Firestore-ban tárolódnak a későbbi kezelhetőség érdekében.

---

### Node.js és Express.js

Node.js alapú backend, amely Express.js keretrendszerrel lett megvalósítva, és a Cloudinary képkezelő műveleteit végzi. A szerver aszinkron működésű végpontokat biztosít a frontend számára, mivel a Cloudinary külső API-hívásokat igényel. Az alkalmazás a Vercel platformon fut, serverless környezetben.

---

### Vitest + Testing Library

A Vitest egy modern, gyors tesztelő keretrendszer, amely kifejezetten a Vite-alapú projektekhez lett optimalizálva. Nagy előnye, hogy natívan támogatja az ES module-okat, villámgyors futást biztosít, és könnyen integrálható React alkalmazásokkal. A frontend komponensek tesztjei `@testing-library/react` segítségével, a backend logika pedig Supertest kombinációval van lefedve.


---

## e) Backend

A projekt két különálló backendrétegből áll:

### 1. Firebase backend (`myBackend.js`)

A Firebase Firestore SDK-n és saját utility függvényeken alapuló réteg, amely közvetlenül kommunikál a Firestore adatbázissal.

#### `readHomes()` → `Promise<Array>`

Visszaadja az összes látható hirdetést.

- **Visszatérés:** hirdetések tömbje `[{id, title, price, area, ...}]`
- **Hibakezelés:** üres tömböt ad vissza hiba esetén

#### `readHome(id, callback)` → `void`

Egy hirdetés valós idejű figyelése.

- **Paraméter:** `id` — hirdetés azonosítója, `callback(data)` — hívódik változáskor
- **Hibakezelés:** `callback(null)` ha nem található

#### `addHome(apartmentData, galleryImages)` → `Promise`

Új hirdetés létrehozása.

- **Paraméter:** `apartmentData` — hirdetés adatai, `galleryImages` — feltöltött képek tömbje
- **Visszatérés:** Firestore document referencia
- **Hibakezelés:** exception dobás, `notify.error` megjelenítés

#### `updateHome(id, updatedData, newThumbnail, newImages, isAdminEdit)` → `Promise`

Meglévő hirdetés frissítése.

- **Paraméter:** `id`, frissített adatok, opcionális új képek, admin flag
- **Megjegyzés:** admin szerkesztéskor az eredeti `uid` és kontakt adatok megőrződnek

#### `deleteHome(id, thumbnailDeleteUrl, images)` → `Promise`

Hirdetés törlése képekkel együtt.

- **Paraméter:** `id`, thumbnail és galéria törlési URL-ek
- **Hibakezelés:** képek törlési hibáját elnyeli, a Firestore rekord mindenképp törlődik

#### `deleteAccount(password)` → `Promise`

Felhasználói fiók teljes törlése.

- **Folyamat:** re-autentikáció → hirdetések törlése → profilkép törlése → kedvencek törlése → Firestore user doc törlése → Firebase Auth user törlése
- **Hibakezelés:** `auth/wrong-password` esetén hibaüzenet

#### `updateAvatar(uid, public_id, avatarUrl)` → `Promise`

Profilkép frissítése Cloudinaryban és Firestore-ban.

- **Paraméter:** `uid`, új `public_id` és `avatarUrl`
- **Megjegyzés:** régi kép automatikusan törlődik

#### `notify` utility

Toast értesítések megjelenítése.

- `notify.success(msg)` — zöld értesítés
- `notify.error(msg)` — piros értesítés
- `notify.warning(msg)` — sárga értesítés
- `notify.info(msg)` — kék értesítés

---

### 2. Express + Cloudinary backend (`index.js`)

### Repo LINK: https://github.com/FMarcell06/lakasliget_backend

**Szerver:** `Express.js` | **Deployment:** Vercel | **Képtárolás:** Cloudinary

#### `POST /api/uploadImages`

Egy vagy több kép feltöltése Cloudinaryra.

**Request body:**
```json
{
  "images": ["<base64 vagy URL>", "..."]
}
```

**Sikeres válasz (`200`):**
```json
{
  "serverMsg": "Images uploaded successfully!",
  "images": [
    { "url": "https://res.cloudinary.com/...", "public_id": "recipes/abc123" }
  ]
}
```

**Hibák:**
| Státusz | Üzenet |
|---|---|
| `400` | `"Nincsenek képek a kérésben!"` — hiányzó vagy érvénytelen `images` mező |
| `500` | `"Upload failed!"` — Cloudinary hiba |

**Működés:** Minden képet párhuzamosan tölt fel (`Promise.all`) a Cloudinary `recipes` mappájába, majd visszaadja az URL-eket és `public_id`-kat.

---

#### `POST /api/deleteImage`

Egy kép törlése Cloudinaryról `public_id` alapján.

**Request body:**
```json
{
  "public_id": "recipes/abc123"
}
```

**Sikeres válasz (`200`):**
```json
{
  "serverMsg": "Image delete successful!"
}
```

**Hibák:**
| Státusz | Üzenet |
|---|---|
| `400` | `"Image not found or already deleted!"` — a Cloudinary `result` nem `"ok"` |
| `500` | `"Failed to delete image!"` — szerver oldali hiba |

---

## f) Tesztelés

### Frontend tesztek

A frontend tesztek Vitest + `@testing-library/react` segítségével készültek.

**Futtatás:**
```bash
pnpm vitest components
```

![Mobil - home](https://res.cloudinary.com/fmenv2025/image/upload/v1776362264/test1_d8zvfi.png)

#### `ApartCard`

| # | Teszt leírása |
|---|---|
| 1 | Megjeleníti az árat (`150,000 Ft/hó`) |
| 2 | Megjeleníti a címet |
| 3 | Megjeleníti a kategóriát |
| 4 | Megjeleníti az alapterületet és szobaszámot |

#### `SignUp`

| # | Teszt leírása |
|---|---|
| 1 | Megjelenik a Regisztráció gomb |
| 2 | Megjelenik a felhasználónév, email és jelszó mező |
| 3 | A gomb nincs disabled alapértelmezetten |
| 4 | A jelszó láthatóvá tehető a szem ikonra kattintva |
| 5 | Megjelenik a Vissza a főoldalra gomb |
| 6 | Megjelenik a Bejelentkezés link |

#### `SignIn`

| # | Teszt leírása |
|---|---|
| 1 | Megjelenik a Bejelentkezés gomb |
| 2 | Megjelenik az email és jelszó mező |
| 3 | A gomb disabled lesz submit után (töltés közben) |
| 4 | A jelszó láthatóvá tehető a szem ikonra kattintva |
| 5 | Megjelenik a Vissza a főoldalra gomb |
| 6 | Megjelenik az Elfelejtett jelszó link |
| 7 | Megjelenik a Regisztráció link |

#### `Header`

| # | Teszt leírása |
|---|---|
| 1 | Megjelenik a logó / weboldal neve |
| 2 | Megjelenik a navigációs menü |
| 3 | Nem bejelentkezett állapotban megjelenik a Bejelentkezés gomb |
| 4 | Megjelenik a Hirdetések gomb |

#### `ApForm` — új hirdetés mód

| # | Teszt leírása |
|---|---|
| 1 | Megjelenik az oldal fejléce (`Ingatlan hirdetés feladása`) |
| 2 | Megjelenik a hirdetés címe mező |
| 3 | Megjelenik a bérleti díj, alapterület és szobaszám mező |
| 4 | Megjelenik a leírás textarea |
| 5 | Megjelenik a Borítókép feltöltése gomb |
| 6 | Megjelenik a Képek hozzáadása gomb |
| 7 | Megjelenik a Hirdetés közzététele submit gomb |
| 8 | Megjelenik a Térkép és Manuálisan váltógomb |
| 9 | Megjelenik a Lift select mező alapértelmezett értékkel |
| 10 | Nem bejelentkezett user esetén submit-ra alert jelenik meg |
| 11 | Manuálisan gombra kattintva szöveges input jelenik meg a cím mezőben |
| 12 | Térkép megnyitása gomb látható alapból |
| 13 | Térkép megnyitása gombra kattintva a térképkonténer megjelenik |

#### `ApForm` — szerkesztési mód

| # | Teszt leírása |
|---|---|
| 1 | Szerkesztési módban `Hirdetés szerkesztése` felirat jelenik meg |
| 2 | A submit gomb szövege `Módosítások mentése` |
| 3 | A betöltött cím megjelenik az address mezőben |
| 4 | A meglévő galéria képek megjelennek (`Jelenlegi képek` felirattal) |

### Backend tesztek (`myBackend.js`)

A backend tesztek szintén Vitest segítségével készültek, Firebase Firestore és axios mock-okkal.

**Futtatás:**
```bash
pnpm vitest myBackend
```
![Mobil - home](https://res.cloudinary.com/fmenv2025/image/upload/v1776362265/test2_jbnrjl.png)


#### `uploadToImgBB`

| # | Teszt leírása |
|---|---|
| 1 | Sikeres feltöltés esetén visszaadja az `url`-t és `delete_url`-t |
| 2 | Hiba esetén `null`-t ad vissza |
| 3 | Az `axios.post` meghívódik az ImgBB url-lel |

#### `addHome`

| # | Teszt leírása |
|---|---|
| 1 | Sikeres mentés esetén `true`-t ad vissza |
| 2 | Az `addDoc` meghívódik az apartment adataival és timestamp-pel |
| 3 | Firestore hiba esetén kivételt dob |

#### `updateRecipe`

| # | Teszt leírása |
|---|---|
| 1 | Meghívja az `updateDoc`-ot a helyes adatokkal és `lastModified` timestamp-pel |
| 2 | Firestore hiba esetén kivételt dob |

#### `readHomes`

| # | Teszt leírása |
|---|---|
| 1 | Visszaadja a lakások listáját `id`-vel együtt |
| 2 | Firestore hiba esetén üres tömböt ad vissza |

#### `notify`

| # | Teszt leírása |
|---|---|
| 1 | `notify.success` meghívja a `toast.success`-t |
| 2 | `notify.error` meghívja a `toast.error`-t |
| 3 | `notify.info` meghívja a `toast.info`-t |
| 4 | `notify.warning` meghívja a `toast.warning`-t |

#### `updateAvatar`

| # | Teszt leírása |
|---|---|
| 1 | Létező user esetén `updateDoc`-ot hív és törli a régi képet |
| 2 | Nem létező user esetén `setDoc`-ot hív |
| 3 | Ha nincs régi `public_id`, nem hív delete-et |

#### `deleteAvatar`

| # | Teszt leírása |
|---|---|
| 1 | Törli a képet Cloudinaryról és `null`-ra állítja a Firestore-ban |
| 2 | Nem létező user esetén nem csinál semmit |

#### `deleteHome`

| # | Teszt leírása |
|---|---|
| 1 | Sikeres törlés esetén `true`-t ad vissza |
| 2 | Firestore hiba esetén kivételt dob |

#### `updateHome`

| # | Teszt leírása |
|---|---|
| 1 | Új thumbnail fájl esetén feltölti ImgBB-re és elmenti |
| 2 | Új galéria képek esetén mindegyiket feltölti |
| 3 | `uid` nem kerül felülírásra nem-admin szerkesztésnél |
| 4 | Admin szerkesztésnél az `uid` nem kerül visszaírásra |
| 5 | Firestore hiba esetén kivételt dob |

#### `deleteGalleryImage`

| # | Teszt leírása |
|---|---|
| 1 | Törli a képet a listából és frissíti a Firestore-t |
| 2 | A `delete_url` alapján meghívja az ImgBB törlő url-t |
| 3 | Firestore hiba esetén kivételt dob |

#### `toggleFavourite`

| # | Teszt leírása |
|---|---|
| 1 | Kedvenc hozzáadásakor `true`-t ad vissza |
| 2 | Kedvenc eltávolításakor `false`-t ad vissza |
| 3 | Nem létező kedvencek doc esetén üres tömbből indul |

#### `readFavourites`

| # | Teszt leírása |
|---|---|
| 1 | Meghívja a `setFavourites`-t az `ids` tömbbel |
| 2 | Visszaad egy unsubscribe függvényt |
| 3 | Nem létező doc esetén üres tömböt ad vissza |

#### `readHome`

| # | Teszt leírása |
|---|---|
| 1 | Létező lakás esetén a callback megkapja az adatokat |
| 2 | Nem létező lakás esetén a callback `null`-t kap |
| 3 | Hiba esetén a callback nem hívódik meg |


### Backend tesztek (`index.js`)

A Cloudinary Express végpontok tesztjei Vitest + Supertest segítségével készültek.

**Futtatás:**
```bash
pnpm vitest
```

![Mobil - home](https://res.cloudinary.com/fmenv2025/image/upload/v1776362266/test3_fkd4fr.png)


#### `POST /api/uploadImages`

| # | Teszt leírása |
|---|---|
| 1 | Feltölti a képeket és visszaadja az URL-eket és `public_id`-kat |
| 2 | `400` ha nincs `images` mező a kérésben |
| 3 | `400` ha az `images` mező nem tömb |
| 4 | `500` ha a Cloudinary hibát dob |

#### `POST /api/deleteImage`

| # | Teszt leírása |
|---|---|
| 1 | Sikeresen törli a képet, `200`-at ad vissza |
| 2 | `400` ha a kép nem található vagy már törölve van |
| 3 | `500` ha a Cloudinary hibát dob |


---
## Csapatmunka 

A projekt csapatmunkában, három fővel készült. A fejlesztés menedzseléséhez **GitHub Projects**, **Issues** és **Pull Requestek** kombinációját használtuk.

- **GitHub Projects** — Kanban táblán követtük nyomon a feladatok állapotát (teendő, folyamatban, kész), így mindig átlátható volt, ki min dolgozik éppen
- **Issues** — Minden feladatot, hibát és fejlesztési ötletet külön issue-ként rögzítettünk, így semmi nem veszett el, és a felelősségek egyértelműek voltak
- **Pull Requestek** — Mindenki külön branchen dolgozott, és a kész funkciók csak Pull Request és code review után kerültek be a `main` ágba, ezzel elkerültük az ütközéseket és a hibás kód bekerülését


A fejlesztés korai szakaszában a GitHub Projects kanban táblánk:

![GitHub-Projects screenshot](https://res.cloudinary.com/fmenv2025/image/upload/v1776703207/Screenshot_2026-02-22_at_11.11.16_a1sxlw.png)

A branching és mergelési struktúra a fejlesztés során:

![GitHub-branchek](https://res.cloudinary.com/fmenv2025/image/upload/v1776704296/Screenshot_2026-04-20_at_18.58.01_nognu2.png)