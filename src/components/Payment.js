import { useState, useEffect } from "react";

export function Payment() {
  const [jumlah, setJumlah] = useState("");
  const [total, setTotal] = useState(0);
  const [bayar, setBayar] = useState("");
  const [kembalian, setKembalian] = useState(0);

  useEffect(() => {
    setTotal(totalPrice());
  }, []);

  const totalPrice = () => {
    const carts = getCartFromLocalStorage();
    return carts.reduce((acc, item) => acc + item.price * item.counter, 0);
  };

  const getCartFromLocalStorage = () => {
    const cart = localStorage.getItem("cart");
    if (cart) {
      return JSON.parse(cart);
    }
    return [];
  };

  const handleJumlah = (e) => {
    setJumlah(e.target.value);
  };

  const handleBayar = () => {
    const jumlahBayar = parseFloat(jumlah);
    if (jumlahBayar >= total) {
      setBayar(jumlahBayar);
      setKembalian(jumlahBayar - total);
      alert("Pembayaran berhasil, terimakasih");
    } else if (jumlahBayar === total) {
      alert("Pembayaran berhasil, terimakasih");
    } else {
      alert("Jumlah uang yang dibayar kurang dari total harga.");
      setKembalian(0);
    }
    setJumlah("");
  };

  return (
    <div>
      <button
        className="bg-orange-500 w-full mt-2 text-white p-1 rounded hover:border-solid border-2 hover:border-white"
        onClick={() => document.getElementById("my_modal_1").showModal()}
      >
        Continue to Payment
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <div className="flex justify-between">
            <h3 className="font-bold text-lg">Payment</h3>
            <input
              className="border-4 focus:outline-none rounded px-2 py-1"
              type="text"
              placeholder="Masukkan jumlah uang"
              inputMode="numeric"
              id="jumlahUang"
              value={jumlah}
              onChange={handleJumlah}
            />
          </div>
          <h4 className="mt-5 border-b-2 flex justify-between">
            Total <span>{total}</span>
          </h4>
          <h4 className="mt-5 border-b-2 flex justify-between">
            Kembalian <span>{kembalian}</span>
          </h4>
          <div className="modal-action">
            <form className="flex gap-2" method="dialog">
              <button className="btn">Close</button>
            </form>
            <button
              className="text-orange-500 hover:border-b-2"
              onClick={handleBayar}
            >
              Continue
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
