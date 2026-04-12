import { describe, test, expect, vi, beforeEach, afterEach } from "vitest"

vi.mock("./firebaseApp", () => ({
    db: {},
}))

vi.mock("axios", () => ({
    default: {
        post: vi.fn(),
        get: vi.fn(),
    },
}))

vi.mock("browser-image-compression", () => ({
    default: vi.fn((file) => Promise.resolve(file)),
}))

vi.mock("react-toastify", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
    },
}))

const mockDocRef = { id: "mock-doc-id" }
const mockDocSnap = {
    exists: vi.fn(() => true),
    data: vi.fn(() => ({ public_id: "old_public_id", avatarUrl: "https://example.com/old.jpg" })),
    id: "mock-doc-id",
}

vi.mock("firebase/firestore", () => ({
    collection: vi.fn(() => "mock-collection"),
    doc: vi.fn(() => mockDocRef),
    addDoc: vi.fn(() => Promise.resolve(mockDocRef)),
    updateDoc: vi.fn(() => Promise.resolve()),
    deleteDoc: vi.fn(() => Promise.resolve()),
    setDoc: vi.fn(() => Promise.resolve()),
    getDoc: vi.fn(() => Promise.resolve(mockDocSnap)),
    getDocs: vi.fn(() =>
        Promise.resolve({
            docs: [
                { data: () => ({ title: "Lakás 1", price: 100000 }), id: "id1" },
                { data: () => ({ title: "Lakás 2", price: 200000 }), id: "id2" },
            ],
        })
    ),
    query: vi.fn((col) => col),
    orderBy: vi.fn(),
    onSnapshot: vi.fn((ref, cb) => {
        cb({ exists: () => true, data: () => ({ ids: ["ap1", "ap2"] }) })
        return vi.fn() // unsubscribe
    }),
    serverTimestamp: vi.fn(() => "mock-timestamp"),
}))

// ===== IMPORTOK (mock után!) =====
import axios from "axios"
import {
    addDoc,
    updateDoc,
    deleteDoc,
    setDoc,
    getDoc,
    getDocs,
    onSnapshot,
} from "firebase/firestore"
import {
    uploadToImgBB,
    addHome,
    updateRecipe,
    readHomes,
    notify,
    updateAvatar,
    deleteAvatar,
    deleteHome,
    updateHome,
    deleteGalleryImage,
    toggleFavourite,
    readFavourites,
    readHome,
} from "./myBackend"

// ===== IMGBB FELTÖLTÉS TESZTEK =====
describe("uploadToImgBB", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    test("sikeres feltöltés esetén visszaadja az url-t és delete_url-t", async () => {
        axios.post.mockResolvedValueOnce({
            data: {
                data: {
                    url: "https://imgbb.com/image.jpg",
                    delete_url: "https://imgbb.com/delete/abc",
                },
            },
        })

        const fakeFile = new File(["content"], "test.jpg", { type: "image/jpeg" })
        const result = await uploadToImgBB(fakeFile)

        expect(result).toEqual({
            url: "https://imgbb.com/image.jpg",
            delete_url: "https://imgbb.com/delete/abc",
        })
    })

    test("hiba esetén null-t ad vissza", async () => {
        axios.post.mockRejectedValueOnce(new Error("Network error"))

        const fakeFile = new File(["content"], "test.jpg", { type: "image/jpeg" })
        const result = await uploadToImgBB(fakeFile)

        expect(result).toBeNull()
    })

    test("az axios.post meghívódik az imgbb url-lel", async () => {
        axios.post.mockResolvedValueOnce({
            data: { data: { url: "https://imgbb.com/x.jpg", delete_url: "https://imgbb.com/del" } },
        })

        const fakeFile = new File(["content"], "test.jpg", { type: "image/jpeg" })
        await uploadToImgBB(fakeFile)

        expect(axios.post).toHaveBeenCalledTimes(1)
        expect(axios.post.mock.calls[0][0]).toMatch(/imgbb\.com/)
    })
})

// ===== ADDHOME TESZTEK =====
describe("addHome", () => {
    beforeEach(() => vi.clearAllMocks())

    test("sikeres mentés esetén true-t ad vissza", async () => {
        const apartment = { title: "Teszt lakás", price: 150000 }
        const images = [{ url: "https://example.com/img.jpg" }]

        const result = await addHome(apartment, images)

        expect(result).toBe(true)
        expect(addDoc).toHaveBeenCalledTimes(1)
    })

    test("az addDoc meghívódik az apartment adataival és timestamp-pel", async () => {
        const apartment = { title: "Teszt lakás", price: 150000 }
        const images = []

        await addHome(apartment, images)

        expect(addDoc).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                title: "Teszt lakás",
                price: 150000,
                images: [],
                timestamp: "mock-timestamp",
            })
        )
    })

    test("Firestore hiba esetén kivételt dob", async () => {
        addDoc.mockRejectedValueOnce(new Error("Firestore error"))

        await expect(addHome({ title: "Hiba" }, [])).rejects.toThrow("Firestore error")
    })
})

// ===== UPDATERECIPE TESZTEK =====
describe("updateRecipe", () => {
    beforeEach(() => vi.clearAllMocks())

    test("meghívja az updateDoc-ot a helyes adatokkal", async () => {
        await updateRecipe("ap123", { title: "Frissített lakás" })

        expect(updateDoc).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                title: "Frissített lakás",
                lastModified: "mock-timestamp",
            })
        )
    })

    test("Firestore hiba esetén kivételt dob", async () => {
        updateDoc.mockRejectedValueOnce(new Error("Update failed"))

        await expect(updateRecipe("ap123", { title: "X" })).rejects.toThrow("Update failed")
    })
})

// ===== READHOMES TESZTEK =====
describe("readHomes", () => {
    beforeEach(() => vi.clearAllMocks())

    test("visszaadja a lakások listáját id-vel együtt", async () => {
        const result = await readHomes()

        expect(result).toHaveLength(2)
        expect(result[0]).toMatchObject({ title: "Lakás 1", id: "id1" })
        expect(result[1]).toMatchObject({ title: "Lakás 2", id: "id2" })
    })

    test("Firestore hiba esetén üres tömböt ad vissza", async () => {
        getDocs.mockRejectedValueOnce(new Error("Fetch failed"))

        const result = await readHomes()

        expect(result).toEqual([])
    })
})

// ===== NOTIFY TESZTEK =====
describe("notify", () => {
    test("notify.success meghívja a toast.success-t", async () => {
        const { toast } = await import("react-toastify")
        notify.success("Siker!")
        expect(toast.success).toHaveBeenCalledWith("Siker!")
    })

    test("notify.error meghívja a toast.error-t", async () => {
        const { toast } = await import("react-toastify")
        notify.error("Hiba!")
        expect(toast.error).toHaveBeenCalledWith("Hiba!")
    })

    test("notify.info meghívja a toast.info-t", async () => {
        const { toast } = await import("react-toastify")
        notify.info("Infó!")
        expect(toast.info).toHaveBeenCalledWith("Infó!")
    })

    test("notify.warning meghívja a toast.warning-t", async () => {
        const { toast } = await import("react-toastify")
        notify.warning("Figyelem!")
        expect(toast.warning).toHaveBeenCalledWith("Figyelem!")
    })
})

// ===== UPDATEAVATAR TESZTEK =====
describe("updateAvatar", () => {
    beforeEach(() => vi.clearAllMocks())

    test("létező user esetén updateDoc-ot hív és törli a régi képet", async () => {
        mockDocSnap.exists.mockReturnValue(true)
        mockDocSnap.data.mockReturnValue({ public_id: "old_id", avatarUrl: "https://old.jpg" })
        axios.post.mockResolvedValueOnce({})

        await updateAvatar("user123", "new_id", "https://new.jpg")

        expect(updateDoc).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ public_id: "new_id", avatarUrl: "https://new.jpg" })
        )
        expect(axios.post).toHaveBeenCalledWith(
            expect.stringContaining("deleteImage"),
            { public_id: "old_id" }
        )
    })

    test("nem létező user esetén setDoc-ot hív", async () => {
        mockDocSnap.exists.mockReturnValue(false)

        await updateAvatar("newuser", "pub_id", "https://avatar.jpg")

        expect(setDoc).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ uid: "newuser", public_id: "pub_id", avatarUrl: "https://avatar.jpg" })
        )
    })

    test("ha nincs régi public_id, nem hív delete-et", async () => {
        mockDocSnap.exists.mockReturnValue(true)
        mockDocSnap.data.mockReturnValue({ public_id: null })

        await updateAvatar("user123", "new_id", "https://new.jpg")

        expect(axios.post).not.toHaveBeenCalled()
    })
})

// ===== DELETEAVATAR TESZTEK =====
describe("deleteAvatar", () => {
    beforeEach(() => vi.clearAllMocks())

    test("törli a képet és null-ra állítja a Firestore-ban", async () => {
        mockDocSnap.exists.mockReturnValue(true)
        mockDocSnap.data.mockReturnValue({ public_id: "pub123" })
        axios.post.mockResolvedValueOnce({})

        await deleteAvatar("user123")

        expect(axios.post).toHaveBeenCalledWith(
            expect.stringContaining("deleteImage"),
            { public_id: "pub123" }
        )
        expect(updateDoc).toHaveBeenCalledWith(
            expect.anything(),
            { public_id: null, avatarUrl: null }
        )
    })

    test("nem létező user esetén nem csinál semmit", async () => {
        mockDocSnap.exists.mockReturnValue(false)

        await deleteAvatar("ghost_user")

        expect(updateDoc).not.toHaveBeenCalled()
        expect(axios.post).not.toHaveBeenCalled()
    })
})

// ===== DELETEHOME TESZTEK =====
describe("deleteHome", () => {
    beforeEach(() => vi.clearAllMocks())

    test("sikeres törlés esetén true-t ad vissza", async () => {
        const result = await deleteHome("ap123", "https://delete.url", [])
        expect(result).toBe(true)
        expect(deleteDoc).toHaveBeenCalledTimes(1)
    })

    test("Firestore hiba esetén kivételt dob", async () => {
        deleteDoc.mockRejectedValueOnce(new Error("Delete failed"))

        await expect(deleteHome("ap123", null, [])).rejects.toThrow("Delete failed")
    })
})

// ===== UPDATEHOME TESZTEK =====
describe("updateHome", () => {
    beforeEach(() => vi.clearAllMocks())

    test("új thumbnail fájl esetén feltölti és elmenti", async () => {
        axios.post.mockResolvedValueOnce({
            data: { data: { url: "https://imgbb.com/new.jpg", delete_url: "https://imgbb.com/del" } },
        })

        const updatedData = { title: "Frissített", uid: "user1", timestamp: "ts", images: [] }
        const fakeFile = new File(["img"], "thumb.jpg", { type: "image/jpeg" })

        await updateHome("ap123", updatedData, fakeFile, [], false)

        expect(axios.post).toHaveBeenCalledTimes(1)
        expect(updateDoc).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ title: "Frissített" })
        )
    })

    test("új galéria képek esetén mindegyiket feltölti", async () => {
        axios.post
            .mockResolvedValueOnce({ data: { data: { url: "https://imgbb.com/1.jpg", delete_url: "del1" } } })
            .mockResolvedValueOnce({ data: { data: { url: "https://imgbb.com/2.jpg", delete_url: "del2" } } })

        const updatedData = { title: "X", uid: "u1", timestamp: "ts", images: [] }
        const file1 = new File(["a"], "a.jpg", { type: "image/jpeg" })
        const file2 = new File(["b"], "b.jpg", { type: "image/jpeg" })

        await updateHome("ap123", updatedData, null, [file1, file2], false)

        expect(axios.post).toHaveBeenCalledTimes(2)
    })

    test("uid nem kerül felülírásra nem-admin szerkesztésnél", async () => {
        const updatedData = { title: "X", uid: "originalUser", timestamp: "ts", images: [] }

        await updateHome("ap123", updatedData, null, [], false)

        expect(updateDoc).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ uid: "originalUser" })
        )
    })

    test("admin szerkesztésnél az uid nem kerül visszaírásra", async () => {
        const updatedData = { title: "X", uid: "originalUser", timestamp: "ts", images: [] }

        await updateHome("ap123", updatedData, null, [], true)

        const callArg = updateDoc.mock.calls[0][1]
        expect(callArg).not.toHaveProperty("uid")
    })

    test("Firestore hiba esetén kivételt dob", async () => {
        updateDoc.mockRejectedValueOnce(new Error("Update error"))
        const updatedData = { title: "X", uid: "u", timestamp: "ts", images: [] }

        await expect(updateHome("ap123", updatedData, null, [], false)).rejects.toThrow("Update error")
    })
})

// ===== DELETEGALLERYIMAGE TESZTEK =====
describe("deleteGalleryImage", () => {
    beforeEach(() => vi.clearAllMocks())

    test("törli a képet a listából és frissíti a Firestore-t", async () => {
        axios.get.mockResolvedValueOnce({})

        const currentImages = [
            { url: "https://example.com/img1.jpg", delete_url: "https://imgbb.com/del1" },
            { url: "https://example.com/img2.jpg", delete_url: "https://imgbb.com/del2" },
        ]
        const imageToDelete = currentImages[0]

        const result = await deleteGalleryImage("ap123", imageToDelete, currentImages)

        expect(result).toHaveLength(1)
        expect(result[0].url).toBe("https://example.com/img2.jpg")
        expect(updateDoc).toHaveBeenCalledTimes(1)
    })

    test("a delete_url alapján meghívja az imgbb törlő url-t", async () => {
        axios.get.mockResolvedValueOnce({})

        const images = [{ url: "https://example.com/img.jpg", delete_url: "https://imgbb.com/delete/xyz" }]
        await deleteGalleryImage("ap123", images[0], images)

        expect(axios.get).toHaveBeenCalledWith("https://imgbb.com/delete/xyz")
    })

    test("Firestore hiba esetén kivételt dob", async () => {
        axios.get.mockResolvedValueOnce({})
        updateDoc.mockRejectedValueOnce(new Error("Firestore error"))

        const images = [{ url: "https://example.com/img.jpg", delete_url: "https://del" }]
        await expect(deleteGalleryImage("ap123", images[0], images)).rejects.toThrow("Firestore error")
    })
})

// ===== TOGGLEFAVOURITE TESZTEK =====
describe("toggleFavourite", () => {
    beforeEach(() => vi.clearAllMocks())

    test("kedvenc hozzáadásakor true-t ad vissza", async () => {
        mockDocSnap.exists.mockReturnValue(true)
        mockDocSnap.data.mockReturnValue({ ids: [] })

        const result = await toggleFavourite("user123", "ap456")

        expect(result).toBe(true)
        expect(setDoc).toHaveBeenCalledWith(
            expect.anything(),
            { ids: ["ap456"] }
        )
    })

    test("kedvenc eltávolításakor false-t ad vissza", async () => {
        mockDocSnap.exists.mockReturnValue(true)
        mockDocSnap.data.mockReturnValue({ ids: ["ap456"] })

        const result = await toggleFavourite("user123", "ap456")

        expect(result).toBe(false)
        expect(setDoc).toHaveBeenCalledWith(
            expect.anything(),
            { ids: [] }
        )
    })

    test("nem létező kedvencek doc esetén üres tömbből indul", async () => {
        mockDocSnap.exists.mockReturnValue(false)

        const result = await toggleFavourite("user123", "ap789")

        expect(result).toBe(true)
        expect(setDoc).toHaveBeenCalledWith(
            expect.anything(),
            { ids: ["ap789"] }
        )
    })
})

// ===== READFAVOURITES TESZTEK =====
describe("readFavourites", () => {
    beforeEach(() => vi.clearAllMocks())

    test("meghívja a setFavourites-t az ids tömbdel", () => {
        const setFavourites = vi.fn()
        readFavourites("user123", setFavourites)

        expect(setFavourites).toHaveBeenCalledWith(["ap1", "ap2"])
    })

    test("visszaad egy unsubscribe függvényt", () => {
        const setFavourites = vi.fn()
        const unsub = readFavourites("user123", setFavourites)

        expect(typeof unsub).toBe("function")
    })

    test("nem létező doc esetén üres tömböt ad vissza", () => {
        onSnapshot.mockImplementationOnce((ref, cb) => {
            cb({ exists: () => false, data: () => ({}) })
            return vi.fn()
        })

        const setFavourites = vi.fn()
        readFavourites("user123", setFavourites)

        expect(setFavourites).toHaveBeenCalledWith([])
    })
})

// ===== READHOME TESZTEK =====
describe("readHome", () => {
    beforeEach(() => vi.clearAllMocks())

    test("létező lakás esetén a callback megkapja az adatokat", async () => {
        mockDocSnap.exists.mockReturnValue(true)
        mockDocSnap.data.mockReturnValue({ title: "Teszt lakás", price: 100000 })

        const callback = vi.fn()
        await readHome("ap123", callback)

        expect(callback).toHaveBeenCalledWith(
            expect.objectContaining({ title: "Teszt lakás", id: "mock-doc-id" })
        )
    })

    test("nem létező lakás esetén a callback null-t kap", async () => {
        mockDocSnap.exists.mockReturnValue(false)

        const callback = vi.fn()
        await readHome("nem-letezik", callback)

        expect(callback).toHaveBeenCalledWith(null)
    })

    test("hiba esetén a callback nem hívódik meg", async () => {
        getDoc.mockRejectedValueOnce(new Error("Firestore error"))

        const callback = vi.fn()
        await readHome("ap123", callback)

        expect(callback).not.toHaveBeenCalled()
    })
})