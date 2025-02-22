import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import {
  Box,
  Button,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
  },
});

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: 2,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={24}
            sx={{
              padding: isMobile ? 4 : 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 4,
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.02)",
              },
            }}
          >
            <TaskAltIcon sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
            <Typography
              variant={isMobile ? "h4" : "h3"}
              component="h1"
              gutterBottom
              sx={{ fontWeight: 700, color: "white" }}
            >
              Task Manager
            </Typography>
            <Typography
              variant="h6"
              sx={{ mb: 4, color: "rgba(255, 255, 255, 0.7)" }}
            >
              Sign in to manage your tasks
            </Typography>
            <Button
              variant="contained"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleSignIn}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: "1.1rem",
                textTransform: "none",
                borderRadius: 50,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #FE8B8B 30%, #FFA053 90%)",
                },
              }}
            >
              Sign in with Google
            </Button>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
