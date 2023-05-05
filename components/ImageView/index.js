/* eslint-disable @next/next/no-img-element */
import styles from "./ImageView.module.scss";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import { Paper, Typography } from "@mui/material";

const ImageView = ({ imageNumber, fractionName, path = "/Images/Task" }) => {
  return (
    <Paper variant="elevation" elevation={24} className={styles.main}>
      <div
        style={{
          maxWidth: "auto",
          height: "100%",
        }}
      >
        <Typography>Whole Image</Typography>
        <img
          style={{
            maxWidth: "auto",
            height: "90%",
          }}
          src={`${path}/${imageNumber}.jpg`}
          alt=""
        />
      </div>
      <div className={styles.zoom}>
        <ZoomInIcon
          fontSize="large"
          style={{
            fontSize: "3em",
          }}
        />
      </div>
      <div
        style={{
          maxWidth: "auto",
          height: "100%",
        }}
      >
        <Typography>Zoomed-in</Typography>
        <img
          style={{
            maxWidth: "auto",
            height: "90%",
          }}
          src={`${path}/${fractionName}.jpg`}
          alt=""
        />
      </div>
    </Paper>
  );
};

export default ImageView;
