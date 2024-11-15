import { toast } from "react-toastify";

export const notify = (status, message, containerId = "standard-toast") => {
  const options = {
    closeButton: true,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    containerId,
  };

  switch (status) {
    case "success":
      toast.success(message, options);
      break;

    case "error":
      toast.error(message, options);
      break;

    case "info":
      toast.info(message, options);
      break;

    default:
      toast(message, options);
      break;
  }
};
