import { createTheme } from "@mui/material/styles";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    challenge1: {
      main: "rgba(113, 167, 214, 0.7)",
      dark: "coral",
    },
    challenge2: {
      main: "rgba(113, 167, 214, 0.85)",
      dark: "coral",
    },
    challenge3: {
      main: "rgba(113, 167, 214, 1)",
      dark: "coral",
    },
    shortcut: {
      main: "white",
      dark: "coral",
    },
    annotation1: {
      main: "rgba(150, 94, 152, 0.4)",
      dark: "coral",
    },
    annotation2: {
      main: "rgba(150, 94, 152, 0.55) ",
      dark: "coral",
    },
    annotation3: {
      main: "rgba(150, 94, 152, 0.70)",
      dark: "coral",
    },
    annotation4: {
      main: "rgba(150, 94, 152, 0.85)",
      dark: "coral",
    },
    annotation5: {
      main: "rgba(150, 94, 152, 1)",
      dark: "coral",
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        body1: {
          fontSize: 18,
        },
      },
    },
  },
});

export default lightTheme;
