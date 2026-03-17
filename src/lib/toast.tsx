import { CircleAlert, CircleCheckBig, Info, TriangleAlert } from "lucide-react";
import { toast, type ToastContent, type ToastOptions, type Id } from "react-toastify";

const baseOptions: ToastOptions = {
  className: "pg-toast",
  bodyClassName: "pg-toast__body",
  progressClassName: "pg-toast__progress",
};

function withDefaults(options?: ToastOptions): ToastOptions {
  return {
    ...baseOptions,
    ...options,
  };
}

export function showSuccessToast(message: ToastContent, options?: ToastOptions): Id {
  return toast.success(message, {
    icon: <CircleCheckBig className="h-5 w-5" />,
    autoClose: 3200,
    ...withDefaults(options),
  });
}

export function showErrorToast(message: ToastContent, options?: ToastOptions): Id {
  return toast.error(message, {
    icon: <CircleAlert className="h-5 w-5" />,
    autoClose: 5200,
    ...withDefaults(options),
  });
}

export function showWarningToast(message: ToastContent, options?: ToastOptions): Id {
  return toast.warn(message, {
    icon: <TriangleAlert className="h-5 w-5" />,
    autoClose: 4200,
    ...withDefaults(options),
  });
}

export function showInfoToast(message: ToastContent, options?: ToastOptions): Id {
  return toast.info(message, {
    icon: <Info className="h-5 w-5" />,
    autoClose: 3600,
    ...withDefaults(options),
  });
}

export function dismissToast(id?: Id) {
  toast.dismiss(id);
}
