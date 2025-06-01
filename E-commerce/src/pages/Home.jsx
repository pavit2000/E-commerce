import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import { filterProducts } from "../utils/filterProducts";
import { CartProvider, useCart } from "../context/CartContext";
import "../CSS/home.css"; 
import FilterControls from "../components/FilterControls";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "../components/LogoutButton";
import LoginButton from "../components/LoginButton";
import RegisterButton from "../components/RegisterButton";
import CartBar from "../components/CartBar";


function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4; // Number of products per page

  // filter state
  const [filters, setFilters] = useState({
    selectedCategory: "all",
    selectedBrand: "all",
    minPrice: "",
    maxPrice: "",
  });

  const filteredProducts = filterProducts(products, filters);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const { cartItems, cartLoading, totalQuantity, totalPrice, deleteCart } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();

  const triggerCheckout = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
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
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset pagination when filters change
  }, [filters]);

  return (
    <div className="container">
      <LoginButton />
      {user && <LogoutButton />}
      <RegisterButton />
      <h1 className="heading">Holiday Specials</h1>

      <CartBar 
        onCheckout={triggerCheckout} 
        showDelete={false}
      />

      {cartLoading && (
        <p className="loading">Updating cart...</p> 
      )}

      <FilterControls filters={filters} setFilters={setFilters}/>

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

      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        totalPrice={totalPrice}
        closeModal={closeModal}
      />

    </div>
  );
}

export default Home;
