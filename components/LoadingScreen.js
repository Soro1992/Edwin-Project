import { Backdrop, CircularProgress, Typography } from "@mui/material";

const LoadingScreen = ({ message }) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <CircularProgress color="inherit" />
        <Typography style={{ marginTop: 8 }}>{message}</Typography>
      </div>
    </Backdrop>
  );
};

export default LoadingScreen;
