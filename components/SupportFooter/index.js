import { Typography } from "@mui/material";
import styles from './SupportFooter.module.scss'

const email = "soroush.daneshi@tu-ilmenau.de";

const SupportFooter = () => {
  return (
    <footer
      style={{
        display: "flex",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "#333",
        padding: 4,
        justifyContent: 'center',
        // alignItems: 'center',
      }}
    >
      <Typography color="white">
        Need any help? Contact us at <a className={styles.email} href={`mailto:${email}`}>{email}</a>
      </Typography>
    </footer>
  );
};

export default SupportFooter;
