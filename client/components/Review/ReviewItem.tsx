import { useAppSelector } from "@/redux/hooks";
import { Avatar, dividerClasses, Rating } from "@mui/material";
import { useState } from "react";
import EditReviewDialog from "./EditReviewDialog";
import { toast } from "react-toastify";

type ReviewItemProps = {
  _id: string;
  rating: number;
  comment: string;
  productId: string;
  userId: any;
  createdAt: string;
  updatedAt: string;
  getReview: () => void;
};

const ReviewItem = ({ getReview, ...data }: ReviewItemProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reviewData, setReviewData] = useState<any[]>([]);
  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);
  const handeleUpdate = async (rating: number, comment: String) => {
    console.log("Update Review: ", data);
    const response = await fetch(
      `http://localhost:5000/api/v1/review/update/${data._id}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating: rating, comment: comment }),
      }
    );
    if (response.ok) {
      getReview();
      toast.success("Update Review Success");
      console.log("Update Review Success");
    } else {
      const error = (await response.json()).message;
      toast.error(error || "Đã có lỗi xảy ra");
      console.log("Update Review Failed");
    }
  };

  const removeReview = async () => {
    const response = await fetch(
      `http://localhost:5000/api/v1/review/remove/${data._id}`,
      {
        method: "delete",
        credentials: "include",
      }
    );
    if (response.ok) {
      getReview();
      toast.success("Đã xóa bình luận của bạn");
      console.log("Delete Review Success");
    } else {
      const error = (await response.json()).message;
      toast.error(error || "Đã có lỗi xảy ra");
      console.log("Delete Review Failed");
    }
  };
  const [value, setValue] = useState<number | null>(2);
  if (!data) return <div>Không có dữ liệu</div>;
  console.log("Review Item Data: ", data);
  const [itemOfUser, setItemOfUser] = useState<any[]>([]);
  const { user } = useAppSelector((state) => state.user);
  console.log("user: ", user);
  let isDeleteAndUpdate = false;
  if (user.user?._id === data.userId._id) {
    isDeleteAndUpdate = true;
  }
  const formatVietnamTime = (utcTime: any) => {
    const date = new Date(utcTime);
    const options: any = {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    return new Intl.DateTimeFormat("vi-VN", options).format(date);
  };
  console.log("isDeleteAndUpdate: ", isDeleteAndUpdate);
  return (
    <div className="border border-gray-300 p-4  rounded">
      <Rating name="simple-controlled" value={data.rating} readOnly></Rating>
      <div className="flex flex-row space-x-3">
        <Avatar className="mt-2">H</Avatar>
        <div className="flex flex-col">
          <p>{data.userId.name}</p>
          <p className="italic font-sm">Cập nhật lúc: {formatVietnamTime(data.updatedAt)}</p>
        </div>
        {isDeleteAndUpdate && (
          <>
            <div className="flex flex-row space-x-3 ">
              <button className="text-blue-500" onClick={handleOpenDialog}>
                Sửa
              </button>
              <button className="text-red-500" onClick={removeReview}>
                Xóa
              </button>
            </div>
            <EditReviewDialog
              open={dialogOpen}
              onClose={handleCloseDialog}
              onSubmit={handeleUpdate}
              defaultData={data}
            ></EditReviewDialog>
          </>
        )}
      </div>
      <div className="mt-1">{data.comment}</div>
    </div>
  );
};

export default ReviewItem;
