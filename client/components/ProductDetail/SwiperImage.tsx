import { ProductType } from "@/utils/Type";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { useState } from "react";
const API_URL = process.env.SV_HOST || "http://localhost:5000";
const SwiperImage = ({ product }: { product: ProductType }) => {
  console.log("product trong swiper", product);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const linkImage = product.product_Images.map((image) => `${API_URL}${image}`);

  // Use the product images if available, otherwise use placeholder images
  const images =
    product.product_Images && product.product_Images.length > 0
      ? linkImage
      : [
          "https://swiperjs.com/demos/images/nature-1.jpg",
          "https://swiperjs.com/demos/images/nature-2.jpg",
          "https://swiperjs.com/demos/images/nature-3.jpg",
          "https://swiperjs.com/demos/images/nature-4.jpg",
          "https://swiperjs.com/demos/images/nature-5.jpg",
        ];

  return (
    <div className="w-full max-w-xl mx-auto">
      <Swiper
        loop={true}
        spaceBetween={10}
        navigation={true}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="w-full h-[400px] rounded-lg overflow-hidden mb-4"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="flex items-center justify-center">
            <img
              src={image}
              alt={`Product image ${index + 1}`}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        onSwiper={setThumbsSwiper}
        loop={true}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="w-full"
      >
        {images.map((image, index) => (
          <SwiperSlide
            key={index}
            className="!w-[calc(25%-0.75rem)] opacity-60 hover:opacity-100 cursor-pointer transition-opacity duration-300 
                        data-[swiper-slide-thumb-active]:opacity-100 border-2 border-transparent hover:border-red-500"
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-20 object-contain rounded-md"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperImage;
