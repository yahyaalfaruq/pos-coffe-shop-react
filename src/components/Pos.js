import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowsUpDownIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  Squares2X2Icon,
  SunIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { LuCroissant, LuIceCream2 } from "react-icons/lu";
import { PiCoffee } from "react-icons/pi";
import { FaStroopwafel } from "react-icons/fa6";
import { GiCroissant } from "react-icons/gi";
import { Products } from "./Products";
import { Cart } from "./Cart";
import { Payment } from "./Payment";

const CATEGORIES = [
  { id: "All", label: "Semua Menu", Icon: Squares2X2Icon },
  { id: "Signature", label: "Signature", Icon: GiCroissant },
  { id: "Croissant", label: "Croissant", Icon: LuCroissant },
  { id: "Waffle", label: "Waffle", Icon: FaStroopwafel },
  { id: "Coffee", label: "Coffee", Icon: PiCoffee },
  { id: "Ice cream", label: "Ice cream", Icon: LuIceCream2 },
];

const readCartFromStorage = () => {
  try {
    const raw = localStorage.getItem("cart");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeCartToStorage = (items) => {
  localStorage.setItem("cart", JSON.stringify(items));
  window.dispatchEvent(new Event("pos-cart-updated"));
};

export const formatRupiah = (value) => {
  const num = Number(value) || 0;
  return `Rp ${num.toLocaleString("id-ID")}`;
};

export function Pos() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [cart, setCart] = useState(() => readCartFromStorage());
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("pos_theme") === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }
    localStorage.setItem("pos_theme", theme);
  }, [theme]);

  const loadProducts = () => {
    setIsLoading(true);
    setErrorMessage("");
    fetch("data.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const normalized = (Array.isArray(data) ? data : []).map((item) => ({
          ...item,
          price: Number(item.price) || 0,
          category: item.category || "Croissant",
          isSignature: Boolean(item.isSignature),
        }));
        setProducts(normalized);
        localStorage.setItem("products", JSON.stringify(normalized));
        setIsLoading(false);
      })
      .catch(() => {
        setErrorMessage(
          "Gagal memuat daftar produk dari server lokal. Periksa koneksi atau berkas data.json lalu muat ulang."
        );
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const syncCart = () => {
      setCart(readCartFromStorage());
    };
    window.addEventListener("pos-cart-updated", syncCart);
    window.addEventListener("storage", syncCart);
    return () => {
      window.removeEventListener("pos-cart-updated", syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      let nextCart;
      if (existing) {
        nextCart = prevCart.map((item) =>
          item.id === product.id
            ? { ...item, counter: item.counter + 1 }
            : item
        );
      } else {
        nextCart = [
          ...prevCart,
          {
            id: product.id,
            counter: 1,
            img: product.img,
            title: product.title,
            price: Number(product.price) || 0,
          },
        ];
      }
      writeCartToStorage(nextCart);
      return nextCart;
    });
  };

  const handleUpdateQuantity = (id, delta) => {
    setCart((prevCart) => {
      const nextCart = prevCart
        .map((item) =>
          item.id === id ? { ...item, counter: item.counter + delta } : item
        )
        .filter((item) => item.counter > 0);
      writeCartToStorage(nextCart);
      return nextCart;
    });
  };

  const handleClearCart = () => {
    setCart([]);
    writeCartToStorage([]);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSortBy("default");
  };

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const list = products.filter((item) => {
      const matchesCategory =
        selectedCategory === "All"
          ? true
          : selectedCategory === "Signature"
          ? Boolean(item.isSignature)
          : item.category?.toLowerCase() === selectedCategory.toLowerCase();

      const matchesQuery =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });

    if (sortBy === "price-asc") {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price-desc") {
      return [...list].sort((a, b) => b.price - a.price);
    }
    if (sortBy === "name-asc") {
      return [...list].sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [products, searchQuery, selectedCategory, sortBy]);

  const totalItemsInCart = useMemo(
    () => cart.reduce((sum, item) => sum + item.counter, 0),
    [cart]
  );

  const totalAmount = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.price) * item.counter, 0),
    [cart]
  );

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 dark:bg-stone-950 dark:text-stone-100 flex flex-col">
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left column: Header, Category Nav, and Main Catalog */}
        <div className="w-full lg:w-2/3 xl:w-3/4 px-4 sm:px-6 py-5 flex flex-col">
          <header className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-stone-300 dark:border-stone-800">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
                La Ta Dhore POS
              </h1>
              <p className="text-sm text-stone-700 dark:text-stone-300 mt-1">
                Kasir: Gorry | Pilih produk untuk ditambahkan ke pesanan aktif
              </p>
            </div>

            <div className="flex flex-wrap items-end gap-3">
              {/* Search Field with visible label */}
              <div className="flex flex-col flex-1 sm:flex-initial min-w-[200px]">
                <label
                  htmlFor="search"
                  className="text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1"
                >
                  Cari Produk
                </label>
                <div className="relative flex items-center">
                  <MagnifyingGlassIcon
                    className="w-4 h-4 text-stone-600 dark:text-stone-400 absolute left-3 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 w-full min-h-[44px] pl-9 pr-9 py-2 rounded-md text-sm"
                    placeholder="Ketik nama croissant..."
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      aria-label="Hapus pencarian"
                      className="absolute right-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 rounded"
                    >
                      <XMarkIcon className="w-4 h-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>

              {/* Sort Select with visible label */}
              <div className="flex flex-col">
                <label
                  htmlFor="sort-products"
                  className="text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1 flex items-center gap-1"
                >
                  <ArrowsUpDownIcon className="w-3.5 h-3.5" aria-hidden="true" />
                  Urutkan
                </label>
                <select
                  id="sort-products"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 min-h-[44px] px-3 py-2 rounded-md text-sm"
                >
                  <option value="default">Urutan Standar</option>
                  <option value="price-asc">Harga: Terendah</option>
                  <option value="price-desc">Harga: Tertinggi</option>
                  <option value="name-asc">Nama: A ke Z</option>
                </select>
              </div>

              {/* Working Theme Toggle */}
              <button
                type="button"
                onClick={() =>
                  setTheme((prev) => (prev === "dark" ? "light" : "dark"))
                }
                aria-label={
                  theme === "dark"
                    ? "Beralih ke mode terang"
                    : "Beralih ke mode gelap"
                }
                className="min-h-[44px] px-3 py-2 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-100 flex items-center gap-2 text-sm font-medium transition-colors"
              >
                {theme === "dark" ? (
                  <>
                    <SunIcon className="w-4 h-4 text-amber-400" aria-hidden="true" />
                    <span>Terang</span>
                  </>
                ) : (
                  <>
                    <MoonIcon className="w-4 h-4 text-stone-700" aria-hidden="true" />
                    <span>Gelap</span>
                  </>
                )}
              </button>
            </div>
          </header>

          {/* Category Filter Navigation */}
          <nav
            aria-label="Filter kategori menu"
            className="mt-5 flex flex-wrap gap-2"
          >
            {CATEGORIES.map(({ id, label, Icon }) => {
              const isSelected = selectedCategory === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedCategory(id)}
                  className={`min-h-[44px] px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 border transition-colors ${
                    isSelected
                      ? "bg-amber-800 text-white border-amber-900 dark:bg-amber-500 dark:text-stone-950 dark:border-amber-400"
                      : "bg-white text-stone-800 border-stone-300 hover:bg-stone-200 dark:bg-stone-900 dark:text-stone-200 dark:border-stone-700 dark:hover:bg-stone-800"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>

          {/* Main Product Catalog */}
          <main id="product-container" className="mt-6 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                Daftar Menu{" "}
                <span className="text-sm font-normal text-stone-700 dark:text-stone-300 tabular-nums">
                  ({filteredProducts.length} item)
                </span>
              </h2>
              {(searchQuery || selectedCategory !== "All" || sortBy !== "default") && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="min-h-[44px] px-3 py-1.5 text-sm font-semibold text-amber-800 dark:text-amber-400 hover:underline rounded"
                >
                  Reset Filter
                </button>
              )}
            </div>

            <Products
              products={filteredProducts}
              isLoading={isLoading}
              errorMessage={errorMessage}
              onRetry={loadProducts}
              onResetFilters={handleResetFilters}
              onAddToCart={handleAddToCart}
              cart={cart}
            />
          </main>
        </div>

        {/* Right column: Persistent Current Order & Payment Ticket */}
        <aside
          id="order"
          aria-label="Pesanan saat ini"
          className="w-full lg:w-1/3 xl:w-1/4 bg-white dark:bg-stone-900 border-t lg:border-t-0 lg:border-l border-stone-300 dark:border-stone-800 px-5 py-5 flex flex-col justify-between lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-dashed border-stone-300 dark:border-stone-700">
              <div>
                <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                  Current Order
                </h2>
                <p className="text-xs text-stone-700 dark:text-stone-300 tabular-nums">
                  {totalItemsInCart} item dipilih
                </p>
              </div>
              <button
                type="button"
                onClick={handleClearCart}
                disabled={cart.length === 0}
                aria-label="Kosongkan semua pesanan"
                className="min-h-[44px] px-3 py-2 rounded-md border border-stone-300 dark:border-stone-700 text-xs font-semibold flex items-center gap-1.5 text-stone-800 dark:text-stone-200 hover:bg-red-50 hover:text-red-800 hover:border-red-300 dark:hover:bg-red-950/40 dark:hover:text-red-300 disabled:opacity-50 disabled:pointer-events-none transition-colors"
              >
                <TrashIcon className="w-4 h-4" aria-hidden="true" />
                <span>Kosongkan</span>
              </button>
            </div>

            <div id="current" className="mt-4">
              <Cart
                carts={cart}
                onUpdateQuantity={handleUpdateQuantity}
                totalAmount={totalAmount}
              />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-dashed border-stone-300 dark:border-stone-700">
            <Payment
              total={totalAmount}
              itemCount={totalItemsInCart}
              onPaymentSuccess={handleClearCart}
            />
          </div>
        </aside>
      </div>

      <footer className="px-6 py-3 bg-stone-200/80 dark:bg-stone-900 border-t border-stone-300 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>La Ta Dhore Bakery &amp; Coffee Counter POS</span>
        <span>Draft without direction | Dial: ENERGY 1 / RHYTHM 1 / MOTION 1</span>
      </footer>
    </div>
  );
}

