"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface InventoryItem {
  iconUrl: string;
  name: string;
  price: string;
  owner: string;
  _id: string;
}

interface InventoryResponse {
  items: InventoryItem[];
}

const InventoryPage: React.FC<{
  onSelectItem: (items: InventoryItem[]) => void;
  onTotalPrice: (totalPrice: number) => void;
  searchQuery: string;
}> = ({ onTotalPrice, onSelectItem, searchQuery }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [selectionEnabled, setSelectionEnabled] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<InventoryItem[]>([]);
  const [token, setToken] = useState<string | null>(null);

  const SOCKET_SERVER_URL =
    process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:5000";


  // Maximum number of items that can be selected
  const MAX_SELECTED_ITEMS = 20;

  // Get token from localStorage on client side
  useEffect(() => {
    const jwtToken = localStorage.getItem('jwtToken');
    setToken(jwtToken);
  }, []);

  // Fetch inventory and handle loading state
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        if (!token) {
          throw new Error("User not authenticated");
        }

        const response = await fetch(`${SOCKET_SERVER_URL}/api/inventory`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // Include JWT in header
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch inventory");
        }

        const data: InventoryResponse = await response.json();
        if (data.items.length === 0) {
          setError("No Items in Inventory");
        } else {
          setInventory(data.items);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
        setTimeout(() => setSelectionEnabled(true), 2000);
      }
    };

    if (token !== null) {
      fetchInventory();
    }
  }, [token]);

  // Rest of your component code...

  // Function to calculate and send the total price of selected items
  const updateTotalPrice = (selectedItems: InventoryItem[]) => {
    const totalPrice = selectedItems.reduce(
      (total, item) => total + parseFloat(item.price),
      0
    );
    onTotalPrice(totalPrice); // Send the total price to parent
  };

  // Filter inventory based on search query
  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p>Loading...</p>;
  if (error) 
    return <div className="text-center text-slate-400 h-[40vh] w-2/3 mx-auto flex items-center justify-center">{error} <br/>
            Note: If you have item in steam inventory and still not visible here, then there are two reasons may be that items are not tradeable or the items are not public.
            </div>


  return (
    <div className="h-[92%] overflow-y-auto">
      {showMessage && (
        <div className="bg-red-700 text-white p-2 text-center mb-4">
          {showMessage}
        </div>
      )}
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 p-16 md:p-2 lg:p-10">
        {filteredInventory.map((item) => {
          const isSelected = selectedItems.some(
            (selectedItem) => selectedItem._id === item._id
          );

          return (
            <li key={item._id} onClick={() => handleItemClick(item)}>
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className={`relative flex items-center justify-center w-full md:w-40 lg:w-48 h-28 border-[#2C2C2E] border-t-4 border-l-0 border-r-0 border-b-4 border-[1px] 
                 ${
                   isSelected
                     ? "bg-green-900"
                     : "bg-gradient-to-r from-[#404040] to-[#636363]"
                 } 
                 cursor-pointer`}
              >
                <div className="flex items-center justify-start gap-0">
                  <div className="text-[#EEC475] text-[11px] absolute left-0 top-0 bg-[#2C2C2E] w-12 h-6 flex justify-center items-center text-center text-wrap">
                    $ {item.price}
                  </div>
                  <div className="inclined-div h-6 w-4 absolute left-[46px] top-0 rotate bg-[#2C2C2E]"></div>
                </div>
                <img
                  src={item.iconUrl}
                  alt={item.name}
                  width={62}
                  height={62}
                />
                <p className="text-white text-[10px] absolute bottom-0 text-center">
                  {item.name}
                </p>
                {isSelected && (
                  <div className="absolute top-1 right-1 text-green-500">
                    ✔
                  </div>
                )}
              </motion.div>
            </li>
          );
        })}
      </ul>
    </div>
  );

  // Function to handle item click
  function handleItemClick(item: InventoryItem) {
    const alreadySelected = selectedItems.some(
      (selectedItem) => selectedItem._id === item._id
    );

    if (
      alreadySelected ||
      (selectedItems.length < MAX_SELECTED_ITEMS && selectionEnabled)
    ) {
      setSelectedItems((prevSelectedItems) => {
        let newSelectedItems;
        if (alreadySelected) {
          // Unselect the item
          newSelectedItems = prevSelectedItems.filter(
            (selectedItem) => selectedItem._id !== item._id
          );
        } else {
          // Select the item
          newSelectedItems = [...prevSelectedItems, item];
        }

        // Update total price and notify parent of selected items
        updateTotalPrice(newSelectedItems);
        onSelectItem(newSelectedItems);
        return newSelectedItems;
      });
      setShowMessage(null); // Hide any error message when selection is valid
    } else if (!selectionEnabled) {
      setShowMessage("Selection is currently disabled. Please wait.");
    } else if (selectedItems.length >= MAX_SELECTED_ITEMS) {
      setShowMessage(`You cannot select more than ${MAX_SELECTED_ITEMS} items.`);
    }
  }
};

export default InventoryPage;
