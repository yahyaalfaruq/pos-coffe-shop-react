import React, { useEffect, useState } from "react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

export function Cart({ carts: propCarts, onUpdateQuantity, totalAmount }) {
  const [internalCarts, setInternalCarts] = useState([]);

  useEffect(() => {
    if (propCarts !== undefined) return;
    const sync = () => {
      const raw = localStorage.getItem("cart");
      setInternalCarts(raw ? JSON.parse(raw) : []);
    };
    sync();
    window.addEventListener("pos-cart-updated", sync);
    return () => window.removeEventListener("pos-cart-updated", sync);
  }, [propCarts]);

  const carts = propCarts !== undefined ? propCarts : internalCarts;

  const handleAdjust = (id, delta) => {
    if (onUpdateQuantity) {
      onUpdateQuantity(id, delta);
      return;
    }
    const updated = carts
      .map((item) =>
        item.id === id ? { ...item, counter: item.counter + delta } : item
      )
      .filter((item) => item.counter > 0);
    setInternalCarts(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("pos-cart-updated"));
  };

  const calculatedTotal =
    totalAmount !== undefined
      ? totalAmount
      : carts.reduce(
          (acc, item) => acc + Number(item.price || 0) * item.counter,
          0
        );

  return (
    <div className="flex flex-col">
      {carts.length === 0 ? (
        <div className="py-8 px-4 text-center border border-dashed border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-950">
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
            Belum Ada Item di Pesanan
          </h3>
          <p className="text-xs text-stone-700 dark:text-stone-300 mt-1">
            Klik tombol Tambah pada kartu produk di sebelah kiri untuk mulai
            mencatat transaksi pelanggan.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-stone-200 dark:divide-stone-800 max-h-[50vh] overflow-y-auto pr-1">
          {carts.map((product) => {
            const unitPrice = Number(product.price || 0);
            const lineSubtotal = unitPrice * product.counter;
            return (
              <li
                key={product.id}
                className="py-3 flex flex-row items-center gap-3"
              >
                <div className="w-16 h-16 shrink-0 rounded-md overflow-hidden bg-stone-200 dark:bg-stone-800">
                  <img
                    className="w-full h-full object-cover"
                    src={product.img}
                    alt={product.title}
                    width={64}
                    height={64}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                    {product.title}
                  </h3>
                  <p className="text-xs text-stone-700 dark:text-stone-300 tabular-nums mt-0.5">
                    Rp {unitPrice.toLocaleString("id-ID")} x {product.counter} ={" "}
                    <strong className="text-amber-800 dark:text-amber-400">
                      Rp {lineSubtotal.toLocaleString("id-ID")}
                    </strong>
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={`Kurangi jumlah ${product.title}`}
                      className="min-w-[44px] min-h-[44px] rounded-md border border-stone-300 dark:border-stone-700 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 flex items-center justify-center transition-colors"
                      onClick={() => handleAdjust(product.id, -1)}
                    >
                      <MinusIcon className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <span className="min-w-[28px] text-center text-sm font-bold tabular-nums text-stone-900 dark:text-stone-100">
                      {product.counter}
                    </span>
                    <button
                      type="button"
                      aria-label={`Tambah jumlah ${product.title}`}
                      className="min-w-[44px] min-h-[44px] rounded-md bg-amber-800 hover:bg-amber-900 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-stone-950 flex items-center justify-center transition-colors"
                      onClick={() => handleAdjust(product.id, 1)}
                    >
                      <PlusIcon className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-4 bg-stone-100 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 p-4 rounded-lg">
        <div className="flex justify-between items-center text-base font-bold text-stone-900 dark:text-stone-100">
          <span>Total Tagihan:</span>
          <span className="text-lg text-amber-800 dark:text-amber-400 tabular-nums">
            Rp {calculatedTotal.toLocaleString("id-ID")}
          </span>
        </div>
      </div>
    </div>
  );
}

