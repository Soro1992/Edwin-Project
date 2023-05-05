import { Step, StepLabel, Stepper, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from "recoil";
import Feedback from "../../../components/Feedback";
import LoadingScreen from "../../../components/LoadingScreen";
import Motivation, { questions } from "../../../components/MotivationG";
import Payment from "../../../components/PaymentG";
import MessageBox from "../../../components/PopupMessage";
import SupportFooter from "../../../components/SupportFooter";
import TopBar from "../../../components/TopBar";
import { answers } from "../../../constants/results";
import {
  annotationAnswersAtom,
  annotationImagesAtom,
  badgesAtom,
  completion,
  popupOpen,
  userState,
} from "../../../recoil/app";

const badges = ["Bronze", "Silver", "Gold"];

const ResultPageG = () => {
  const currentState = useRecoilValue(userState);
  const router = useRouter();
  const [step, setStep] = useState(0);

  const title = useMemo(() => {
    if (step === 0) return "Feedback";
    if (step === 1) return "Motivation Questionaire";
    return "Result";
  }, [step]);

  const [score, setScore] = useState(null);
  const [comment, setComment] = useState("");
  const annotationImages = useRecoilValue(annotationImagesAtom);
  const annotationAnswers = useRecoilValue(annotationAnswersAtom);
  const setPopupOpen = useSetRecoilState(popupOpen);
  const [badgesCount, setBadges] = useRecoilState(badgesAtom);

  const [trapIndex, setTrapIndex] = useState(null);

  const [motivation, setMotivation] = useState(
    Array.from(new Array(questions.length))
  );

  const completedAnnotation = useMemo(() => {
    return currentState === "done";
  }, [currentState]);

  useEffect(() => {
    if (!completedAnnotation) {
      let userId = router.query.userId;
      router.replace(`/${userId}`);
    }
  }, [router, completedAnnotation]);

  const successful = useMemo(() => {
    if (!completedAnnotation || trapIndex === null) return false;
    // let trapIndex = Math.floor(Math.random() * 5); // number between 0 to 4
    let expected = answers[annotationImages[trapIndex]] ? "yes" : "no"; // (we have 5 images and compare to the expected
    // result of true: yes OR false: no)
    let ans = annotationAnswers[trapIndex]; // (with help of trapindex we read the answers)
    return ans === expected;
  }, [trapIndex, annotationAnswers, annotationImages, completedAnnotation]);

  useEffect(() => {
    if (trapIndex !== null && !successful) {
      setStep(2);
    }
  }, [trapIndex, successful]);

  useEffect(() => {
    if (completedAnnotation) {
      let i = Math.floor(Math.random() * 5); // find a random digit between 0 to 4
      setTrapIndex(i);
    }
  }, [annotationImages, completedAnnotation]);

  const badgeSource = useMemo(() => {
    if (!successful) return null;
    let medal = badges[badgesCount - 1];
    if (medal) return `/Images/Badges/${medal}.png`;
    return null;
  }, [successful, badgesCount]);

  useEffect(() => {
    if (successful) {
      setBadges((b) => b + 1);
    }
  }, [setBadges, successful]);

  useEffect(() => {
    if (badgeSource) {
      setPopupOpen(true);
    }
  }, [badgeSource, setPopupOpen]);

  const resetCompletion = useResetRecoilState(completion); // here is the Atom reset to default. (default: false)
  const resetImages = useResetRecoilState(annotationImagesAtom); // reset to empty array ([]); images
  const resetAnswers = useResetRecoilState(annotationAnswersAtom); // reset to empty array ([]); answers

  useEffect(() => {
    return () => {
      resetImages();
      resetAnswers();
      resetCompletion();
    };
  }, [resetAnswers, resetCompletion, resetImages]);

  if (!completedAnnotation) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <TopBar title={title} />
      {successful && step === 0 && (
        <Feedback
          setStep={setStep}
          score={score}
          setScore={setScore}
          comment={comment}
          setComment={setComment}
        />
      )}

      {successful && step === 1 && (
        <Motivation
          setStep={setStep}
          motivation={motivation}
          setMotivation={setMotivation}
        />
      )}

      {step === 2 && (
        <Payment
          score={score}
          comment={comment}
          motivation={motivation}
          trapIndex={trapIndex}
          successful={successful}
        />
      )}

      {/* <Stepper activeStep={step} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper> */}

      <SupportFooter />
      {badgeSource && (
        <MessageBox title="Congratulations!">
          <Typography>Awesome, You got a new badge!<br/>Continue to <b>unlock</b> other badges!</Typography>
          <div
            style={{
              width: "50vh",
              height: "50vh",
              position: "relative",
            }}
          >
            <Image
              src={badgeSource}
              layout="fill"
              objectFit="contain"
              alt="Badge"
            />
          </div>
        </MessageBox>
      )}
    </div>
  );
};

export default ResultPageG;
