// ----------------------
// ItemBadge Component
// ----------------------
import Image from "next/image";

interface ItemBadgeProps {
  item: Item;
}

// Interface for an individual item
interface Item {
  _id: string;
  name: string;
  iconUrl: string;
  price: string; // e.g., "12.34 USD"
  tradable: boolean;
  owner: string;
  assetId: string;
  appId: number;
  contextId: number;
  createdAt: string; // ISO date string
  __v: number;
}

const ItemBadge: React.FC<ItemBadgeProps> = ({ item }) => {
  return (
    <div
      className="flex items-center justify-center bg-[#2C2C2E] p-3 hover:bg-gray-950 transition-colors duration-200 cursor-pointer"
      title={`${item.name} - ${item.price}`}
    >
      <Image
        src={item.iconUrl}
        alt={item.name}
        width={60}
        height={60}
        className="rounded-md"
        loading="lazy"
      />
      <div className="ml-2 flex flex-col">
        <span className="text-base text-white font-medium">{item.name}</span>
        <span className="text-xs text-gray-300">{item.price}</span>
      </div>
    </div>
  );
};

export default ItemBadge;




