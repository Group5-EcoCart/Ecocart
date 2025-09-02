import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import { useNavigate } from "react-router-dom";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div 
      className="grid" 
      style={{display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:"20px"}}
    >
      {products.map(product => (
        <ProductCard key={product._id} product={product} onClick={handleCardClick} />
      ))}
    </div>
  );
}
