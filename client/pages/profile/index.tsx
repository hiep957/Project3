import { Layout } from "@/components/Layout";
import { Container } from "@mui/material";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import ViewProfile from "@/components/Profile/ViewProflie";
import ChangeProfile from "@/components/Profile/ChangeProfile";
import ChangePassword from "@/components/Profile/ChangePassword";
import NavigationComponent from "@/components/Profile/NavigationComponet";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getUser } from "@/redux/slice/userSlice";
import { User } from "@/redux/slice/authSlice";
const API_URL = process.env.SV_HOST || "http://localhost:5000";
const componentPage = ["Profile", "ChangeProfile", "ChangePassword"];

const Profile = () => {
  const [componentPage, setComponentPage] = useState("Profile");

  const dispatch = useAppDispatch();
  const {user, loading, error} = useAppSelector((state) => state.user);
  useEffect(() => {
    dispatch(getUser());
  }, []);
  console.log("user: ", user);

  return (
    <Layout>
      <Container maxWidth={false} sx={{ maxWidth: "1280px" }}>
        <div className="border bg-gray-100 h-[480px]">
          <div className="flex flex-row h-full">
            <div className="flex-1">
              <div className="flex justify-center items-center h-full flex-col">
                <Image
                  src="/anhdep.png"
                  alt="Avatar"
                  width={300}
                  height={300}
                  className="bg-purple-200 rounded object-contain"
                ></Image>
                <div>Thêm ảnh</div>
              </div>
            </div>
            <div className="flex-1 p-8 space-y-8">
              <NavigationComponent
                setComponentPage={setComponentPage}
                componentPage={componentPage}
              ></NavigationComponent>

              {componentPage === "Profile" && <ViewProfile />}
              {componentPage === "ChangeProfile" && <ChangeProfile />}
              {componentPage === "ChangePassword" && <ChangePassword />}
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
};

export default Profile;
