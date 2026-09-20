import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { products } from "./data/products";
import ProductCard from "./components/ProductCard";

const heroSlides = [
  {
    id: 1,
    eyebrow: "NEW SEASON · APNA HAI",
    title: "Style that feels",
    highlight: "Apna.",
    description:
      "Discover fresh fashion, everyday essentials and more — all in one place.",
    button: "Shop Fashion",
    category: "Fashion",
    className: "hero-slide-fashion",
  },
  {
    id: 2,
    eyebrow: "HOME · LIFESTYLE",
    title: "Make your space",
    highlight: "beautiful.",
    description:
      "Bring colour, comfort and personality into your everyday spaces.",
    button: "Explore Home",
    category: "Home",
    className: "hero-slide-home",
  },
  {
    id: 3,
    eyebrow: "THE INDIAN EDIT",
    title: "Modern living,",
    highlight: "Indian soul.",
    description:
      "A colourful collection inspired by India's timeless style and culture.",
    button: "Explore Indian Edit",
    category: "Indian",
    className: "hero-slide-indian",
  },
  {
    id: 4,
    eyebrow: "EVERYDAY ESSENTIALS",
    title: "Little things.",
    highlight: "Big difference.",
    description:
      "Useful, stylish and thoughtfully selected products for everyday life.",
    button: "Shop Everything",
    category: "All",
    className: "hero-slide-lifestyle",
  },
];

const categories = [
  {
    name: "Fashion",
    icon: "👕",
    description: "Everyday style",
  },
  {
    name: "Home",
    icon: "🏠",
    description: "Beautiful spaces",
  },
  {
    name: "Accessories",
    icon: "⌚",
    description: "Complete your look",
  },
  {
    name: "Indian",
    icon: "🇮🇳",
    description: "Indian soul",
  },
];

function App() {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("apnaCart")) || [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("apnaWishlist")) || [];
    } catch {
      return [];
    }
  });

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [placedOrderTotal, setPlacedOrderTotal] = useState(null);

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    localStorage.setItem("apnaCart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("apnaWishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Hero auto slider
  useEffect(() => {
    const sliderTimer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 4500);

    return () => clearInterval(sliderTimer);
  }, []);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Category + search filtering
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" ||
        product.category.toLowerCase() === selectedCategory.toLowerCase();

      const searchText = searchQuery.trim().toLowerCase();

      const matchesSearch =
        searchText === "" ||
        product.name.toLowerCase().includes(searchText) ||
        product.category.toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    // Product section par smoothly le jao
    setTimeout(() => {
      document
        .getElementById("products")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setSelectedCategory("All");
  };

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (productId, change) => {
    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (item.id !== productId) return item;

          return {
            ...item,
            quantity: item.quantity + change,
          };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    );
  };

  const toggleWishlist = (product) => {
    setWishlist((currentWishlist) => {
      const exists = currentWishlist.some((item) => item.id === product.id);

      if (exists) {
        return currentWishlist.filter((item) => item.id !== product.id);
      }

      return [...currentWishlist, product];
    });
  };

  const isWishlisted = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const nextSlide = () => {
    setActiveSlide((current) => (current + 1) % heroSlides.length);
  };

  const previousSlide = () => {
    setActiveSlide(
      (current) => (current - 1 + heroSlides.length) % heroSlides.length
    );
  };

  const handleHeroButton = (category) => {
    handleCategoryChange(category);
  };

  const openProduct = (product) => {
    setSelectedProduct(product);
  };

  const closeProduct = () => {
    setSelectedProduct(null);
  };

  const startCheckout = () => {
    if (cart.length === 0) return;

    setCheckoutOpen(true);
    setIsCartOpen(false);
  };

  const placeOrder = (event) => {
    event.preventDefault();

    setPlacedOrderTotal(cartTotal);
    setCart([]);
    setCheckoutOpen(false);
  };

  const closeCheckout = () => {
    setCheckoutOpen(false);
  };

  const clearFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");

    setTimeout(() => {
      document
        .getElementById("products")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <div className="app">
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <span>✦ FREE SHIPPING ON ORDERS ABOVE ₹999</span>
        <span>✦ MADE FOR INDIA</span>
        <span>✦ APNA HAI · APNA MARKET</span>
      </div>

      {/* Navbar */}
      <header className="navbar">
        <div
          className="brand"
          onClick={() => {
            setSelectedCategory("All");
            setSearchQuery("");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <div className="brand-mark">A</div>

          <div className="brand-text">
            <strong>Apna Hai</strong>
            <span>MARKET</span>
          </div>
        </div>

        <nav className="nav-links">
          <button onClick={() => handleCategoryChange("All")}>
            Home
          </button>

          <button onClick={() => handleCategoryChange("Fashion")}>
            Fashion
          </button>

          <button onClick={() => handleCategoryChange("Home")}>
            Home & Living
          </button>

          <button onClick={() => handleCategoryChange("Accessories")}>
            Accessories
          </button>

          <button onClick={() => handleCategoryChange("Indian")}>
            Indian Edit
          </button>
        </nav>

        <div className="nav-actions">
          <div className="search-box">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <button
            className="nav-icon-button"
            onClick={() => setIsWishlistOpen(true)}
            aria-label="Open wishlist"
          >
            ♡
            {wishlist.length > 0 && (
              <span className="nav-count">{wishlist.length}</span>
            )}
          </button>

          <button
            className="nav-icon-button"
            onClick={() => setIsCartOpen(true)}
            aria-label="Open cart"
          >
            🛒
            {cartCount > 0 && (
              <span className="nav-count">{cartCount}</span>
            )}
          </button>
        </div>
      </header>

      {/* Hero Slider */}
      <section className="hero-slider">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide ${slide.className} ${
              index === activeSlide ? "hero-slide-active" : ""
            }`}
          >
            <div className="hero-colour-shape hero-shape-one"></div>
            <div className="hero-colour-shape hero-shape-two"></div>
            <div className="hero-colour-shape hero-shape-three"></div>

            <div className="hero-content">
              <p className="hero-eyebrow">{slide.eyebrow}</p>

              <h1>
                {slide.title}
                <br />
                <span>{slide.highlight}</span>
              </h1>

              <p className="hero-description">{slide.description}</p>

              <button
                className="hero-button"
                onClick={() => handleHeroButton(slide.category)}
              >
                {slide.button}
                <span>→</span>
              </button>
            </div>

            <div className="hero-visual">
              <div className="hero-visual-card">
                {slide.category === "Fashion" && (
                  <>
                    <span className="hero-card-icon">👕</span>
                    <strong>FASHION</strong>
                    <small>Everyday luxury</small>
                  </>
                )}

                {slide.category === "Home" && (
                  <>
                    <span className="hero-card-icon">🏠</span>
                    <strong>HOME</strong>
                    <small>Beautiful living</small>
                  </>
                )}

                {slide.category === "Indian" && (
                  <>
                    <span className="hero-card-icon">🇮🇳</span>
                    <strong>INDIAN EDIT</strong>
                    <small>Modern Indian soul</small>
                  </>
                )}

                {slide.category === "All" && (
                  <>
                    <span className="hero-card-icon">✦</span>
                    <strong>APNA HAI</strong>
                    <small>Everything in one place</small>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        <button
          className="hero-arrow hero-arrow-left"
          onClick={previousSlide}
          aria-label="Previous slide"
        >
          ←
        </button>

        <button
          className="hero-arrow hero-arrow-right"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          →
        </button>

        <div className="hero-dots">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.id}
              className={`hero-dot ${
                index === activeSlide ? "hero-dot-active" : ""
              }`}
              onClick={() => setActiveSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>

        <div className="hero-auto-label">
          <span className="hero-pulse-dot"></span>
          AUTO
        </div>
      </section>

      {/* Category Section */}
      <section className="section category-section" id="categories">
        <div className="section-heading">
          <div>
            <p className="section-eyebrow">SHOP BY CATEGORY</p>
            <h2>Find your kind of <span>Apna.</span></h2>
          </div>

          <button
            className="text-button"
            onClick={() => handleCategoryChange("All")}
          >
            View All Products →
          </button>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <button
              key={category.name}
              className={`category-card ${
                selectedCategory === category.name
                  ? "category-card-active"
                  : ""
              }`}
              onClick={() => handleCategoryChange(category.name)}
            >
              <span className="category-icon">{category.icon}</span>

              <div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>

              <span className="category-arrow">↗</span>
            </button>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="section products-section" id="products">
        <div className="section-heading">
          <div>
            <p className="section-eyebrow">
              {selectedCategory === "All"
                ? "CURATED FOR YOU"
                : `${selectedCategory.toUpperCase()} COLLECTION`}
            </p>

            <h2>
              {selectedCategory === "All"
                ? "Trending products."
                : `${selectedCategory}.`}
            </h2>
          </div>

          <div className="product-filter-status">
            <span>
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </span>

            {selectedCategory !== "All" && (
              <button onClick={clearFilters}>Clear ×</button>
            )}
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
                isWishlisted={isWishlisted(product.id)}
                onViewProduct={openProduct}
              />
            ))}
          </div>
        ) : (
          <div className="empty-products">
            <div>⌕</div>
            <h3>No products found</h3>
            <p>
              Try another search or explore our complete collection.
            </p>

            <button onClick={clearFilters}>
              View All Products
            </button>
          </div>
        )}
      </section>

      {/* Why Apna Hai */}
      <section className="why-section">
        <div className="why-inner">
          <div>
            <p className="section-eyebrow">WHY APNA HAI?</p>

            <h2>
              Everything you need.
              <br />
              <span>One place.</span>
            </h2>

            <p className="why-description">
              A modern Indian marketplace bringing together style,
              lifestyle and everyday essentials with a premium shopping
              experience.
            </p>
          </div>

          <div className="why-features">
            <div className="why-feature">
              <span>✦</span>
              <div>
                <strong>Curated Products</strong>
                <p>Thoughtfully selected for you.</p>
              </div>
            </div>

            <div className="why-feature">
              <span>◇</span>
              <div>
                <strong>Made for India</strong>
                <p>Inspired by Indian lifestyles.</p>
              </div>
            </div>

            <div className="why-feature">
              <span>↗</span>
              <div>
                <strong>Simple Shopping</strong>
                <p>Discover, choose and enjoy.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-brand">
          <div className="brand">
            <div className="brand-mark">A</div>

            <div className="brand-text">
              <strong>Apna Hai</strong>
              <span>MARKET</span>
            </div>
          </div>

          <p>
            Everything you need. One place.
            <br />
            Apna Hai.
          </p>
        </div>

        <div className="footer-links">
          <div>
            <h4>Shop</h4>
            <button onClick={() => handleCategoryChange("Fashion")}>
              Fashion
            </button>
            <button onClick={() => handleCategoryChange("Home")}>
              Home
            </button>
            <button onClick={() => handleCategoryChange("Accessories")}>
              Accessories
            </button>
            <button onClick={() => handleCategoryChange("Indian")}>
              Indian Edit
            </button>
          </div>

          <div>
            <h4>Help</h4>
            <button>Contact</button>
            <button>Shipping</button>
            <button>Returns</button>
            <button>FAQ</button>
          </div>

          <div>
            <h4>Follow</h4>
            <button>Instagram</button>
            <button>Facebook</button>
            <button>YouTube</button>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Apna Hai Market</span>
          <span>Made with ♥ in India</span>
        </div>
      </footer>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div
          className="drawer-overlay"
          onClick={() => setIsCartOpen(false)}
        >
          <aside
            className="drawer"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="drawer-header">
              <div>
                <p className="section-eyebrow">YOUR BAG</p>
                <h2>Shopping Cart</h2>
              </div>

              <button
                className="drawer-close"
                onClick={() => setIsCartOpen(false)}
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="drawer-empty">
                <span>🛒</span>
                <h3>Your cart is empty</h3>
                <p>Add something you love.</p>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    handleCategoryChange("All");
                  }}
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="drawer-products">
                  {cart.map((item) => (
                    <div className="drawer-product" key={item.id}>
                      <img src={item.image} alt={item.name} />

                      <div className="drawer-product-info">
                        <h4>{item.name}</h4>

                        <strong>
                          ₹{item.price.toLocaleString("en-IN")}
                        </strong>

                        <div className="quantity-controls">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            −
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        className="remove-item"
                        onClick={() => removeFromCart(item.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div className="drawer-footer">
                  <div className="drawer-total">
                    <span>Total</span>
                    <strong>
                      ₹{cartTotal.toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <button
                    className="checkout-button"
                    onClick={startCheckout}
                  >
                    Proceed to Checkout →
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {/* Wishlist Drawer */}
      {isWishlistOpen && (
        <div
          className="drawer-overlay"
          onClick={() => setIsWishlistOpen(false)}
        >
          <aside
            className="drawer"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="drawer-header">
              <div>
                <p className="section-eyebrow">SAVED FOR YOU</p>
                <h2>Wishlist</h2>
              </div>

              <button
                className="drawer-close"
                onClick={() => setIsWishlistOpen(false)}
              >
                ×
              </button>
            </div>

            {wishlist.length === 0 ? (
              <div className="drawer-empty">
                <span>♡</span>
                <h3>Your wishlist is empty</h3>
                <p>Save products you love for later.</p>
              </div>
            ) : (
              <div className="drawer-products">
                {wishlist.map((item) => (
                  <div className="drawer-product" key={item.id}>
                    <img src={item.image} alt={item.name} />

                    <div className="drawer-product-info">
                      <h4>{item.name}</h4>

                      <strong>
                        ₹{item.price.toLocaleString("en-IN")}
                      </strong>

                      <button
                        className="wishlist-add-cart"
                        onClick={() => addToCart(item)}
                      >
                        Add to Cart
                      </button>
                    </div>

                    <button
                      className="remove-item"
                      onClick={() => toggleWishlist(item)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      )}

      {/* Product Detail */}
      {selectedProduct && (
        <div
          className="product-modal-overlay"
          onClick={closeProduct}
        >
          <div
            className="product-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="product-modal-close"
              onClick={closeProduct}
            >
              ×
            </button>

            <div className="product-detail-grid">
              <div className="product-detail-image">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                />

                <span className="product-badge">
                  {selectedProduct.badge}
                </span>
              </div>

              <div className="product-detail-info">
                <p className="product-category">
                  {selectedProduct.category}
                </p>

                <h2>{selectedProduct.name}</h2>

                <div className="product-rating">
                  <span>★</span> {selectedProduct.rating}
                </div>

                <div className="product-detail-price">
                  <strong>
                    ₹{selectedProduct.price.toLocaleString("en-IN")}
                  </strong>

                  <del>
                    ₹{selectedProduct.oldPrice.toLocaleString("en-IN")}
                  </del>

                  <span>
                    {Math.round(
                      ((selectedProduct.oldPrice -
                        selectedProduct.price) /
                        selectedProduct.oldPrice) *
                        100
                    )}
                    % OFF
                  </span>
                </div>

                <p className="product-detail-description">
                  A thoughtfully selected product from the Apna Hai
                  collection. Designed to bring style, comfort and
                  everyday value to your life.
                </p>

                <div className="product-detail-actions">
                  <button
                    className="checkout-button"
                    onClick={() => addToCart(selectedProduct)}
                  >
                    Add to Cart →
                  </button>

                  <button
                    className={`detail-wishlist ${
                      isWishlisted(selectedProduct.id)
                        ? "wishlist-active"
                        : ""
                    }`}
                    onClick={() => toggleWishlist(selectedProduct)}
                  >
                    {isWishlisted(selectedProduct.id)
                      ? "♥ Saved"
                      : "♡ Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout */}
      {checkoutOpen && (
        <div className="product-modal-overlay">
          <div className="checkout-modal">
            <button
              className="product-modal-close"
              onClick={closeCheckout}
            >
              ×
            </button>

            <div className="checkout-header">
              <p className="section-eyebrow">APNA HAI CHECKOUT</p>
              <h2>Complete your order.</h2>
              <p>Enter your details to place your demo order.</p>
            </div>

            <form onSubmit={placeOrder} className="checkout-form">
              <label>
                Full Name
                <input
                  type="text"
                  placeholder="Your name"
                  required
                />
              </label>

              <label>
                Phone Number
                <input
                  type="tel"
                  placeholder="Your phone number"
                  required
                />
              </label>

              <label>
                Delivery Address
                <textarea
                  placeholder="House / Street / City / State"
                  rows="4"
                  required
                ></textarea>
              </label>

              <div className="checkout-summary">
                <span>Order Total</span>
                <strong>
                  ₹{cartTotal.toLocaleString("en-IN")}
                </strong>
              </div>

              <button className="checkout-button" type="submit">
                Place Demo Order →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Order Success */}
      {placedOrderTotal !== null && (
        <div
          className="success-modal-overlay"
          onClick={() => setPlacedOrderTotal(null)}
        >
          <div
            className="success-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="success-icon">✓</div>

            <p className="section-eyebrow">ORDER RECEIVED</p>

            <h2>Thank you for shopping!</h2>

            <p>
              Your demo order worth{" "}
              <strong>
                ₹{placedOrderTotal.toLocaleString("en-IN")}
              </strong>{" "}
              has been placed.
            </p>

            <button
              className="checkout-button"
              onClick={() => setPlacedOrderTotal(null)}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;