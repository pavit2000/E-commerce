import react from "react";
import { Link } from "react-router-dom";

function Checkout({ cartItems, handleCheckout }) {

    return (
        <div className="container">
        <h1 className="heading">Checkout</h1>
    
        <div className="cart-bar">
            <p><strong>Cart:</strong> {cartItems.length} item(s)</p>
            {cartItems.length > 0 && (
            <button className="checkout-btn" onClick={handleCheckout}>
                Checkout (${cartItems.reduce((acc, item) => acc + item.price, 0).toFixed(2)})
            </button>
            )}
        </div>
    
        {cartItems.length === 0 ? (
            <p className="loading">Your cart is empty.</p>
        ) : (
            <div className="grid">
            {cartItems.map((item) => (
                <div className="card" key={item.id}>
                <img src={item.image} alt={item.title} className="product-image" />
                <div className="card-body">
                    <h2 className="product-title">{item.title}</h2>
                    <p className="product-price">${item.price}</p>
                </div>
                </div>
            ))}
            </div>
        )}
    
        <Link to="/" className="back-link">Back to Home</Link>
        </div>
    );
}

export default Checkout;