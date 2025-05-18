// import { createContext, useContext, useState } from "react";

// const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//     const [token, setToken] = useState(localStorage.getItem("token") || null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const login = async(username, password) => {
//         setLoading(true);
//         setError(null);
//         try {
//             const res = await fetch("https://fakestoreapi.com/auth/login", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({ username, password }),
//             });

//             const data = await res.json();

//             if (data.token) {
//                 setToken(data.token);
//                 localStorage.setItem("token", data.token);
//               } else {
//                 throw new Error("Login failed. Check username and password.");
//               }

//         } catch (error) {
//             setError(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const logout = () => {
//         setToken(null);
//         localStorage.removeItem("token");
//     };

//     return (
//         <AuthContext.Provider value={{ token, login, logout, loading, error }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => useContext(AuthContext);
// export default AuthProvider;