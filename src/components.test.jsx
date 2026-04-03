// components.test.jsx
import { describe, test, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import * as matchers from "@testing-library/jest-dom/matchers"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"

expect.extend(matchers)

// ===== MOCK-OK =====
vi.mock("../context/MyUserProvider", () => ({
  MyUserContext: {
    _currentValue: { user: null, isAdmin: false, signInUser: vi.fn(), msg: {}, setMsg: vi.fn() }
  }
}))

vi.mock("./myBackend", () => ({
  deleteHome: vi.fn(),
  notify: { success: vi.fn(), error: vi.fn() }
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
      signInUser: vi.fn(() => new Promise(() => {})), // soha nem resolve-ol
      msg: {},
      setMsg: vi.fn(),
      logoutUser: vi.fn(),
      deleteAccount: vi.fn(),
    }))
  }
})

// ===== IMPORTOK (mock után!) =====
import { ApartCard } from "./components/ApartCard"
import { SignIn } from "./pages/SignIn"

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

// ===== SIGNIN TESZTEK =====
describe("SignIn", () => {
  test("megjelenik a bejelentkezés gomb", () => {
    render(<MemoryRouter><SignIn /></MemoryRouter>)
    expect(screen.getByRole("button", { name: /bejelentkezés/i })).toBeInTheDocument()
  })

  test("megjelenik az email és jelszó mező", () => {
    render(<MemoryRouter><SignIn /></MemoryRouter>)
    expect(screen.getByPlaceholderText(/e-mail/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/••••/i)).toBeInTheDocument()
  })

  test("gomb disabled amíg tölt", async () => {
    render(<MemoryRouter><SignIn /></MemoryRouter>)
    const user = userEvent.setup()
    const email = screen.getByPlaceholderText(/e-mail/i)
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
})
