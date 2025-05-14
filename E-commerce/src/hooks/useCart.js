import {useState} from "react";

export default function useCart() {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product) => {
        setCartItems((prev) => {
            const existing  = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? {...item, quantity: item.quantity + 1} : item
                );
            } else {
                return [...prev, {...product, quantity: 1}];
            }
        });
    };

    const removeFromCart = (productId) => {
        setCartItems((prev) =>
            prev
            .map((item) => {
                if (item.id === productId) {
                    return {...item, quantity: item.quantity - 1};
                }
                return item;
            })
            .filter((item) => item.quantity > 0)
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return {cartItems, addToCart, removeFromCart, clearCart};
}