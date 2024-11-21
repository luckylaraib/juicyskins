"use client";
import { Dialog, DialogPanel, PopoverGroup } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import LOGO from "@/assets/images/Logo.png";
import SteamLogin from "@/app/Steam/page";
import React, { useState } from "react";
import InventoryModal from "./inventoryModal";
import { useUserContext } from "@/context/UserContext";
import LOGINBUTTON from "@/assets/images/steamLogin.png";
import IMGSTEAMBTN from "@/assets/images/SteamLoginButton.png";

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const { isLoggedIn } = useUserContext()
  return (
    <header className="bg-headerBackground">
      <nav
        className="flex w-full h-[72px] items-center justify-between px-5 py-0 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5 flex">
            <Image src={LOGO} alt="Logo" width={130} />
          </a>
          <div className="hidden lg:flex gap-7 items-center ml-4 text-headerText">

            {isLoggedIn && (
              <div>
                <button id="loginButton">
                  <InventoryModal />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="!flex !gap-x-5 lg:!hidden">
          <div className="flex lg:hidden gap-7 items-center ml-4 text-headerText">
            {isLoggedIn && (
              <div>
                <button id="loginButton">
                  <InventoryModal />
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-headerText"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <PopoverGroup className="!hidden lg:!flex lg:gap-x-12">
          <SteamLogin />
        </PopoverGroup>
      </nav>
      <div>
        {/* Button to open the mobile menu */}
        
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />

          <div className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-headerBackground px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <Image className="h-16 w-auto" src={LOGO} alt="" />
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6 text-headerText" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <a
                    href="#"
                    className="-mx-3 flex rounded-lg px-3 py-2 text-base font-semibold leading-7 text-headerText hover:bg-gray-50"
                  >
                    FAQ's
                  </a>
                  <a
                    href="#"
                    className="-mx-3 flex rounded-lg px-3 py-2 text-base font-semibold leading-7 text-headerText hover:bg-gray-50"
                  >
                    ToS
                  </a>
                </div>
                <div className="py-6">
                  <SteamLogin />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </header>
  );
}
