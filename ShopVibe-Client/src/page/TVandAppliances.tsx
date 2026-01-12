import ProductSection from "../components/ProductSection";
import Category from "../components/Category";

export default function TVandAppliances() {
  return (
    <div>
      <div className="m-3 sm:m-1 md:m-2 lg:m-3">
        <Category></Category>
      </div>
      <div className="m-3 sm:m-1 md:m-2 lg:m-3">
        <ProductSection
          section="division"
          sectionName="TV and Appliances"
          columns={6}
        ></ProductSection>
      </div>
    </div>
  );
}
