export default function ProductCard({ product, onClick }) {
  return (
    <div 
      className="product-card" 
      onClick={() => onClick(product._id)}
      style={{border:"1px solid #ddd", padding:"10px", borderRadius:"8px", cursor:"pointer"}}
    >
      <img src={product.image} alt={product.name} width="100%" height="200px" />
      <h4>{product.name}</h4>
      <p>₹{product.price}</p>
    </div>
  );
}
