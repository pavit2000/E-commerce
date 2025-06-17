import React from "react";
import { useAuth } from "../context/AuthContext";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import RegisterButton from "./RegisterButton";
import "../CSS/Header.css";

function Header({ title }) {
  const { user } = useAuth();
  return (
    <header className="header">
      <div className="header-top">
        {user ? (
          <LogoutButton />
        ) : (
          <>
            <LoginButton />
            <RegisterButton />
          </>
        )}
      </div>

      <h1 className="header-title">{title}</h1>

      {user && (
        <div className="user-display">
          Welcome, <strong>{user.username}</strong>
        </div>
      )}
    </header>
    // <header className="header">
    //   <div className="auth-controls">
    //     {user ? (
    //       <>
    //         <LogoutButton />
    //         <div className="user-display">
    //           Welcome, <strong>{user.username}</strong>
    //         </div>
    //       </>
    //     ) : (
    //       <>
    //         <LoginButton />
    //         <RegisterButton />
    //       </>
    //     )}
    //     <h1 className="heading">{title}</h1>
    //   </div>
    // </header>
  );
}

export default Header;
