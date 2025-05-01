// src/components/ui/Badge.jsx
import React from "react";
import "./../../css/components.css";

export function Badge({ children, className = "" }) {
  return <div className={`custom-badge ${className}`}>{children}</div>;
}