import { Typography } from "@mui/material";
import styles from "./WarningMessage.module.scss";

const WarningMessage = () => {
  return (
    <div className={styles.warning}>
      <Typography textAlign="center">
        Avoid assuming the box of the image selecting parts of a car from which
        the image is captured
      </Typography>
      <div></div>
    </div>
  );
};

export default WarningMessage;
