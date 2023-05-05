/* eslint-disable react/display-name */
import { Button } from "@mui/material";
import Link from "next/link";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { completion, userState } from "../../recoil/app";
import { useRecoilValue } from "recoil";
import styles from "./MenuButton.module.scss";

import PropTypes from "prop-types";
import { forwardRef, useMemo } from "react";
import { useRouter } from "next/router";

const MenuButton = forwardRef(({ text, type, number, ...props }, ref) => {
  const currentState = useRecoilValue(userState);
  const router = useRouter();
  const userId = router.query.userId;
  const completed = useRecoilValue(completion);
  const id = type + (number || "");
  const path =
    type === "shortcut"
      ? `/${userId}/shortcut`
      : `/${userId}/` + type + "s/" + number;
  const disabled = useMemo(() => {
    // if (type === "shortcut") return currentState !== "init";
    if (type === "challenge" && number > 1 && currentState === "init")
      return true;
    else return completed[id];
  }, [currentState, type, number, completed, id]);

  const checked = useMemo(() => {
    if (type !== "shortcut") return completed[id];

    return (
      completed[id] ||
      ["challenge1", "challenge2", "challenge3"].every((s) => completed[s])
    );
  }, [completed, id, type]);

  return (
    <Button
      ref={ref}
      {...props}
      color={id}
      variant="contained"
      className={
        type === "shortcut"
          ? [styles.roundButton, styles.shortcut].join(" ")
          : [styles.roundButton, styles[id]].join(" ")
      }
      disabled={disabled || checked}
      onClick={() => router.push(path)}
      style={
        type === "shortcut" && (disabled || checked)
          ? { background: "rgba(0, 0, 0, 0.12)" }
          : {}
      }
    >
      {text}
      {checked && (
        <CheckCircleIcon fontSize="large" className={styles.checkMark} />
      )}
    </Button>
  );
});

MenuButton.propTypes = {
  text: PropTypes.string,
  type: PropTypes.oneOf(["challenge", "annotation", "shortcut"]),
  number: PropTypes.number,
};

export default MenuButton;
