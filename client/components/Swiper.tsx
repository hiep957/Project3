import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { Navigation, Pagination } from "swiper/modules";

const SwiperComponent = () => {
    return(
        <div className="w-full h-auto">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          className="w-full h-[650px]"
        >
          <SwiperSlide>
            <Image
              src="/banner-PC-3.png"
              alt="Slide 1"
              fill
              objectFit="cover"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src="/03.-BANNER-PC.png"
              alt="Slide 2"
              fill
              objectFit="cover"
            />
          </SwiperSlide>
          
        </Swiper>
      </div>
    )
}

export default SwiperComponent;