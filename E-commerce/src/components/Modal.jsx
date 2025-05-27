function Modal({ showModal, setShowModal, cartItems, totalPrice, closeModal }) {
    if (!showModal) return null;

    return (
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
    );
}

export default Modal;