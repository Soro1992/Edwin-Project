import { Typography } from "@mui/material";
import styles from "./TrapAlert.module.scss";

const TrapAlert = () => {
  return (
    <div className={styles.warning}>
      <Typography textAlign="center" variant="h7">
     <b>Attention please!</b> This task includes some quality checks that you should pass to get paid.
      </Typography>
      <div></div>
    </div>
  );
};

export default TrapAlert;
