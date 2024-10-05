import React from "react";
import Fallback from "./Fallback";

class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false ,errorMessage: '' };
    }
  
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      // You can also log the error to an error reporting service
      this.setState({ errorMessage: error.message });
    // You can also log the error to an error reporting service
      console.error("Error captured:", error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return <Fallback errorMessage={this.state.errorMessage}/>;
      }
  
      return this.props.children; 
    }
  }

export default ErrorBoundary;