import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import { filterProducts } from "../utils/filterProducts";
import { CartProvider, useCart } from "../context/CartContext";
import "../CSS/home.css"; 


function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4; // Number of products per page

  // filter state
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");

  //const filters = { selectedCategory, minPrice, maxPrice };
  const filters = { selectedCategory, selectedBrand, minPrice, maxPrice };
  const filteredProducts = filterProducts(products, filters);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const { cartItems } = useCart();
  const navigate = useNavigate();

  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  const triggerCheckout = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    //handleCheckout(); 
    navigate("/checkout"); 
  };
  
  const BASE_URL = "http://localhost:5001";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `${BASE_URL}/products`;
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        
        const data = await res.json();
        // data.map((product, index) => {
        //   console.log(`Product ${index + 1} brand:`, product.brand);
        // });
        console.log("Products:", data);
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);

  // useEffect(() => {
  //   fetch("https://fakestoreapi.com/products")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setProducts(data);
  //       setLoading(false);
  //     });
  // }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset pagination when filters change
  }, [selectedCategory, selectedBrand, minPrice, maxPrice]);

  return (
    <div className="container">
      <h1 className="heading">Holiday Specials</h1>

      <div className="cart-bar">
        <p>
          <strong>Cart:</strong>{" "}
          {cartItems.reduce((acc, item) => acc + item.quantity, 0)} item(s)
        </p>

        {cartItems.length > 0 && (
          <div className="checkout-controls">
            <button className="checkout-btn" onClick={triggerCheckout}>
              Checkout (${totalPrice})
            </button>
          </div>
        )}
      </div>

      {/* Filter UI */}
      <div className="filters">
        <label>
          Category:
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="all">All</option>
            <option value="Shoes">Shoes</option>
            <option value="Electronics">Electronics</option>
            <option value="Wearables">Wearables</option>
          </select>
        </label>

        <label>
          Brand:
          <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
            <option value="all">All</option>
            <option value="Nike">Nike</option>
            <option value="Adidas">Adidas</option>
            <option value="Apple">Apple</option>
            <option value="Sony">Sony</option>
            <option value="Fitbit">Fitbit</option>
            <option value="Garmin">Garmin</option>
            <option value="JBL">JBL</option>
            <option value="Razer">Razer</option>
            <option value="Dell">Dell</option>
            <option value="ASUS">ASUS</option>
            <option value="HP">HP</option>
            <option value="Crocs">Crocs</option>
            <option value="New Balance">New Balance</option>
            <option value="Reebok">Reebok</option>
            <option value="Logitech">Logitech</option>
            <option value="Beats">Beats</option>
            <option value="Vans">Vans</option>
            <option value="Samsung">Samsung</option>
            <option value="Google">Google</option>
            <option value="Under Armour">Under Armour</option>
            <option value="Timberland">Timberland</option>
            <option value="Bose">Bose</option>
            <option value="Polar">Polar</option>
            <option value="Microsoft">Microsoft</option>
            <option value="Canon">Canon</option>
            <option value="On">On</option>
            <option value="Lenovo">Lenovo</option>
            <option value="Anker">Anker</option>
          </select>
        </label>


        <label>
          Min Price:
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="e.g. 10"
          />
        </label>

        <label>
          Max Price:
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="e.g. 100"
          />
        </label>
      </div>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <>
        <div className="grid">
          {currentProducts.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
            />
          ))}
        </div>

        {filteredProducts.length > productsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Confirm Checkout</h2>
            <p>
              You're checking out{" "}
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)} item(s)
            </p>
            <p>Total: ${totalPrice}</p>
            <button className="modal-btn" onClick={closeModal}>
              Confirm
            </button>
            <button
              className="modal-btn modal-cancel"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
