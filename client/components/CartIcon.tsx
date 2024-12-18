import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import { CiShoppingCart } from "react-icons/ci";

export const CartIcon = () => {
  const {cart} = useAppSelector((state) => state.cart);
  
  return (
    <Link href="/cart" passHref>
      <div className="relative flex items-center">
        <CiShoppingCart className="w-8 h-8" />
        <span className="absolute top-0 left-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
          {cart ? cart.items.length: 0}
        </span>
      </div>
    </Link>
  );
};
//"66fd26105a244233a1cf743d"