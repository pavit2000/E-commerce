import { useCart } from "../context/CartContext";

function Modal({ showModal, setShowModal, totalPrice, closeModal }) {
    const { cartItems, totalQuantity } = useCart();
    if (!showModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-box">
            <h2>Confirm Checkout</h2>
            <p>
                You're checking out{" "}
                {totalQuantity} item(s)
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
    );
}

export default Modal;