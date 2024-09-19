import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("data.json")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setProducts(data);
        saveProductsToLocalStorage(data);
      });
  }, []);

  const addToOrder = (id) => {
    const cart = getCartFromLocalStorage();
    const products = getProductsFromLocalStorage();
    const productSelected = products.find((product) => product.id === id);
    const existingProduct = cart.some((product) => product.id === id);
    const productFind = cart.find((product) => product.id === id);
    if (existingProduct) {
      productFind.counter++;
    } else {
      cart.push({
        id: id,
        counter: 1,
        img: productSelected.img,
        title: productSelected.title,
        price: productSelected.price,
      });
    }
    saveCartToLocalStorage(cart);
  };

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

  const getProductsFromLocalStorage = () => {
    const products = localStorage.getItem("products");
    if (products) {
      return JSON.parse(products);
    }
    return [];
  };

  const saveProductsToLocalStorage = (arg) => {
    localStorage.setItem("products", JSON.stringify(arg));
  };

  return (
    <div className="flex flex-row flex-wrap gap-5">
      {products.map((product) => (
        <div
          className="flex flex-col w-64 shadow-2xl justify-between p-2.5 text-left hover:translate-y-2 transition-transform bg-white rounded"
          id="product"
          key={product.id}
        >
          <div className="relative">
            <img
              src={product.img}
              height={200}
              width={250}
              className="w-full h-auto"
              alt={product.title}
            />
            <button
              className="absolute top-2 right-2 bg-white bg-opacity-80 text-orange-500 rounded-full p-2 flex justify-center items-center"
              onClick={() => addToOrder(product.id)}
            >
              <ShoppingCartIcon className="w-5 h-5" />
            </button>
          </div>
          <h3 id="title-product" className="mt-2 font-bold">
            {product.title}
          </h3>
          <span id="description" className="text-gray-700">
            {product.description}
          </span>
          <p className="mt-1">
            Rp
            <strong id="price" className="ml-1 text-orange-500">
              {product.price}
            </strong>
          </p>
        </div>
      ))}
    </div>
  );
}
