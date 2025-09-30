import React from "react";
import "./footer.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>© {year} LUCT Reports. All rights reserved.</p>
        <p>Powered by <strong>me</strong></p>
      </div>
    </footer>
  );
}

export default Footer;
