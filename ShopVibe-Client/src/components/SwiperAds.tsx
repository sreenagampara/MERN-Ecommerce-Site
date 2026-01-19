import { useContext, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import type { Swiper as SwiperType } from "swiper/types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContextInstance";

interface Ads {
  adsName: string,
  _id: string,
  imageUrl: string;
  section: string;
  division: string;
}
export default function AdBlock() {
  const progressRef = useRef<HTMLDivElement | null>(null);
  const [ads, setAds] = useState<Ads[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const appContext = useContext(AppContext)
  const BackendUrl = appContext?.BackendUrl


  useEffect(() => {
    async function fetchAds() {
      try {
        const res = await axios(BackendUrl + "/api/ads");

        setAds(res.data);
      } catch (error) {
        console.error("Error fetching ads", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAds();
  }, [BackendUrl]);

  const sectionOneAds = ads.filter((ad) => ad.section === "1");
  const enableLoop = sectionOneAds.length > 1;


  if (!appContext) {
    return null;
  }

  return (
    <div className="w-full bg-white">
      {/* Swiper Carousel */}
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={enableLoop}
        onAutoplayTimeLeft={(_swiper: SwiperType, _time: number, progress: number) => {
          if (progressRef.current) {
            progressRef.current.style.width = `${(1 - progress) * 100}%`;
          }
        }}
        className="rounded-lg shadow-md"
      >
        {loading || sectionOneAds.length === 0 ? (
          <SwiperSlide>
            <div className="flex items-center justify-center w-full sm:h-70 md:h-80 lg:h-90 bg-gray-100 rounded-lg">
              <p className="text-gray-500">Loading ads...</p>
            </div>
          </SwiperSlide>
        ) : (
          sectionOneAds.map((ad) => (
            <SwiperSlide key={ad._id}>
              <img
                src={ad.imageUrl}
                alt={ad.adsName}
                className="w-full sm:h-70 md:h-80 lg:h-90 object-cover rounded-lg"
                onClick={() => {
                  navigate("/offer-page", {
                    state: {
                      sectionName: ad.division
                    }
                  })
                }}
              />
            </SwiperSlide>
          ))
        )}
      </Swiper>

      {/* Progress Bar Below the Ads */}
      <div className="mt-4 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          ref={progressRef}
          className="h-full bg-gray-700 rounded-full transition-all duration-300"
          style={{ width: "0%" }} // Starts at 0%, fills to 100% as autoplay progresses
        />
      </div>
    </div>
  );
}