function ProductCard({ product, onAddToCart }) {
  const discount = Math.round(
    ((product.oldPrice - product.price) / product.oldPrice) * 100
  );

  return (
    <article className="product-card">
      <div className="product-image">
        <span className="product-badge">{product.badge}</span>

        <button className="wishlist" aria-label="Add to wishlist">
          ♡
        </button>

        <img
          src={product.image}
          alt={product.name}
          className="product-real-image"
        />

        <button
          className="quick-add"
          onClick={() => onAddToCart(product)}
        >
          Add to Cart
        </button>
      </div>

      <div className="product-info">
        <p className="product-category">{product.category}</p>

        <h3>{product.name}</h3>

        <div className="product-rating">
          <span>★</span> {product.rating}
        </div>

        <div className="product-price">
          <strong>
            ₹{product.price.toLocaleString("en-IN")}
          </strong>

          <del>
            ₹{product.oldPrice.toLocaleString("en-IN")}
          </del>

          <span>{discount}% OFF</span>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;