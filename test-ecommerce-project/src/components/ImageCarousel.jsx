import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { useMediaQuery } from "react-responsive";
import { useState } from "react";
const ImageCarousel = ({ gallery }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const isMobile = useMediaQuery({ maxWidth: 768 });
    return (
        <>
            <Swiper
                onSwiper={setThumbsSwiper}
                loop={true}
                direction={isMobile ? "horizontal" : "vertical"}
                spaceBetween={10}
                slidesPerView={8}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="w-full max-h-[600px] md:w-[10%] order-1 md:order-0"
            >
                {gallery.map((image, index) => (
                    <SwiperSlide key={index} className="cursor-pointer">
                        <img src={image} className="w-full h-full object-contain" />
                    </SwiperSlide>
                ))}
            </Swiper>
            <Swiper
                style={{ "--swiper-navigation-color": "#fff" }}
                loop={true}
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
                className="w-full max-h-[600px] md:w-[90%] order-0 md:order-1"
            >
                {gallery.map((image, index) => (
                    <SwiperSlide key={index}>
                        <img src={image} className="w-full h-full object-contain" />
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
};

export default ImageCarousel;
