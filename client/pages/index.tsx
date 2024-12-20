import { Layout } from "@/components/Layout";
import ProductCard from "@/components/ProductCart";
import SwiperComponent from "@/components/Swiper";
import { getTopFiveProductSell } from "@/redux/api";
import { useAppSelector } from "@/redux/hooks";
import { getCategories } from "@/redux/slice/categorySlice";
import { wrapper } from "@/redux/store";
import { ProductType } from "@/utils/Type";
import { Container, Divider } from "@mui/material";
import Grid from "@mui/material/Grid2";

export default function Home({ top4Product }: { top4Product: ProductType[] }) {
  if (top4Product) {
    console.log("top4Product: ", top4Product);
  }
  const { categories, loading, error } = useAppSelector(
    (state) => state.category
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  console.log("categories trong index.tsx: ", categories);
  return (
    <Layout>
      <SwiperComponent></SwiperComponent>
      <Container>
        <div className="mt-8">
          <Divider className="mt-1" />
        </div>
        <h1 className="flex justify-center text-2xl  mt-4">
          Sản phẩm bán chạy
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          {top4Product.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </Container>

      <Container>
        <div className="mt-8">
          <Divider className="mt-1" />
        </div>
        <h1 className="flex justify-center text-2xl  mt-4">Đánh giá nổi bật</h1>
      </Container>
      <div className="font-bold">hello</div>
    </Layout>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    let top4Product;
    try {
      const response = await getTopFiveProductSell();
      top4Product = response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Lỗi khi gọi API top-five-product-sell: ", error.message);
      } else {
        console.error("Lỗi khi gọi API top-five-product-sell: ", error);
      }
    }
    await store.dispatch(getCategories());
    return {
      props: { top4Product }, // Redux state sẽ tự động được truyền qua props
    };
  }
);
