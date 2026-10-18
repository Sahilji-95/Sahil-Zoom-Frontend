import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Snackbar from "@mui/material/Snackbar";
import "./Authentication.css";
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
      {/* Main Grid */}
      <Grid
        container
        component="main"
        className="authPage"
        sx={{ minHeight: "100vh" }}
      >
        <CssBaseline />

        {/* Left Illustration */}
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          className="authIllustration"
          sx={{
            backgroundImage: "url(/logo3.png)",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#141525",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Right Form Panel */}
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={0}
          square
          className="authFormPanel"
        >
          <Box className="authBox">
            <div className="authBrand">
              <span className="authBrandIcon">
                <LockOutlinedIcon />
              </span>
              <h1>
                Sahil <span>Zoom</span>
              </h1>
              <p>
                {formState === 0
                  ? "Welcome back! Sign in to continue."
                  : "Create an account and stay connected."}
              </p>
            </div>

            <div className="authTabs">
              <Button
                className="authTab"
                variant={formState === 0 ? "contained" : "outlined"}
                onClick={() => setFormState(0)}
              >
                Sign In
              </Button>

              <Button
                className="authTab"
                variant={formState === 1 ? "contained" : "outlined"}
                onClick={() => setFormState(1)}
              >
                Sign Up
              </Button>
            </div>

            <Box
              component="form"
              noValidate
              className="authForm"
              onSubmit={handleAuth}
            >
              {formState === 1 && (
                <>
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
                    label="Email address"
                    name="email"
                    type="email"
                    onChange={handleChange}
                    value={formData.email}
                  />
                </>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoFocus={formState === 0}
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

              {error && <p className="authError">{error}</p>}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="authSubmitButton"
              >
                {formState === 0 ? "Sign In" : "Create Account"}
              </Button>

              <p className="authSwitchText">
                {formState === 0
                  ? "New to Sahil Zoom? Create an account above."
                  : "Already have an account? Sign in above."}
              </p>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Snackbar open={open} autoHideDuration={4000} message={message} />
    </ThemeProvider>
  );
}
