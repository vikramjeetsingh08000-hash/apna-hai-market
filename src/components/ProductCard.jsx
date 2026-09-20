function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onViewProduct,
}) {
  const discount = Math.round(
    ((product.oldPrice - product.price) / product.oldPrice) * 100
  );

  return (
    <article className="product-card">

      <div
        className="product-image"
        onClick={() => onViewProduct(product)}
        role="button"
        tabIndex="0"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            onViewProduct(product);
          }
        }}
      >

        <span className="product-badge">
          {product.badge}
        </span>

        <button
          className={`wishlist ${
            isWishlisted ? "wishlist-active" : ""
          }`}
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          onClick={(event) => {
            event.stopPropagation();
            onToggleWishlist(product);
          }}
        >
          {isWishlisted ? "♥" : "♡"}
        </button>

        <img
          src={product.image}
          alt={product.name}
          className="product-real-image"
        />

        <button
          className="quick-add"
          onClick={(event) => {
            event.stopPropagation();
            onAddToCart(product);
          }}
        >
          Add to Cart
        </button>

      </div>

      <div
        className="product-info"
        onClick={() => onViewProduct(product)}
        role="button"
        tabIndex="0"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            onViewProduct(product);
          }
        }}
      >

        <p className="product-category">
          {product.category}
        </p>

        <h3>
          {product.name}
        </h3>

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

          <span>
            {discount}% OFF
          </span>

        </div>

      </div>

    </article>
  );
}

export default ProductCard;