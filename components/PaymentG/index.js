import {
  Button,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import {
  annotationAnswersAtom,
  annotationImagesAtom,
  completion,
  previousAnnotations,
} from "../../recoil/app";
import LoadingScreen from "../LoadingScreen";
import styles from "./Payment.module.scss";
import Parse from "parse";
import md5 from "md5";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useSnackbar } from "notistack";
import { green } from "@mui/material/colors";

const Annotation = Parse.Object.extend("Annotation");

const PaymentG = ({ score, comment, motivation, trapIndex, successful }) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const annotationImages = useRecoilValue(annotationImagesAtom);
  const annotationAnswers = useRecoilValue(annotationAnswersAtom);

  // const resetCompletion = useResetRecoilState(completion); // here is the Atom reset to default. (default: false)
  // const resetImages = useResetRecoilState(annotationImagesAtom); // reset to empty array ([]); images
  // const resetAnswers = useResetRecoilState(annotationAnswersAtom); // reset to empty array ([]); answers
  const savedRef = useRef(false);

  const [loading, setLoading] = useState(false);
  const [prevAnnotations, setPrevAnnotations] =
    useRecoilState(previousAnnotations);
  const [paymentCode, setPaymentCode] = useState("");

  useEffect(() => {
    if (savedRef.current) return;
    if (trapIndex !== null && router.query.userId) {
      if (annotationImages.length === 0) return;
      if (annotationAnswers.length === 0) return;
      let userId = router.query.userId;
      let annotation = new Annotation();

      if (successful) {
        let code = md5(`${userId}_${prevAnnotations.length + 1}`);
        annotation.set("code", code);
      }

      annotation.set("userId", userId);
      annotation.set("images", annotationImages);
      annotation.set("answers", annotationAnswers);
      annotation.set("trapImage", annotationImages[trapIndex]);
      annotation.set("success", successful);
      annotation.set("comment", comment);
      annotation.set("stars", score);
      annotation.set("motivation", motivation);

      setLoading(true);
      annotation
        .save()
        .then((obj) => {
          savedRef.current = true;
          setPaymentCode(obj.get("code"));
          setPrevAnnotations((p) => p.concat([obj]));
        })
        .catch((ex) => {})
        .finally(() => {
          setLoading(false);
        });
    }
  }, [
    annotationAnswers,
    annotationImages,
    comment,
    motivation,
    prevAnnotations.length,
    router.query.userId,
    score,
    setPrevAnnotations,
    successful,
    trapIndex,
  ]);

  // useEffect(() => {
  //   return () => {
  //     resetImages();
  //     resetAnswers();
  //     resetCompletion();
  //   };
  // }, [resetAnswers, resetCompletion, resetImages]);

  if (!trapIndex === null || loading) {
    return (
      <div className={styles.main}>
        <LoadingScreen message="Processing" />
      </div>
    );
  }

  return (
    <div className={styles.main}>
      {
        <div>
          {paymentCode && (
            <Typography variant="h6">Your Payment Code is:</Typography>
          )}
          {paymentCode && (
            <div>
              <OutlinedInput
                fullWidth
                sx={{ mt: 1, mb: 2 }}
                value={paymentCode}
                contentEditable={false}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => {
                        navigator.clipboard.writeText(paymentCode);
                        enqueueSnackbar("Code Copied to Clipboard");
                      }}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </div>
          )}
          {successful ? (
            <Typography>
              Submit your code in the crowdsourcing platform to get fully paid.
              <br />
              You did great and <b><span style={{color:'green'}}>passed</span></b> our checks. You can try again to gain
              more.
              <br />
              <br />
              <b>Thank you for participating in this study.</b>
            </Typography>
          ) : (
            <Typography>
              You <b><span style={{color:'red'}}>did not pass</span></b> our checks, you can try again to do your best.
            </Typography>
          )}
        </div>
      }

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={() => {
          let userId = router.query.userId;
          router.push(`/${userId}`);
        }}
      >
        {successful ? "Gain More" : "Try Again"}
      </Button>
    </div>
  );
};

export default PaymentG;
