import Image from "next/image";
import SerachBar from "./SearchBar";
import Divider from "@mui/material/Divider";
import CategoryBar from "./CategoryBar";
import Link from "next/link";

const Header = () => {
  return (
    <div className=" flex flex-col ">
      <div className="bg-black h-10 flex justify-center items-center">
        <p className="text-white">
          Mien phi van chuyen voi hoa don{" "}
          <span className="text-red-500">hon 50,000</span>
        </p>
      </div>

      <div className="container mx-auto px-20  py-10 flex  flex-col md:flex-row w-full ">
        <div className="flex w-1/2 items-center font-bold tracking-wide">
          He thong cua hang
        </div>
        <div>
          <Link href="/" passHref>
            <Image
              height={70}
              width={70}
              fetchPriority="high"
              src="https://deltasport.vn/wp-content/uploads/2024/08/LogoWeb_CatNen.png"
              alt={""}
            ></Image>
          </Link>
        </div>
        <div className="flex flex-row space-x-4 w-1/2 justify-end items-center">
          <SerachBar />
          <div>icon 1</div>
          <div>icon 2</div>
        </div>
      </div>

      <div className="container mx-auto px-20">
        <Divider></Divider>
      </div>

      {/* Category*/}
      <div className="container mx-auto px-20 flex justify-center">
        <CategoryBar />
      </div>
    </div>
  );
};

export default Header;
