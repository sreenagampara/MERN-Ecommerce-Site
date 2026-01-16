import type { Product } from "./ProductSection";
import { useNavigate } from "react-router-dom";
import {LazyLoadImage} from "react-lazy-load-image-component"
import 'react-lazy-load-image-component/src/effects/blur.css';

interface ProductCardProps {
  product: Product;
}
export default function ProductCard({ product }: ProductCardProps) {
  const navigate =useNavigate();

  const handleNavigate =()=>{
    navigate('/order-page',{
    state:{
        image: product.imageUrl,
        productName: product.productName,
        price: product.price,
        id:product._id
    }});
  }

  return (
    <div onClick={handleNavigate} className="p-6 border border-gray-300 rounded-lg shadow-sm hover:shadow-2xl hover:bg-gray-300 transition-shadow cursor-pointer ">
      <LazyLoadImage
          alt={product.productName}
          src={product.imageUrl}
          effect="blur" // This enables the blur-up transition
          threshold={300}
          className="w-48 h-48 object-contain mx-auto mb-3 rounded-lg hover:object-cover"
        />
      <h3 className="text-lg font-semibold text-gray-800 mb-1">
        {product.productName}
      </h3>
      <p className="text-xl font-bold text-green-600">₹{product.price}</p>
    </div>
  );
}
