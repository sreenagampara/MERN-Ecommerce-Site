import { useContext, useEffect, useState } from "react";
import axios from "axios";
import AdsCard from "./AdsCard";
import { AppContext } from "../context/AppContextInstance";



interface Ads {
  imageUrl: string;
  section: string;
  division: string;
}

interface AdsSectionProps {
  sectionNumber: string;
}

export default function AdsSection({ sectionNumber }: AdsSectionProps) {
  const appContext = useContext(AppContext)
  const [ad, setAd] = useState<Ads[]>([]);
  const BackendUrl = appContext?.BackendUrl;


  useEffect(() => {
    if (!BackendUrl) return;
    async function fetchAdsCard() {
      try {
        const res = await axios.get(BackendUrl + "/api/ads");

        // Axios automatically parses JSON → res.data
        const filtered = res.data.filter(
          (item: Ads) => item.section === sectionNumber
        );

        setAd(filtered);
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    }

    fetchAdsCard();
  }, [BackendUrl, sectionNumber]);

  if (!appContext) {
    return null;
  }

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white px-5 sm:px-1 md:px-3 lg:px-5 py-4">
      {ad.map((item, index) => (
        <AdsCard key={index} ads={item} />
      ))}
    </div>
  );
}
