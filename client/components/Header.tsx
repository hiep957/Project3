import Image from "next/image";
import SerachBar from "./SearchBar";
import Divider from "@mui/material/Divider";
import CategoryBar from "./CategoryBar";
import Link from "next/link";
import { CartIcon } from "./CartIcon";
import { LoginIcon } from "./LoginIcon";
import { useAppSelector } from "@/redux/hooks";

import AccountMenu from "./AccountMenu";
import { Container } from "@mui/material";

const Header = () => {
  const { isAuth, user } = useAppSelector((state) => state.auth);
  console.log("isAuth", isAuth);

  return (
    <div className="flex flex-col ">
      <div className="bg-black h-10 flex  justify-center items-center">
        <p className="text-white">
          Mien phi van chuyen voi hoa don{" "}
          <span className="text-red-500">hon 50,000</span>
        </p>
      </div>

      <Container maxWidth={false} sx={{ maxWidth: "1280px" }}>
        <div className="p-4 flex flex-col md:flex-row w-full  ">
          <div className="flex w-1/2 items-center font-bold tracking-wide">
            Hệ thống cửa hàng
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
            {isAuth ? (
              <>
                <CartIcon />
                <AccountMenu />
              </>
            ) : (
              <>
                <LoginIcon />
              </>
            )}
          </div>
        </div>
      </Container>
      <Container maxWidth={false} sx={{ maxWidth: "1280px" }}>
        <Divider></Divider>
      </Container>

      {/* Category*/}
      <div className=" flex justify-center">
        <CategoryBar />
      </div>
    </div>
  );
};

export default Header;
