import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";

export function Products({
  products: propProducts,
  isLoading = false,
  errorMessage = "",
  onRetry,
  onResetFilters,
  onAddToCart,
  cart = [],
}) {
  const [internalProducts, setInternalProducts] = useState([]);

  useEffect(() => {
    if (propProducts !== undefined) return;
    fetch("data.json")
      .then((response) => response.json())
      .then((data) => {
        setInternalProducts(data);
        localStorage.setItem("products", JSON.stringify(data));
      })
      .catch(() => {});
  }, [propProducts]);

  const products = propProducts !== undefined ? propProducts : internalProducts;

  const handleAdd = (product) => {
    if (onAddToCart) {
      onAddToCart(product);
      return;
    }
    const existingCartRaw = localStorage.getItem("cart");
    const currentCart = existingCartRaw ? JSON.parse(existingCartRaw) : [];
    const existingIndex = currentCart.findIndex((item) => item.id === product.id);
    if (existingIndex >= 0) {
      currentCart[existingIndex].counter += 1;
    } else {
      currentCart.push({
        id: product.id,
        counter: 1,
        img: product.img,
        title: product.title,
        price: Number(product.price) || 0,
      });
    }
    localStorage.setItem("cart", JSON.stringify(currentCart));
    window.dispatchEvent(new Event("pos-cart-updated"));
  };

  if (isLoading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-6"
      >
        <p className="text-sm font-semibold text-stone-800 dark:text-stone-200 mb-4">
          Memuat daftar menu dari katalog lokal...
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((placeholder) => (
            <div
              key={placeholder}
              className="border border-stone-200 dark:border-stone-800 rounded-lg p-3 bg-stone-50 dark:bg-stone-950"
            >
              <div className="w-full aspect-[4/3] bg-stone-200 dark:bg-stone-800 rounded mb-3" />
              <div className="h-4 w-2/3 bg-stone-200 dark:bg-stone-800 rounded mb-2" />
              <div className="h-3 w-full bg-stone-200 dark:bg-stone-800 rounded mb-4" />
              <div className="h-9 w-full bg-stone-200 dark:bg-stone-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div
        role="alert"
        className="bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 rounded-lg p-6 text-stone-900 dark:text-stone-100"
      >
        <h3 className="text-base font-bold text-red-900 dark:text-red-300">
          Katalog Menu Tidak Dapat Dimuat
        </h3>
        <p className="text-sm text-stone-800 dark:text-stone-200 mt-1">
          {errorMessage}
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 min-h-[44px] px-4 py-2 rounded-md bg-amber-800 hover:bg-amber-900 text-white text-sm font-semibold transition-colors"
          >
            Muat Ulang Menu
          </button>
        )}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-8 text-center">
        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
          Tidak Ada Produk yang Cocok
        </h3>
        <p className="text-sm text-stone-700 dark:text-stone-300 mt-1 max-w-md mx-auto">
          Kategori atau kata kunci pencarian yang dipilih belum memiliki item di
          katalog. Reset filter untuk menampilkan seluruh pilihan menu.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-4 min-h-[44px] px-4 py-2 rounded-md bg-amber-800 hover:bg-amber-900 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-stone-950 text-white text-sm font-semibold transition-colors"
          >
            Tampilkan Semua Menu
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {products.map((product, index) => {
        const cartItem = cart.find((item) => item.id === product.id);
        const countInCart = cartItem ? cartItem.counter : 0;
        const formattedPrice = Number(product.price || 0).toLocaleString("id-ID");

        return (
          <article
            className="flex flex-col justify-between p-3.5 text-left bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 hover:border-amber-800 dark:hover:border-amber-500 rounded-lg transition-colors"
            key={product.id}
          >
            <div>
              <div className="relative overflow-hidden rounded-md bg-stone-200 dark:bg-stone-800 aspect-[4/3]">
                <img
                  src={product.img}
                  width={320}
                  height={240}
                  fetchpriority={index === 0 ? "high" : "auto"}
                  className="w-full h-full object-cover"
                  alt={product.title}
                />
                {countInCart > 0 && (
                  <span className="absolute top-2 left-2 bg-stone-900/90 text-white text-xs font-bold px-2.5 py-1 rounded tabular-nums">
                    {countInCart} di pesanan
                  </span>
                )}
              </div>

              <div className="mt-3 flex items-start justify-between gap-2">
                <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 leading-snug">
                  {product.title}
                </h3>
              </div>

              <p className="mt-1 text-sm text-stone-700 dark:text-stone-300 line-clamp-2">
                {product.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
              <p className="text-base font-bold text-amber-800 dark:text-amber-400 tabular-nums">
                Rp {formattedPrice}
              </p>

              <button
                type="button"
                aria-label={`Tambah ${product.title} ke pesanan`}
                onClick={() => handleAdd(product)}
                className="min-h-[44px] px-3.5 py-2 rounded-md bg-amber-800 hover:bg-amber-900 active:bg-amber-950 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-stone-950 text-white text-sm font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ShoppingCartIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Tambah</span>
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

