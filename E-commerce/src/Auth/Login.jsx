// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../Auth/AuthContext";

// function Login() {
//     const { login, loading, error } = useAuth();
//     const [username, setUsername] = useState("mor_2314");
//     const [password, setPassword] = useState("83r5^_");
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         await login(username, password);
//         navigate("/");
//       };
    
//       return (
//         <form onSubmit={handleSubmit}>
//           <h2>Login</h2>
//           <input value={username} onChange={(e) => setUsername(e.target.value)} />
//           <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//           <button type="submit" disabled={loading}>
//             {loading ? "Logging in..." : "Login"}
//           </button>
//           {error && <p style={{ color: "red" }}>{error}</p>}
//         </form>
//       );
// }

// export default Login;
