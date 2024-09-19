import {
  Cog6ToothIcon,
  FunnelIcon,
  GiftIcon,
  MagnifyingGlassCircleIcon,
  MagnifyingGlassIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { BeakerIcon } from "@heroicons/react/24/outline";
import { GifIcon } from "@heroicons/react/24/outline";
import { CakeIcon } from "@heroicons/react/24/outline";
import { Products } from "./Products";
import React from "react";
import { GiCroissant } from "react-icons/gi";
import { LuCroissant, LuIceCream2 } from "react-icons/lu";
import { PiCoffee } from "react-icons/pi";
import { FaStroopwafel } from "react-icons/fa6";
import { Cart } from "./Cart";
import StaticExample, { Payment } from "./Payment";
export function Pos() {
  return (
    <div className="min-h-screen">
      <div className="w-1/4 fixed right-0 max-h-screen px-5">
        <h2 className="text-2xl py-2 font-semibold mt-2 flex justify-between">
          Current Order <Cog6ToothIcon className="w-6" />
        </h2>
        <div className="" id="order">
          <div className="" id="current">
            <Cart />
          </div>
        </div>
        <Payment />
      </div>
      <div className="w-3/4 bg-gray-200 px-5 min-h-screen">
        <header className="w-full flex justify-between">
          <div className="">
            <h1 className="text-3xl py-2 font-semibold mt-2">Welcome, Gorry</h1>
            <p>Discover whatever you need easily</p>
          </div>
          <div className="flex items-center">
            <label for="search" className="relative flex items-center">
              <MagnifyingGlassIcon className="w-4 absolute left-1" />
              <input
                type="search"
                className="bg-white-600 w-full pt-1 pr-1 pb-1 pl-6 rounded"
                id="search"
                placeholder="Search product"
              />
            </label>
            <FunnelIcon className="w-6 ml-2" />
          </div>
        </header>
        <div className="flex gap-2.5 mt-7">
          <button className="w-1/6 bg-white hover:bg-orange-500 hover:text-white flex items-center justify-center gap-2.5 py-2 rounded">
            <SparklesIcon className="w-5" /> Signature
          </button>
          <button className="w-1/6 bg-white hover:bg-orange-500 hover:text-white flex items-center justify-center gap-2.5 py-2 rounded">
            <LuCroissant className="w-4" /> Croissant
          </button>
          <button className="w-1/6 bg-white hover:bg-orange-500 hover:text-white flex items-center justify-center gap-2.5 py-2 rounded">
            <FaStroopwafel className="w-4" /> Waffle
          </button>
          <button className="w-1/6 bg-white hover:bg-orange-500 hover:text-white flex items-center justify-center gap-2.5 py-2 rounded">
            <PiCoffee className="w-4" /> Coffee
          </button>
          <button className="w-1/6 bg-white hover:bg-orange-500 hover:text-white flex items-center justify-center gap-2.5 py-2 rounded">
            <LuIceCream2 className="w-4" /> Ice cream
          </button>
        </div>
        <div
          className="max-h-96 overflow-auto mt-5 flex flex-row gap-5"
          id="product-container"
        >
          <Products />
        </div>
      </div>
    </div>
  );
}
