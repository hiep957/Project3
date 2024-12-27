import React from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getUser, updateUser } from "@/redux/slice/userSlice";

const ChangeProfile = () => {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: user.user?.name || "",
      email: user.user?.email || "",
      phoneNumber: user.user?.phoneNumber || "",
      address: user.user?.address || "",
    },
  });

  const onSubmit = async (data: any) => {
    const resultAction = await dispatch(updateUser(data));
    if (updateUser.fulfilled.match(resultAction)) {
      dispatch(getUser());
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Tên</label>
        <input
          {...register("name", { required: "Tên không được để trống" })}
          className="w-full p-2 border rounded"
          placeholder="Tên"
        />
        {errors.name && typeof errors.name.message === "string" && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          {...register("email", {
            required: "Email không được để trống",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Email không hợp lệ",
            },
          })}
          className="w-full p-2 border rounded"
          placeholder="Email"
        />
        {errors.email && typeof errors.email.message === "string" && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Số điện thoại</label>
        <input
          {...register("phoneNumber", {
            pattern: {
              value: /^[0-9]{10,11}$/,
              message: "Số điện thoại không hợp lệ",
            },
          })}
          className="w-full p-2 border rounded"
          placeholder="Số điện thoại"
        />
        {errors.phoneNumber &&
          typeof errors.phoneNumber.message === "string" && (
            <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
          )}
      </div>

      <div>
        <label className="block text-sm font-medium">Địa chỉ</label>
        <input
          {...register("address")}
          className="w-full p-2 border rounded"
          placeholder="Địa chỉ"
        />
      </div>

      <div className="flex space-x-2">
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
        <button
          type="button"
          onClick={() => reset()}
          className="p-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Hủy
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default ChangeProfile;
