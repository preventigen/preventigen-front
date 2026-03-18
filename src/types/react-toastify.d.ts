import "react-toastify";

declare module "react-toastify" {
  interface ToastContainerProps {
    bodyClassName?: string;
  }

  interface ToastOptions<Data = unknown> {
    bodyClassName?: string;
  }
}
