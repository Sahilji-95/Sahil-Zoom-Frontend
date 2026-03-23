import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import WithAuth from "../utils/withAuth";
import HistoryIcon from "@mui/icons-material/History";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "./Home.css";
import { AuthContext } from "../contexts/AuthContext";

function Home() {
  let Navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");

  const { addToUserHistory } = useContext(AuthContext);

  let handleJoinVideoCall = async () => {
    await addToUserHistory(meetingCode);
    Navigate(`/${meetingCode}`);
  };
  let handleLogout = () => {
    localStorage.removeItem("token");
    Navigate("/");
  };

  let handleHistory = () => {
    Navigate("/history");
  };
  return (
    <div>
      <nav className="navBar">
        <div className="logo">
          <h3>Sahil Zoom </h3>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconButton onClick={handleHistory}>
            <HistoryIcon />
            <p>History</p>
          </IconButton>
          <Button onClick={handleLogout}>LogOut</Button>
        </div>
      </nav>

      <div className="meetContainer">
        <div className="leftPanel">
          <div>
            <h2>Providing Quality Video Call Just Like Quality Education</h2>
            <div style={{ display: "flex", gap: "10px" }}>
              <TextField
                onChange={(e) => setMeetingCode(e.target.value)}
                id="outline"
                variant="outlined"
              ></TextField>
              <Button onClick={handleJoinVideoCall} variant="contained">
                Join{" "}
              </Button>
            </div>
          </div>
        </div>
        <div className="rightPanel">
          <img src="/logo3.png" alt="logo" />
        </div>
      </div>
    </div>
  );
}

export default WithAuth(Home);
