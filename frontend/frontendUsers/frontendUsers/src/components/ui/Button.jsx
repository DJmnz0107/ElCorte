// src/components/ui/Button.jsx
import React from "react";
import "./../../css/components.css";

export function Button({ children, className = "", ...props }) {
  return (
    <button className={`custom-button ${className}`} {...props}>
      {children}
    </button>
  );
}
