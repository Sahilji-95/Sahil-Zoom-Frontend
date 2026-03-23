// import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
// import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
// import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Snackbar from "@mui/material/Snackbar";

const defaultTheme = createTheme();

export default function Authentication() {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const [error, setError] = useState();
  const [message, setMessage] = useState();

  const [formState, setFormState] = useState(0);
  const [open, setOpen] = useState(false);

  const { handleRegister, handleLogin } = useContext(AuthContext);
  let handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (formState === 0) {
        let result = await handleLogin(formData.username, formData.password);
        console.log(result);
        setMessage(result);
        setOpen(true);
        setError("");
        setFormData({
          username: "",
          password: "",
        });
      }
      if (formState === 1) {
        let result = await handleRegister(
          formData.name,
          formData.username,
          formData.password,
          formData.email,
        );
        console.log(result);
        setMessage(result);
        setOpen(true);
        setError("");
        setFormState(0);
        setFormData({
          username: "",
          name: "",
          password: "",
          email: "",
        });
      }
    } catch (err) {
      console.log(err);
      let message = err.response.data.message;
      setError(message);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(logo3.png)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>

            <div>
              <Button
                variant={formState === 0 ? "contained" : " "}
                onClick={() => {
                  setFormState(0);
                }}
              >
                Sign In
              </Button>
              <Button
                variant={formState === 1 ? "contained" : " "}
                onClick={() => {
                  setFormState(1);
                }}
              >
                Sign up
              </Button>
            </div>

            <Box
              component="form"
              noValidate
              sx={{ mt: 1 }}
              onSubmit={handleAuth}
            >
              {formState === 1 ? (
                <div>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Full name"
                    name="name"
                    autoFocus
                    onChange={handleChange}
                    value={formData.name}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="email"
                    name="email"
                    autoFocus
                    onChange={handleChange}
                    value={formData.email}
                  />
                </div>
              ) : (
                <></>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoFocus
                onChange={handleChange}
                value={formData.username}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={handleChange}
                value={formData.password}
              />
              <p style={{ color: "red" }}>{error}</p>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {formState === 0 ? "Sign In" : "Sign Up"}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={4000} message={message} />
    </ThemeProvider>
  );
}
