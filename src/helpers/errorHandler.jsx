import { Modal } from "antd";

export const showErrorDialog = (message) => {
  Modal.error({
    title: "An Error Occurred",
    content: message,
    okText: "OK",
    centered: true,
  });
};

export const handleApiError = (error) => {
  let errorMessage = "Something went wrong. Please try again later.";

  if (error.response) {
    errorMessage = error.response.data?.message || `Error: ${error.response.status}`;
  } else if (error.request) {
    errorMessage = "No response from the server. Please check your internet connection.";
  } else {
    errorMessage = error.message;
  }

  showErrorDialog(errorMessage);
};
