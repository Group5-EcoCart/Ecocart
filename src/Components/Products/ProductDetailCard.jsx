export default function ProductDetailCard({ product }) {
  if (!product) return <p>Loading...</p>;

  return (
    <div style={{padding:"20px"}}>
      <img src={product.image} alt={product.name} width="400px" />
      <h2>{product.name}</h2>
      <p>₹{product.price}</p>
      <p>{product.description}</p>
      <button 
        style={{padding:"10px 20px", background:"green", color:"#fff", border:"none", borderRadius:"5px"}}
      >
        Add to Cart
      </button>
    </div>
  );
}
