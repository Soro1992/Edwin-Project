import { Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import InstructionsModal from "../../../components/InstructionsModal";
import LoadingScreen from "../../../components/LoadingScreen";
import TopBar from "../../../components/TopBar";
import { answers } from "../../../constants/results";
import { useRandomImage } from "../../../hooks/data";
import {
  annotationAnswersAtom,
  annotationImagesAtom,
  completion,
  dailyXP,
  previousAnnotations,
  userState,
} from "../../../recoil/app";
import styles from "./Annotation.module.scss";
import ImageView from "../../../components/ImageView";
import SupportFooter from "../../../components/SupportFooter";
import TrapAlert from "../../../components/TrapAlert";
import RadialProgress from "../../../components/RadialProgress";

/* eslint-disable @next/next/no-img-element */
const AnnotationPageN = () => {
  const router = useRouter();
  const cid = router.query.cid;
  const setAnnotationImages = useSetRecoilState(annotationImagesAtom);
  const setAnnotationAnswers = useSetRecoilState(annotationAnswersAtom);
  const setXP = useSetRecoilState(dailyXP);

  const [imageNumber, getRandomImage] = useRandomImage();

  const fractionName = useMemo(() => {
    if (!imageNumber) return null;
    let answer = answers[imageNumber];
    if (answer) {
      return imageNumber + "-correct";
    } else {
      return imageNumber + "-wrong";
    }
  }, [imageNumber]);

  useEffect(() => {
    if (imageNumber) {
      setAnnotationImages((arr) => {
        let c = [...arr];
        c[Number(cid) - 1] = imageNumber;
        return c;
      });
    }
  }, [cid, imageNumber, setAnnotationImages]);

  const [answer, setanswer] = useState(null);
  const setCompleted = useSetRecoilState(completion);
  const currentState = useRecoilValue(userState);
  const prevAnnotations = useRecoilValue(previousAnnotations);

  useEffect(() => {
    if (answer) {
      setAnnotationAnswers((arr) => {
        let c = [...arr];
        c[Number(cid) - 1] = answer;
        return c;
      });
      let key = "annotation" + cid;
      setCompleted((prev) => ({ ...prev, [key]: true }));
    }
  }, [cid, answer, setCompleted, setAnnotationAnswers]);

  useEffect(() => {
    if (imageNumber && answer) {
      let expected = answers[imageNumber] ? "yes" : "no";
      if (answer === expected) {
        setXP((p) => p + 2);
      }
    }
  }, [answer, imageNumber, setXP]);

  const goToNext = () => {
    let userId = router.query.userId;
    router.push(`/${userId}`);
  };

  const invalidState = useMemo(() => {
    const canAnnotate =
      currentState === "annotation" || prevAnnotations.length > 0;
    return !canAnnotate;
  }, [currentState, prevAnnotations.length]);

  useEffect(() => {
    if (invalidState) {
      let userId = router.query.userId;
      router.push(`/${userId}`);
    }
  }, [invalidState, router]);

  if (invalidState) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <TopBar title="Annotation" />
      {/* <RadialProgress /> */}
      {imageNumber ? (
        <div className={styles.container}>
          <Typography variant="h3" align="left">
            Image {cid}
          </Typography>
          <Typography align="left">
            Please tell us if the selected box of the image contains a car or
            part of a car.
          </Typography>

          <div className={styles.imageBox}>
            <ImageView imageNumber={imageNumber} fractionName={fractionName} />
          </div>
          <div className={styles.buttons}>
            <div>
              <Button
                style={{ width: "40%" }}
                onClick={() => {
                  setanswer("yes");
                  goToNext();
                }}
                variant="contained"
              >
                Yes
              </Button>
            </div>
            <div>
              <Button
                style={{ width: "40%" }}
                color="secondary"
                onClick={() => {
                  setanswer("no");
                  goToNext();
                }}
                variant="contained"
              >
                No
              </Button>
            </div>
            <div>
              <Button
                style={{ width: "40%" }}
                color="warning"
                onClick={() => {
                  setanswer("not sure");
                  goToNext();
                }}
                variant="contained"
              >
                Not Sure
              </Button>
            </div>
          </div>
          {/* <TrapAlert  />  */}
        </div>
      ) : (
        <LoadingScreen />
      )}
      <InstructionsModal />
      <SupportFooter />
    </div>
  );
};

export default AnnotationPageN;
