import AdBlock from "../components/SwiperAds";
import Category from "../components/Category";
import ProductSection from "../components/ProductSection";
import AdsSection from "../components/AdsSection";


function Home() {
 
  return (
    <div>
      <div className="m-3 sm:m-1 md:m-2 lg:m-3">
        <Category></Category>
      </div>
      <div className="m-3 sm:m-1 md:m-2 lg:m-3 cursor-pointer">
        <AdBlock></AdBlock>
      </div>
      <div className="m-3 sm:m-1 md:m-2 lg:m-3">
        <ProductSection
          section="subCategory" 
          sectionName="Best Deal on smartphone"
          columns={3}
        />
      </div>
      <div  className="m-3 sm:m-1 md:m-2 lg:m-3">
        <AdsSection sectionNumber="2"></AdsSection>
      </div>
      <div className="m-3 sm:m-1 md:m-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProductSection
            section="subCategory"
            sectionName="Fashion Top Deals"
            columns={2}
          />
          <ProductSection
            section="subCategory"
            sectionName="Winter Essentials For You"
            columns={2}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
