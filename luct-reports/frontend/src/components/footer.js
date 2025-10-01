import React from "react";
import "./footer.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p className="footer-text">© {year} LUCT Reports. All rights reserved.</p>
        <p className="footer-text">
          Powered by <strong className="footer-brand">KCC</strong>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
