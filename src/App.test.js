import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

const mockProducts = [
  {
    id: 1,
    title: "Almond Brown Sugar Croissant",
    description: "Sweet flaky croissant topped with toasted sliced almonds.",
    price: 12000,
    category: "Croissant",
    isSignature: true,
    img: "./asset/almond-croissant-cookie-recipe-27.webp",
  },
  {
    id: 2,
    title: "Basic Croissant La Ta Dhore",
    description: "Traditional golden-baked butter croissant.",
    price: 8000,
    category: "Croissant",
    isSignature: false,
    img: "./asset/Croissants-20.webp",
  },
];

beforeEach(() => {
  localStorage.clear();
  HTMLDialogElement.prototype.showModal = jest.fn(function () {
    this.open = true;
  });
  HTMLDialogElement.prototype.close = jest.fn(function () {
    this.open = false;
  });
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockProducts),
    })
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("renders POS header, loads products, adds to order, adjusts quantity, and processes payment", async () => {
  render(<App />);

  expect(screen.getByText(/La Ta Dhore POS/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(
      screen.getByText("Almond Brown Sugar Croissant")
    ).toBeInTheDocument();
  });

  // 1. Theme toggle (Light <-> Dark)
  const themeBtn = screen.getByRole("button", {
    name: /Beralih ke mode gelap/i,
  });
  fireEvent.click(themeBtn);
  expect(document.documentElement.classList.contains("dark")).toBe(true);
  const lightBtn = screen.getByRole("button", {
    name: /Beralih ke mode terang/i,
  });
  fireEvent.click(lightBtn);
  expect(document.documentElement.classList.contains("dark")).toBe(false);

  // 2. Add to Order
  const addButton = screen.getByRole("button", {
    name: /Tambah Almond Brown Sugar Croissant ke pesanan/i,
  });
  fireEvent.click(addButton);
  expect(screen.getByText(/1 item dipilih/i)).toBeInTheDocument();

  // 3. Increment quantity (+)
  const plusButton = screen.getByRole("button", {
    name: /Tambah jumlah Almond Brown Sugar Croissant/i,
  });
  fireEvent.click(plusButton);
  expect(screen.getByText(/2 item dipilih/i)).toBeInTheDocument();

  // 4. Decrement quantity (-)
  const minusButton = screen.getByRole("button", {
    name: /Kurangi jumlah Almond Brown Sugar Croissant/i,
  });
  fireEvent.click(minusButton);
  expect(screen.getByText(/1 item dipilih/i)).toBeInTheDocument();

  // 5. Open Payment modal & validate insufficient cash, then complete payment
  const payBtn = screen.getByRole("button", { name: /Continue to Payment/i });
  fireEvent.click(payBtn);

  const cashInput = screen.getByLabelText(/Nominal Uang Tunai Diterima/i);
  fireEvent.change(cashInput, { target: { value: "5000" } });

  const processBtn = screen.getByRole("button", {
    name: /Proses Pembayaran/i,
  });
  fireEvent.click(processBtn);
  expect(screen.getByRole("alert")).toHaveTextContent(/Nominal uang kurang/i);

  const quick50kBtn = screen.getByRole("button", { name: "Rp 50.000" });
  fireEvent.click(quick50kBtn);
  fireEvent.click(processBtn);

  expect(
    screen.getByText(/Pembayaran berhasil dicatat/i)
  ).toBeInTheDocument();
  expect(screen.getAllByText(/Rp 38\.000/i).length).toBeGreaterThan(0);

  const finishBtn = screen.getByRole("button", {
    name: /Selesai & Buat Pesanan Baru/i,
  });
  fireEvent.click(finishBtn);
  expect(screen.getByText(/0 item dipilih/i)).toBeInTheDocument();
});

test("filters products by category, search query, sort, and resets filter", async () => {
  render(<App />);

  await waitFor(() => {
    expect(
      screen.getByText("Almond Brown Sugar Croissant")
    ).toBeInTheDocument();
  });

  // Search input & clear search button
  const searchInput = screen.getByLabelText(/Cari Produk/i);
  fireEvent.change(searchInput, { target: { value: "Basic" } });
  expect(
    screen.queryByText("Almond Brown Sugar Croissant")
  ).not.toBeInTheDocument();
  expect(screen.getByText("Basic Croissant La Ta Dhore")).toBeInTheDocument();

  const clearSearchBtn = screen.getByRole("button", {
    name: /Hapus pencarian/i,
  });
  fireEvent.click(clearSearchBtn);
  expect(
    screen.getByText("Almond Brown Sugar Croissant")
  ).toBeInTheDocument();

  // Sort select
  const sortSelect = screen.getByLabelText(/Urutkan/i);
  fireEvent.change(sortSelect, { target: { value: "price-asc" } });
  expect(sortSelect.value).toBe("price-asc");

  // Category filter -> empty state -> reset
  const waffleButton = screen.getByRole("button", { name: /Waffle/i });
  fireEvent.click(waffleButton);
  expect(screen.getByText(/Tidak Ada Produk yang Cocok/i)).toBeInTheDocument();

  const showAllButton = screen.getByRole("button", {
    name: /Tampilkan Semua Menu/i,
  });
  fireEvent.click(showAllButton);
  expect(screen.getByText("Basic Croissant La Ta Dhore")).toBeInTheDocument();
});


