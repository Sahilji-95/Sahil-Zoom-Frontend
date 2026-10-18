import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import "./History.css";

export default function History() {
  const { getUserHistory } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);
  const Navigate = useNavigate();

  useEffect(() => {
    const getHistory = async () => {
      try {
        let history = await getUserHistory();
        setMeetings(history);
      } catch (error) {
        console.log(error);
      }
    };

    getHistory();
  }, [getUserHistory]);

  let handleBack = () => {
    Navigate("/home");
  };

  const formatDate = (dateString) => {
    let date = new Date(dateString);
    let day = date.getDay().toString().padStart(2, "0");
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let year = date.getFullYear().toString().padStart(2, "0");

    return `${day}/${month}/${year}`;
  };
  return (
    <div className="historyPage">
      <IconButton onClick={handleBack} aria-label="Go back to home">
        <ArrowBackIcon />
        <p>Back</p>
      </IconButton>

      {meetings.length !== 0 ? (
        meetings.map((e, i) => {
          return (
            <Card key={i} variant="outlined">
              <CardContent>
                <Typography
                  gutterBottom
                  sx={{ color: "text.secondary", fontSize: 14 }}
                >
                  Code : {e.meetingCode}
                </Typography>

                <Typography variant="h5" component="div" />

                <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                  {formatDate(e.date)}
                </Typography>
              </CardContent>
            </Card>
          );
        })
      ) : (
        <h3>No history yet</h3>
      )}
    </div>
  );
}
