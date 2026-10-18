// import "./LandingPage.css";
// import { Link } from "react-router-dom";
// import Button from "@mui/material/Button";
// import { useNavigate } from "react-router-dom";

// function LandingPage() {
//   let Navigate = useNavigate();
//   return (
//     <>
//       <div className="landingPageContainer">
//         <nav>
//           <div className="navLogo">
//             <h1>Sahil Zoom</h1>
//           </div>
//           <div className="navList">
//             <p
//               onClick={() => {
//                 Navigate("/guest");
//               }}
//             >
//               Join As Guest
//             </p>
//             <p
//               onClick={() => {
//                 Navigate("/auth");
//               }}
//             >
//               Register
//             </p>
//             <div
//               role="button"
//               onClick={() => {
//                 Navigate("/auth");
//               }}
//             >
//               <p>Login</p>
//             </div>
//           </div>
//         </nav>

//         <div className="hero-section">
//           <div className="text-section">
//             <h1>
//               <span style={{ color: "#FF9839" }}>Connect </span> With Your{" "}
//               <br />
//               Loved Ones
//             </h1>
//             <h3>Cover Distance By Sahil Zoom</h3>
//             <div>
//               <Link to={"/auth"}>
//                 <Button
//                   variant="contained"
//                   style={{ backgroundColor: "#D97500", fontSize: "1.2rem" }}
//                 >
//                   Get Started
//                 </Button>
//               </Link>
//             </div>
//           </div>
//           <div className="image-section">
//             <img src="mobile.png" alt="modile" />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default LandingPage;

import "./LandingPage.css";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <main className="landingPageContainer">
      {/* Navbar */}
      <nav className="landingNavbar">
        <Link to="/" className="navLogo">
          <span className="logoIcon">
            <VideocamRoundedIcon />
          </span>
          <span>
            Sahil <strong>Zoom</strong>
          </span>
        </Link>

        <div className="navList">
          <button
            type="button"
            className="navLink"
            onClick={() => navigate("/guest")}
          >
            Join as Guest
          </button>

          <button
            type="button"
            className="navLink"
            onClick={() => navigate("/auth")}
          >
            Register
          </button>

          <Button
            variant="contained"
            className="navLoginButton"
            onClick={() => navigate("/auth")}
          >
            Login
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="heroSection">
        <div className="heroText">
          <span className="heroBadge">
            <span className="statusDot" />
            Video calls made simple
          </span>

          <h1>
            Connect with your
            <br className="desktopBreak" />
            <span className="highlightText"> loved ones.</span>
          </h1>

          <p className="heroDescription">
            No matter the distance, stay close to the people who matter most.
            Enjoy seamless video calls and make every conversation feel special.
          </p>

          <div className="heroActions">
            <Button
              variant="contained"
              className="getStartedButton"
              onClick={() => navigate("/auth")}
              endIcon={<ArrowForwardRoundedIcon />}
            >
              Get Started
            </Button>

            <Button
              variant="outlined"
              className="guestButton"
              onClick={() => navigate("/guest")}
            >
              Join as Guest
            </Button>
          </div>

          <div className="heroFeatures">
            <span>✓ Easy to use</span>
            <span>✓ Stay connected</span>
            <span>✓ Join in seconds</span>
          </div>
        </div>

        <div className="heroImage">
          <div className="imageGlow" />
          <img
            src="/mobile.png"
            alt="Sahil Zoom video calling application preview"
          />

          {/* <div className="floatingCard floatingCardTop">
            <span className="floatingIcon">📹</span>
            <div>
              <strong>HD Video Calls</strong>
              <small>See every smile</small>
            </div>
          </div> */}

          {/* <div className="floatingCard floatingCardBottom">
            <span className="onlineDot" />
            <div>
              <strong>Stay Connected</strong>
              <small>Closer, wherever you are</small>
            </div>
          </div> */}
        </div>
      </section>

      <footer className="landingFooter">
        Made for meaningful conversations.
      </footer>
    </main>
  );
}

export default LandingPage;
