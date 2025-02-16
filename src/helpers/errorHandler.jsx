import { Modal, Button, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";

export const showErrorDialog = (message) => {
  const copyErrorToClipboard = () => {
    try {
      navigator.clipboard.writeText(message);
      message.success("Error message copied to clipboard");
    } catch (err) {
      console.error("Failed to copy error message:", err);
      message.error("Failed to copy error message");
    }
  };

  Modal.error({
    title: "An Error Occurred",
    content: (
      <div>
        <p style={{ marginBottom: 16 }}>{message}</p>
        <Button 
          type="text" 
          icon={<CopyOutlined />} 
          onClick={copyErrorToClipboard}
        >
          Copy error message
        </Button>
      </div>
    ),
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