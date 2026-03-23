import "./LandingPage.css";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  let Navigate = useNavigate();
  return (
    <>
      <div className="landingPageContainer">
        <nav>
          <div className="navLogo">
            <h1>Sahil Zoom</h1>
          </div>
          <div className="navList">
            <p
              onClick={() => {
                Navigate("/guest");
              }}
            >
              Join As Guest
            </p>
            <p
              onClick={() => {
                Navigate("/auth");
              }}
            >
              Register
            </p>
            <div
              role="button"
              onClick={() => {
                Navigate("/auth");
              }}
            >
              <p>Login</p>
            </div>
          </div>
        </nav>

        <div className="hero-section">
          <div className="text-section">
            <h1>
              <span style={{ color: "#FF9839" }}>Connect </span> With Your{" "}
              <br />
              Loved Ones
            </h1>
            <h3>Cover Distance By Sahil Zoom</h3>
            <div>
              <Link to={"/auth"}>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#D97500", fontSize: "1.2rem" }}
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
          <div className="image-section">
            <img src="mobile.png" alt="modile" />
          </div>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
