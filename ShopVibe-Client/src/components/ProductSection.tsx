import { useContext, useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "axios"
import { AppContext } from "../context/AppContextInstance";

export interface Product {
  imageUrl: string;
  productName: string;
  price: number;
  subCategory: string;
  category: string;
  division: string;
  _id:number;
}

interface ProductSectionProps {
  sectionName: string;
  columns?: number;
  section: keyof Product;
}


export default function ProductSection({
  section,
  sectionName,
  columns = 3,
}: ProductSectionProps) {
  const [product, setProduct] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const appContext = useContext(AppContext)
  const BackendUr = appContext?.BackendUrl;

  const columnClasses: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    7: "grid-cols-7",
  };
  // ✅ Build tailwind classes in JS (not inside template literal)
  const mdCols = `md:${columnClasses[columns]}`;
  const lgCols = `lg:${columnClasses[columns]}`;

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await axios.get(BackendUr+"/api/products");
        

        
        const filtered = res.data.filter(
          (item: Product) => item[section] === sectionName
        );

        setProduct(filtered);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {setLoading(false)}
      
    }

    fetchProduct();
  }, [section, sectionName]);
  if(!appContext){
    return null;
  }

  return (
    <div className="bg-white px-5 sm:px-1 md:px-3 lg:px-5 py-4">
      <h2 className="text-xl font-semibold mb-3 sm:p-1 md:p-2 lg:p-3 capitalize">
        {sectionName}
      </h2>

      {loading ? (<h3 className="text-center py-5 text-gray-500 font-semibold sm:text-2 lg:text-3xl sm:h-50 lg:h-500">Loading products...</h3>) 
      :( <div className={`grid gap-4 grid-cols-2 sm:grid-cols-2 ${mdCols} ${lgCols}`}>
        {product.map((item, index) => (
          <ProductCard key={index} product={item} />
        ))}
      </div>
      )}
    </div>
  );
}
