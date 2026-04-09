// components.test.jsx
import { describe, test, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import * as matchers from "@testing-library/jest-dom/matchers"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import * as ReactModule from "react"
expect.extend(matchers)

// ===== MOCK-OK =====

const mockUseParams = vi.fn(() => ({}))

vi.mock("./context/MyUserProvider", () => ({
  MyUserContext: {
    _currentValue: { user: null, isAdmin: false, signInUser: vi.fn(), signUpUser: vi.fn(() => new Promise(() => {})), msg: {}, setMsg: vi.fn() }
  }
}))

vi.mock("./myBackend", () => ({
  deleteHome: vi.fn(),
  addHome: vi.fn(() => Promise.resolve()),
  updateHome: vi.fn(() => Promise.resolve()),
  readHome: vi.fn(),
  uploadToImgBB: vi.fn(() => Promise.resolve({ url: "https://example.com/img.jpg" })),
  deleteGalleryImage: vi.fn(() => Promise.resolve([])),
  notify: { success: vi.fn(), error: vi.fn() },
}))

vi.mock("./useFavourites", () => ({
  useFavourites: () => ({ toggle: vi.fn(), isFav: () => false })
}))

vi.mock("react", async () => {
  const actual = await vi.importActual("react")
  return {
    ...actual,
    useContext: vi.fn(() => ({
      user: null,
      isAdmin: false,
      signInUser: vi.fn(() => new Promise(() => {})),
      msg: {},
      setMsg: vi.fn(),
      logoutUser: vi.fn(),
      deleteAccount: vi.fn(),
    }))
  }
})

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => mockUseParams(),
  }
})

vi.mock("./firebaseApp", () => ({
  db: {},
}))

vi.mock("firebase/firestore", async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    doc: vi.fn(),
    getDoc: vi.fn(() =>
      Promise.resolve({ exists: () => false, data: () => ({}) })
    ),
  }
})

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => null,
  Marker: () => null,
  useMapEvents: () => null,
  useMap: () => ({ setView: vi.fn(), invalidateSize: vi.fn() }),
}))

vi.mock("leaflet", () => ({
  default: { icon: vi.fn(() => ({})), Marker: { prototype: { options: {} } } },
  icon: vi.fn(() => ({})),
  Marker: { prototype: { options: {} } },
}))

// ===== IMPORTOK (mock után!) =====
import { ApartCard } from "./components/ApartCard"
import { SignUp } from "./pages/SignUp"
import { SignIn } from "./pages/SignIn"
import { Header } from "./components/Header"
import { ApForm } from "./pages/ApForm"
import { readHome } from "./myBackend"  
import { MyUserContext } from "./context/MyUserProvider"


const mockApartment = {
  id: "test123",
  title: "Szép lakás",
  price: 150000,
  area: 55,
  rooms: 2,
  category: "Lakás",
  address: "Budapest, Teszt utca 1.",
  thumbnail: { url: "https://example.com/img.jpg" },
  images: [],
  uid: "user123"
}

// ===== APARTCARD TESZTEK =====
describe("ApartCard", () => {
  test("megjeleníti az árat", () => {
    render(<MemoryRouter><ApartCard apartment={mockApartment} /></MemoryRouter>)
    expect(screen.getByText(/150,000 Ft\/hó/i)).toBeInTheDocument()
  })
  test("megjeleníti a címet", () => {
    render(<MemoryRouter><ApartCard apartment={mockApartment} /></MemoryRouter>)
    expect(screen.getByText(/Teszt utca 1/i)).toBeInTheDocument()
  })
  test("megjeleníti a kategóriát", () => {
    render(<MemoryRouter><ApartCard apartment={mockApartment} /></MemoryRouter>)
    expect(screen.getByText("Lakás")).toBeInTheDocument()
  })
  test("megjeleníti az alapterületet és szobaszámot", () => {
    render(<MemoryRouter><ApartCard apartment={mockApartment} /></MemoryRouter>)
    expect(screen.getByText("55 m²")).toBeInTheDocument()
    expect(screen.getByText("2")).toBeInTheDocument()
  })
})
// ===== SIGNUP TESZTEK =====
describe("SignUp", () => {
  test("megjelenik a Regisztráció gomb", () => {
    render(<MemoryRouter><SignUp /></MemoryRouter>)
    expect(screen.getByRole("button", { name: /regisztráció/i })).toBeInTheDocument()
  })

  test("megjelenik a felhasználónév, email és jelszó mező", () => {
    render(<MemoryRouter><SignUp /></MemoryRouter>)
    expect(screen.getByPlaceholderText(/adja meg felhasználónevét/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/adja meg e-mail címét/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/••••/i)).toBeInTheDocument()
  })

test("gomb disabled amíg tölt", async () => {
  render(<MemoryRouter><SignUp /></MemoryRouter>)
  const btn = screen.getByRole("button", { name: /regisztráció/i })
  expect(btn).not.toBeDisabled()
})

  test("jelszó láthatóvá tehető", async () => {
    render(<MemoryRouter><SignUp /></MemoryRouter>)
    const user = userEvent.setup()
    const pwInput = screen.getByPlaceholderText(/••••/i)
    expect(pwInput).toHaveAttribute("type", "password")
    const eyeBtn = pwInput.closest(".input-wrapper").querySelector("button")
    await user.click(eyeBtn)
    expect(pwInput).toHaveAttribute("type", "text")
  })

  test("megjelenik a Vissza a főoldalra gomb", () => {
    render(<MemoryRouter><SignUp /></MemoryRouter>)
    expect(screen.getByRole("button", { name: /vissza a főoldalra/i })).toBeInTheDocument()
  })

  test("megjelenik a Bejelentkezés link", () => {
    render(<MemoryRouter><SignUp /></MemoryRouter>)
    expect(screen.getByText(/bejelentkezés/i)).toBeInTheDocument()
  })
})

// ===== SIGNIN TESZTEK =====
describe("SignIn", () => {
  test("megjelenik a bejelentkezés gomb", () => {
    render(<MemoryRouter><SignIn /></MemoryRouter>)
    expect(screen.getByRole("button", { name: /bejelentkezés/i })).toBeInTheDocument()
  })

  test("megjelenik az email és jelszó mező", () => {
    render(<MemoryRouter><SignIn /></MemoryRouter>)
    expect(screen.getByPlaceholderText(/adja meg e-mail/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/••••/i)).toBeInTheDocument()
  })

  test("gomb disabled amíg tölt", async () => {
    render(<MemoryRouter><SignIn /></MemoryRouter>)
    const user = userEvent.setup()
    const email = screen.getByPlaceholderText(/adja meg e-mail/i)
    const password = screen.getByPlaceholderText(/••••/i)
    const btn = screen.getByRole("button", { name: /bejelentkezés/i })
    await user.type(email, "test@test.hu")
    await user.type(password, "jelszo123")
    await user.click(btn)
    expect(btn).toBeDisabled()
  })

  test("jelszó láthatóvá tehető", async () => {
    render(<MemoryRouter><SignIn /></MemoryRouter>)
    const user = userEvent.setup()
    const pwInput = screen.getByPlaceholderText(/••••/i)
    expect(pwInput).toHaveAttribute("type", "password")
    const eyeBtn = screen.getByTestId("toggle-password")
    await user.click(eyeBtn)
    expect(pwInput).toHaveAttribute("type", "text")
  })

  test("megjelenik a Vissza a főoldalra gomb", () => {
    render(<MemoryRouter><SignIn /></MemoryRouter>)
    expect(screen.getByRole("button", { name: /vissza a főoldalra/i })).toBeInTheDocument()
  })

  test("megjelenik az Elfelejtett jelszó link", () => {
    render(<MemoryRouter><SignIn /></MemoryRouter>)
    expect(screen.getByText(/elfelejtett jelszó/i)).toBeInTheDocument()
  })

  test("megjelenik a Regisztráció link", () => {
    render(<MemoryRouter><SignIn /></MemoryRouter>)
    expect(screen.getByText(/regisztráció/i)).toBeInTheDocument()
  })
})

// ===== HEADER TESZTEK =====
describe("Header", () => {
  test("megjelenik a logó / weboldal neve", () => {
    render(<MemoryRouter><Header /></MemoryRouter>)
    expect(screen.getByText(/lakás/i)).toBeInTheDocument()
  })

  test("megjelenik a navigációs menü", () => {
    render(<MemoryRouter><Header /></MemoryRouter>)
    expect(screen.getByRole("navigation")).toBeInTheDocument()
  })

  test("nem bejelentkezett állapotban megjelenik a Bejelentkezés gomb", () => {
    render(<MemoryRouter><Header /></MemoryRouter>)
    expect(screen.getByRole("button", { name: /bejelentkezés/i })).toBeInTheDocument()
  })

  test("Hirdetések gomb jelen van", () => {
    render(<MemoryRouter><Header /></MemoryRouter>)
    expect(screen.getByRole("button", { name: /hirdetések/i })).toBeInTheDocument()
  })
})

// ===== APFORM TESZTEK – ÚJ HIRDETÉS MÓD =====
describe("ApForm – új hirdetés mód", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({})
  })

  test("megjelenik az oldal fejléce", () => {
    render(<MemoryRouter><ApForm /></MemoryRouter>)
    expect(screen.getByText(/ingatlan hirdetés feladása/i)).toBeInTheDocument()
  })
  test("megjelenik a hirdetés címe mező", () => {
    render(<MemoryRouter><ApForm /></MemoryRouter>)
    expect(screen.getByPlaceholderText(/modern garzon/i)).toBeInTheDocument()
  })
  test("megjelenik a bérleti díj, alapterület és szobaszám mező", () => {
    render(<MemoryRouter><ApForm /></MemoryRouter>)
    expect(screen.getAllByRole("spinbutton").length).toBeGreaterThanOrEqual(3)
  })
  test("megjelenik a leírás textarea", () => {
    render(<MemoryRouter><ApForm /></MemoryRouter>)
    const textareas = screen.getAllByRole("textbox")
    expect(textareas.length).toBeGreaterThan(0)
  })
  test("megjelenik a Borítókép feltöltése gomb", () => {
    render(<MemoryRouter><ApForm /></MemoryRouter>)
    expect(screen.getByText(/borítókép feltöltése/i)).toBeInTheDocument()
  })
  test("megjelenik a Képek hozzáadása gomb", () => {
    render(<MemoryRouter><ApForm /></MemoryRouter>)
    expect(screen.getByText(/képek hozzáadása/i)).toBeInTheDocument()
  })
  test("megjelenik a Hirdetés közzététele submit gomb", () => {
    render(<MemoryRouter><ApForm /></MemoryRouter>)
    expect(screen.getByRole("button", { name: /hirdetés közzététele/i })).toBeInTheDocument()
  })
  test("megjelenik a Térkép és Manuálisan gomb", () => {
    render(<MemoryRouter><ApForm /></MemoryRouter>)
    expect(screen.getByTitle(/térkép/i)).toBeInTheDocument()
    expect(screen.getByTitle(/kézzel gépelés/i)).toBeInTheDocument()
  })
test("megjelenik a Lift select mező alapértelmezett értékkel", () => {
  render(<MemoryRouter><ApForm /></MemoryRouter>)
  const elements = screen.getAllByDisplayValue("Nincs megadva")
  expect(elements.length).toBeGreaterThan(0)
})
  test("nem bejelentkezett user esetén submit-ra alert jelenik meg", async () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {})
    render(<MemoryRouter><ApForm /></MemoryRouter>)
    const form = document.querySelector("form")
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }))
    expect(alertMock).toHaveBeenCalledWith(expect.stringMatching(/be kell jelentkezned/i))
    alertMock.mockRestore()
  })
  test("Manuálisan gombra kattintva szöveges input jelenik meg a cím mezőben", async () => {
    render(<MemoryRouter><ApForm /></MemoryRouter>)
    const user = userEvent.setup()
    await user.click(screen.getByTitle(/kézzel gépelés/i))
    expect(screen.getByPlaceholderText(/üllői út/i)).toBeInTheDocument()
  })
  test("Térkép megnyitása gomb látható alapból", () => {
    render(<MemoryRouter><ApForm /></MemoryRouter>)
    expect(screen.getByText(/térkép megnyitása/i)).toBeInTheDocument()
  })
  test("Térkép megnyitása gombra kattintva a map container megjelenik", async () => {
    render(<MemoryRouter><ApForm /></MemoryRouter>)
    const user = userEvent.setup()
    await user.click(screen.getByText(/térkép megnyitása/i))
    expect(screen.getByTestId("map-container")).toBeInTheDocument()
  })
})

// ===== APFORM TESZTEK – SZERKESZTÉSI MÓD =====
describe("ApForm – szerkesztési mód", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ id: "home123" })
    readHome.mockImplementation((_id, setter) => {
      setter({
        id: "home123",
        title: "Meglévő lakás",
        address: "Budapest, Fő utca 1.",
        price: 200000,
        area: 70,
        rooms: 3,
        category: "Lakás",
        description: "Szép lakás leírása",
        thumbnail: { url: "https://example.com/thumb.jpg" },
        images: [{ url: "https://example.com/gallery1.jpg", deleteHash: "abc" }],
        uid: "user123",
        lat: 47.49,
        lon: 19.04,
      })
    })
  })

  test("szerkesztési módban 'Hirdetés szerkesztése' felirat jelenik meg", async () => {
    render(<MemoryRouter><ApForm /></MemoryRouter>)
    await waitFor(() => {
      expect(screen.getByText(/hirdetés szerkesztése/i)).toBeInTheDocument()
    })
  })
  test("a submit gomb szövege 'Módosítások mentése'", async () => {
    render(<MemoryRouter><ApForm /></MemoryRouter>)
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /módosítások mentése/i })).toBeInTheDocument()
    })
  })
test("betöltött cím megjelenik az address mezőben", async () => {
  render(<MemoryRouter><ApForm /></MemoryRouter>)
  await waitFor(() => {
    expect(screen.getByText(/fő utca 1/i)).toBeInTheDocument()
  })
})
  test("meglévő galéria képek megjelennek", async () => {
    render(<MemoryRouter><ApForm /></MemoryRouter>)
    await waitFor(() => {
      expect(screen.getByText(/jelenlegi képek/i)).toBeInTheDocument()
    })
  })
})