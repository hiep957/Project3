import React, { useEffect } from "react";
import { Pencil, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { editProfileRTK, getProfileRTK } from "../redux/slice/authSlice";
import { User } from "../../types";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@mui/material";

const Settings = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<User>>({ defaultValues: user || {} });

  useEffect(() => {
    dispatch(getProfileRTK());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      reset(user);
    }
  }, [user, reset]);

  const onSubmit: SubmitHandler<Partial<User>> = async (data) => {
    if (user) {
      const resultAction = await dispatch(editProfileRTK({ updateData: data, id: user._id }));
      if (editProfileRTK.fulfilled.match(resultAction)) {
        dispatch(getProfileRTK());
      }
    }
  };

  const ProfileField: React.FC<{ label: string; field: keyof User }> = ({ label, field }) => (
    <div className="flex flex-col py-3 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <span className="text-gray-600 font-medium">{label}</span>
        <div className="flex items-center gap-2">
          <input
            type="text"
            {...register(field, {
              required: `${label} is required`,
              pattern: field === "email"
                ? { value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, message: "Invalid email format" }
                : field === "phoneNumber"
                ? { value: /^\d{10,11}$/, message: "Phone number must be 10-11 digits" }
                : undefined,
            })}
            className="border-b border-gray-300 focus:border-blue-500 outline-none px-1 py-0.5 text-gray-900 rounded-md p-4"
          />
          <X 
            className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-600 transition-colors duration-200" 
            onClick={() => user && reset(user)} 
            // title="Reset changes"
          />
        </div>
      </div>
      {errors[field] && <span className="text-red-500 text-sm">{errors[field]?.message}</span>}
    </div>
  );

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto bg-slate-100 rounded-lg shadow-lg p-8 mt-4">
      <div className="flex flex-col items-center mb-8">
        <div className="w-28 h-28 mb-4 rounded-full overflow-hidden border-4 border-blue-200">
          <img src="/src/assets/person_icon.png" alt="Profile" className="w-full h-full object-contain" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{user.name || "Jessica Alba"}</h2>
        <div className="flex items-center gap-2 text-gray-500 mt-1">
          <span className="text-sm">@{user.bio || "jennywilson"}</span>
          <Pencil className="w-4 h-4 text-blue-400 cursor-pointer hover:text-blue-600 transition-colors duration-200" />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <ProfileField label="Name" field="name" />
        <ProfileField label="Email" field="email" />
        <ProfileField label="Address" field="address" />
        <ProfileField label="Phone Number" field="phoneNumber" />
        <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" variant="contained">Save</Button>
      </form>
    </div>
  );
};

export default Settings;