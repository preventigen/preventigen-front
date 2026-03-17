"use client";

import { ToastContainer } from "react-toastify";

export function AppToastProvider() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3800}
      closeOnClick
      pauseOnHover
      draggable
      newestOnTop
      limit={4}
      stacked
      theme="light"
      className="pg-toast-container"
      toastClassName="pg-toast"
      bodyClassName="pg-toast__body"
      progressClassName="pg-toast__progress"
    />
  );
}
