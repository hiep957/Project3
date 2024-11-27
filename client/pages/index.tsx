import Image from "next/image";
import localFont from "next/font/local";
import { Layout } from "@/components/Layout";
import SwiperComponent from "@/components/Swiper";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getCategories } from "@/redux/slice/categorySlice";
import { wrapper } from "@/redux/store";

export default function Home() {
  const { categories, loading, error } = useAppSelector(
    (state) => state.category
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  console.log("categories trong index.tsx: ", categories);
  return (
    <Layout>
      <SwiperComponent></SwiperComponent>
      <div>dsdas</div>
      <div className="font-bold">hello</div>
    </Layout>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    await store.dispatch(getCategories());

    return {
      props: {}, // Redux state sẽ tự động được truyền qua props
    };
  }
);
