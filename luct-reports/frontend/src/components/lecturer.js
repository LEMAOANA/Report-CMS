import React from "react";
import "./lecturer.css";

function LecturerPage() {
  const handleViewClasses = () => alert("Viewing Classes");
  const handleMonitorClass = () => alert("Monitoring Class Performance");
  const handleRateClass = () => alert("Rating Class");
  const handleSubmitReport = () => alert("Submitting Report");
  const handleViewReports = () => alert("Viewing Reports");
  const handleLogout = () => alert("Logging Out");

  return React.createElement(
    "div",
    { className: "lecturer-page" },
    React.createElement("h2", null, "Lecturer Dashboard"),
    React.createElement(
      "p",
      null,
      "Welcome Lecturer! Manage your classes, monitor performance, rate students, and handle reports here."
    ),
    React.createElement(
      "div",
      { className: "lecturer-actions" },
      React.createElement("button", { onClick: handleViewClasses }, "View Classes"),
      React.createElement("button", { onClick: handleMonitorClass }, "Monitor Class"),
      React.createElement("button", { onClick: handleRateClass }, "Rate Class"),
      React.createElement("button", { onClick: handleSubmitReport }, "Submit Report"),
      React.createElement("button", { onClick: handleViewReports }, "View Reports"),
      React.createElement("button", { onClick: handleLogout }, "Logout")
    )
  );
}

export default LecturerPage;
