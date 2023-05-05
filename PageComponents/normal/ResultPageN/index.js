import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from "recoil";
// import Feedback from "../../../components/Feedback";
import LoadingScreen from "../../../components/LoadingScreen";
import Motivation, { questions } from "../../../components/MotivationN";
import Payment from "../../../components/PaymentG";
import SupportFooter from "../../../components/SupportFooter";
import TopBar from "../../../components/TopBar";
import { answers } from "../../../constants/results";
import {
  annotationAnswersAtom,
  annotationImagesAtom,
  badgesAtom,
  completion,
  userState,
} from "../../../recoil/app";

const ResultPageN = () => {
  const currentState = useRecoilValue(userState);
  const router = useRouter();
  const [badgesCount, setBadges] = useRecoilState(badgesAtom);
  const [step, setStep] = useState(1);

  const title = useMemo(() => {
    if (step === 1) return "Motivation Questionaire";
    return "Result";
  }, [step]);

  const [score, setScore] = useState(null);
  const [comment, setComment] = useState("");
  const annotationImages = useRecoilValue(annotationImagesAtom);
  const annotationAnswers = useRecoilValue(annotationAnswersAtom);

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

  useEffect(() => {
    if (successful) {
      setBadges((b) => b + 1);
    }
  }, [setBadges, successful]);

  const setCompleted = useSetRecoilState(completion);
  const resetCompletion = useResetRecoilState(completion); // here is the Atom reset to default. (default: false)
  const resetImages = useResetRecoilState(annotationImagesAtom); // reset to empty array ([]); images
  const resetAnswers = useResetRecoilState(annotationAnswersAtom); // reset to empty array ([]); answers

  useEffect(() => {
    return () => {
      resetImages();
      resetAnswers();
      setCompleted({
        challenge1: true,
        challenge2: true,
        challenge3: true,
        annotation1: false,
        annotation2: false,
        annotation3: false,
        annotation4: false,
        annotation5: false,
      });
    };
  }, [resetAnswers, resetCompletion, resetImages, setCompleted]);

  if (!completedAnnotation) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <TopBar title={title} />

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

      <SupportFooter />
    </div>
  );
};

export default ResultPageN;
