import { useNavigate } from "react-router-dom";

interface AdsCardProps {
  ads: {
    imageUrl: string;
    division: string;
  };
}

export default function AdsCard({ ads }: AdsCardProps) {
  const navigate = useNavigate();
  return (
    <div>
      <img
        src={ads.imageUrl}
        alt="Ad banner"
        className="w-full h-auto rounded cursor-pointer"
        onClick={() => {
          navigate("/offer-page", {
            state: {
              sectionName: ads.division,
            },
          });
        }}
      />
    </div>
  );
}
