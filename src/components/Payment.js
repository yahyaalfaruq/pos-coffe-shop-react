import React, { useEffect, useRef, useState } from "react";

const QUICK_DENOMINATIONS = [20000, 50000, 100000];

export function Payment({
  total: propTotal,
  itemCount = 0,
  onPaymentSuccess,
}) {
  const dialogRef = useRef(null);
  const [jumlah, setJumlah] = useState("");
  const [fallbackTotal, setFallbackTotal] = useState(0);
  const [kembalian, setKembalian] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    if (propTotal !== undefined) return;
    const sync = () => {
      const raw = localStorage.getItem("cart");
      const carts = raw ? JSON.parse(raw) : [];
      const sum = carts.reduce(
        (acc, item) => acc + Number(item.price || 0) * item.counter,
        0
      );
      setFallbackTotal(sum);
    };
    sync();
    window.addEventListener("pos-cart-updated", sync);
    return () => window.removeEventListener("pos-cart-updated", sync);
  }, [propTotal]);

  const activeTotal = propTotal !== undefined ? propTotal : fallbackTotal;

  const openModal = () => {
    setPaymentStatus(null);
    setKembalian(0);
    setJumlah(activeTotal > 0 ? String(activeTotal) : "");
    if (dialogRef.current && typeof dialogRef.current.showModal === "function") {
      dialogRef.current.showModal();
    }
  };

  const closeModal = () => {
    if (dialogRef.current && typeof dialogRef.current.close === "function") {
      dialogRef.current.close();
    }
  };

  const handleJumlahChange = (e) => {
    const digitsOnly = e.target.value.replace(/[^\d]/g, "");
    setJumlah(digitsOnly);
    setPaymentStatus(null);
    const numeric = Number(digitsOnly) || 0;
    setKembalian(numeric >= activeTotal ? numeric - activeTotal : 0);
  };

  const handleSelectQuickCash = (amount) => {
    setJumlah(String(amount));
    setPaymentStatus(null);
    setKembalian(amount >= activeTotal ? amount - activeTotal : 0);
  };

  const handleBayar = (e) => {
    if (e) e.preventDefault();
    const jumlahBayar = Number(jumlah);
    if (!jumlah || Number.isNaN(jumlahBayar) || jumlahBayar <= 0) {
      setPaymentStatus({
        type: "error",
        message: "Masukkan nominal uang tunai yang diterima dari pelanggan.",
      });
      return;
    }

    if (jumlahBayar < activeTotal) {
      const shortage = activeTotal - jumlahBayar;
      setKembalian(0);
      setPaymentStatus({
        type: "error",
        message: `Nominal uang kurang Rp ${shortage.toLocaleString(
          "id-ID"
        )} dari total tagihan.`,
      });
      return;
    }

    const change = jumlahBayar - activeTotal;
    setKembalian(change);
    setPaymentStatus({
      type: "success",
      paid: jumlahBayar,
      total: activeTotal,
      change,
      message: "Pembayaran berhasil dicatat.",
    });
  };

  const handleFinishAndReset = () => {
    setJumlah("");
    setKembalian(0);
    setPaymentStatus(null);
    if (onPaymentSuccess) {
      onPaymentSuccess();
    } else {
      localStorage.setItem("cart", JSON.stringify([]));
      window.dispatchEvent(new Event("pos-cart-updated"));
    }
    closeModal();
  };

  return (
    <div>
      <button
        type="button"
        disabled={activeTotal <= 0}
        className="bg-amber-800 hover:bg-amber-900 active:bg-amber-950 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-stone-950 w-full min-h-[44px] text-white font-semibold px-4 py-2.5 rounded-md disabled:opacity-50 disabled:pointer-events-none transition-colors"
        onClick={openModal}
      >
        Continue to Payment{" "}
        {itemCount > 0 ? `(${itemCount} item)` : ""}
      </button>

      <dialog
        ref={dialogRef}
        id="my_modal_1"
        className="modal"
        aria-labelledby="payment-modal-title"
      >
        <div className="modal-box bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-700 rounded-lg max-w-md w-full p-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
            <h3 id="payment-modal-title" className="font-bold text-lg">
              Pembayaran Kasir
            </h3>
            <button
              type="button"
              onClick={closeModal}
              className="min-h-[44px] px-3 py-1.5 text-sm font-semibold rounded-md border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              Tutup
            </button>
          </div>

          <form onSubmit={handleBayar} className="mt-4 space-y-4">
            <div className="bg-stone-100 dark:bg-stone-950 p-3.5 rounded-md border border-stone-200 dark:border-stone-800 flex justify-between items-center">
              <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                Total Tagihan
              </span>
              <span className="text-lg font-bold text-amber-800 dark:text-amber-400 tabular-nums">
                Rp {activeTotal.toLocaleString("id-ID")}
              </span>
            </div>

            <div>
              <label
                htmlFor="jumlahUang"
                className="block text-sm font-semibold text-stone-800 dark:text-stone-200 mb-1.5"
              >
                Nominal Uang Tunai Diterima (Rp)
              </label>
              <input
                className="w-full min-h-[44px] border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 rounded-md px-3 py-2 text-base tabular-nums"
                type="text"
                placeholder="Contoh: 50000"
                inputMode="numeric"
                id="jumlahUang"
                value={jumlah}
                onChange={handleJumlahChange}
              />

              <div className="mt-2 flex flex-wrap gap-2">
                {activeTotal > 0 && (
                  <button
                    type="button"
                    onClick={() => handleSelectQuickCash(activeTotal)}
                    className="min-h-[44px] px-3 py-1.5 text-xs font-semibold rounded border border-stone-300 dark:border-stone-700 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 tabular-nums"
                  >
                    Uang Pas (Rp {activeTotal.toLocaleString("id-ID")})
                  </button>
                )}
                {QUICK_DENOMINATIONS.filter((amt) => amt >= activeTotal).map(
                  (amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleSelectQuickCash(amt)}
                      className="min-h-[44px] px-3 py-1.5 text-xs font-semibold rounded border border-stone-300 dark:border-stone-700 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 tabular-nums"
                    >
                      Rp {amt.toLocaleString("id-ID")}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-dashed border-stone-300 dark:border-stone-700 flex justify-between items-center">
              <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                Kembalian
              </span>
              <span className="text-base font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                Rp {kembalian.toLocaleString("id-ID")}
              </span>
            </div>

            {paymentStatus?.type === "error" && (
              <div
                role="alert"
                className="p-3 rounded-md bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 text-xs font-semibold text-red-900 dark:text-red-300"
              >
                {paymentStatus.message}
              </div>
            )}

            {paymentStatus?.type === "success" && (
              <div
                role="status"
                className="p-4 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-stone-900 dark:text-stone-100 space-y-2"
              >
                <p className="text-sm font-bold text-emerald-900 dark:text-emerald-300">
                  {paymentStatus.message}
                </p>
                <div className="text-xs space-y-1 tabular-nums">
                  <div className="flex justify-between">
                    <span>Total Pesanan:</span>
                    <span>Rp {paymentStatus.total.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tunai Diterima:</span>
                    <span>Rp {paymentStatus.paid.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Kembalian Pelanggan:</span>
                    <span>Rp {paymentStatus.change.toLocaleString("id-ID")}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleFinishAndReset}
                  className="mt-2 w-full min-h-[44px] px-4 py-2 rounded-md bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-semibold transition-colors"
                >
                  Selesai &amp; Buat Pesanan Baru
                </button>
              </div>
            )}

            {paymentStatus?.type !== "success" && (
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="submit"
                  className="w-full min-h-[44px] px-4 py-2 rounded-md bg-amber-800 hover:bg-amber-900 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-stone-950 text-white text-sm font-semibold transition-colors"
                >
                  Proses Pembayaran
                </button>
              </div>
            )}
          </form>
        </div>
      </dialog>
    </div>
  );
}
export default Payment;

