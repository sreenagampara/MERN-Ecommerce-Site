import ProductSection from "../components/ProductSection";
import Category from "../components/Category";
import { useLocation } from "react-router-dom";

export default function OfferPage() {
    const location=useLocation();
    const {sectionName}=location.state || {}
  return (
    <div>
      <div className="m-3 sm:m-1 md:m-2 lg:m-3">
        <Category></Category>
      </div>
      <div className="m-3 sm:m-1 md:m-2 lg:m-3">
        <ProductSection section="subCategory" sectionName={sectionName} columns={6} />
      </div>
    </div>
  );
}
