import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WithAuth = (WrapeedComponent) => {
  const AuthComponent = (props) => {
    const Navigate = useNavigate();
    const isAuthenticate = () => {
      if (localStorage.getItem("token")) {
        return true;
      }
      return false;
    };
    useEffect(() => {
      if (!isAuthenticate()) {
        Navigate("/auth");
      }
    }, []);
    return <WrapeedComponent {...props} />;
  };
  return AuthComponent;
};

export default WithAuth;
