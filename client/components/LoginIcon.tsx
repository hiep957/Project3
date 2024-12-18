import Link from "next/link";

export const LoginIcon = () => {
  return (
    <Link href="/login" passHref>
      <div className="flex flex-row space-x-4">
        <button className=" border px-4 py-2 rounded-md">Đăng nhập</button>
      </div>
    </Link>
  );
};
