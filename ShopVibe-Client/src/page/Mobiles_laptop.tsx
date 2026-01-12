import ProductSection from "../components/ProductSection";
import Category from "../components/Category";

export default function Mobiles() {
  return (
    <div>
      <div className="m-3 sm:m-1 md:m-2 lg:m-3">
        <Category></Category>
      </div>
      <div className="m-3 sm:m-1 md:m-2 lg:m-3">
        <ProductSection section="division" sectionName="gadgets" columns={6} />
      </div>
    </div>
  );
}
