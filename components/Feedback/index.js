import { Button, Rating, TextField, Typography } from "@mui/material";
import { useState } from "react";
import styles from "./Feedback.module.scss";

const Feedback = ({ score, setScore, comment, setComment, setStep }) => {
  return (
    <div className={styles.main}>
      <Typography variant="h4">Did you like it?</Typography>
      <Typography variant="h3">Rate us Now!</Typography>
      <div className={styles.ratingBox}>
        <Rating
          className={styles.rating}
          value={score}
          onChange={(event, newValue) => {
            setScore(newValue);
          }}
        />
      </div>
      <Typography>Any Comment?</Typography>
      <div className={styles.commentBox}>
        <TextField
          fullWidth
          sx={{ mt: 1 }}
          label="Write your comment here!"
          multiline
          rows={5}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={() => {
          setStep((s) => s + 1);
        }}
      >
        Continue
      </Button>
    </div>
  );
};

export default Feedback;
