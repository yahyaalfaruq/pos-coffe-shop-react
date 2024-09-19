import React, { useEffect, useState } from "react";

export function Cart() {
  const [carts, setCart] = useState([]);

  useEffect(() => {
    const cartItems = getCartFromLocalStorage();
    setCart(cartItems);
  }, []);

  const getCartFromLocalStorage = () => {
    const cart = localStorage.getItem("cart");
    if (cart) {
      return JSON.parse(cart);
    }
    return [];
  };

  const saveCartToLocalStorage = (arg) => {
    localStorage.setItem("cart", JSON.stringify(arg));
  };

  const cartCurrent = (id, counter) => {
    const updatedCart = carts
      .map((item) =>
        item.id === id ? { ...item, counter: item.counter + counter } : item
      )
      .filter((item) => item.counter > 0);
    setCart(updatedCart);
    saveCartToLocalStorage(updatedCart);
  };

  const totalPrice = () => {
    return carts.reduce((acc, item) => acc + item.price * item.counter, 0);
  };
  return (
    <div className="flex flex-col">
      {carts.map((product) => {
        return (
          <div className="flex flex-row gap-2 mb-5">
            <div className="w-2/5">
              <img
                className="w-full rounded"
                src={product.img}
                alt={product.title}
                id="img"
              />
            </div>
            <div className="flex flex-col justify-between">
              <h3 className=" text-base font-bold" id="title-product">
                {product.title}
              </h3>
              <div className="flex flex-row justify-between items-end">
                <p>
                  <strong className="text-orange-500" id="price">
                    {product.price}
                  </strong>
                </p>
                <div className="flex items-center justify-center text-base border-none gap-2">
                  <button
                    id="minus"
                    className=" bg-orange-300 rounded p-1"
                    onClick={() => cartCurrent(product.id, -1)}
                  >
                    -
                  </button>
                  <div id="counter" class="counter">
                    {product.counter}
                  </div>
                  <button
                    id="plus"
                    className="bg-orange-500 rounded p-1"
                    onClick={() => cartCurrent(product.id, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div className="bg-gray-300 p-4 rounded-lg">
        <hr className="mb-4" />
        <h3 className="text-xl font-semibold flex justify-between">Total: <span>{totalPrice()}</span></h3>
      </div>
    </div>
  );
}
