import { useRouter } from "next/router";
import LoadingScreen from "../../../components/LoadingScreen";
import TopBar from "../../../components/TopBar";
import { useRandomImage } from "../../../hooks/data";
import { Button, Typography } from "@mui/material";
import styles from "./Challenge.module.scss";
import { useEffect, useMemo, useState } from "react";
import { answers } from "../../../constants/results";
import { completion } from "../../../recoil/app";
import InstructionsModal from "../../../components/InstructionsModal";
import ImageView from "../../../components/ImageView";
import SupportFooter from "../../../components/SupportFooter";
import RadialProgress from "../../../components/RadialProgress";
import { useRecoilState } from "recoil";
import Image from "next/image";
// import dynamic from "next/dynamic";

const ChallengeG = () => {
  const router = useRouter();
  const cid = router.query.cid;

  useEffect(() => {
    if (!/[123]/.test(cid)) {
      let userId = router.query.userId;
      router.replace(`/${userId}`);
    }
  }, [cid, router]);

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

  const expected = useMemo(() => {
    if (!imageNumber) return null;

    if (answers[imageNumber]) {
      return "yes";
    } else {
      return "no";
    }
  }, [imageNumber]);

  const [answer, setAnswer] = useState(null);
  const [completed, setCompleted] = useRecoilState(completion);

  useEffect(() => {
    if (answer) {
      if (answer === expected) {
        let key = "challenge" + cid;
        setCompleted((prev) => ({ ...prev, [key]: true }));
      }
    }
  }, [cid, answer, expected, setCompleted]);

  const invalidState = useMemo(() => {
    return Number(cid) > 1 && !completed.challenge1;
  }, [cid, completed.challenge1]);

  useEffect(() => {
    if (invalidState) {
      let userId = router.query.userId;
      router.replace(`/${userId}`);
    }
  }, [invalidState, router]);

  const tryAgain = () => {
    getRandomImage();
    setAnswer(null);
  };

  const goToNext = () => {
    let userId = router.query.userId;
    router.push(`/${userId}`);
  };

  const background = useMemo(() => {
    let opacity = Number(cid) * 0.15 + 0.2;
    return `linear-gradient(180deg, rgba(113, 167, 214, ${opacity}) 0%, rgba(255, 255, 255, 1) 100%)`;
  }, [cid]);

  if (invalidState) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <TopBar title="Training" />
      <RadialProgress />
      {imageNumber ? (
        answer ? (
          <div className={styles.container}>
            {answer === expected ? (
              <div className={styles.result}>
                <Typography variant="h5" color="green">
                  Well Done!
                </Typography>
                {expected === "yes" ? (
                  <Typography>
                    You did it right since the selected box contains a car or
                    part of a car.
                  </Typography>
                ) : (
                  <Typography>
                    You did it right since the selected box does not contain a
                    car or part of a car.
                  </Typography>
                )}
                <div
                  style={{
                    width: "100%",
                    height: "32.4vh",
                    position: "relative",
                  }}
                >
                  <Image
                    layout="fill"
                    objectFit="contain"
                    src={`/Images/Result/${fractionName}-green.jpg`}
                    alt="correct"
                  />
                </div>
                {answer === expected ? (
                  <Button
                    variant="contained"
                    className={styles.resultButton}
                    onClick={goToNext}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    color="error"
                    variant="contained"
                    className={styles.resultButton}
                    onClick={tryAgain}
                  >
                    Try Again
                  </Button>
                )}
              </div>
            ) : (
              <div className={styles.result}>
                <Typography color="red" variant="h5">
                  Attention!
                </Typography>
                {expected === "yes" ? (
                  <Typography>
                    You did it wrong since the selected box contains a car or
                    part of a car.
                  </Typography>
                ) : (
                  <Typography>
                    You did it wrong since the selected box does not contain a
                    car or part of a car.
                  </Typography>
                )}

                <div
                  style={{
                    width: "100%",
                    height: "32.4vh",
                    position: "relative",
                  }}
                >
                  <Image
                    src={`/Images/Result/${fractionName}-red.jpg`}
                    alt="wrong"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                {answer === expected ? (
                  <Button
                    variant="contained"
                    className={styles.resultButton}
                    onClick={goToNext}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    color="error"
                    variant="contained"
                    className={styles.resultButton}
                    onClick={tryAgain}
                  >
                    Try Again
                  </Button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div
            className={styles.container}
            style={{
              background: background,
            }}
          >
            <Typography variant="h3" align="left">
              Challenge {cid}
            </Typography>
            <Typography align="left">
              Please tell us if the selected box of the image contains a car or
              part of a car.
            </Typography>
            <div className={styles.imageBox}>
              <ImageView
                imageNumber={imageNumber}
                fractionName={fractionName}
              />
            </div>

            <div className={styles.buttons}>
              <div>
                <Button
                  style={{ width: "40%" }}
                  onClick={() => {
                    setAnswer("yes");
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
                    setAnswer("no");
                  }}
                  variant="contained"
                >
                  No
                </Button>
              </div>
            </div>
            {/* <WarningMessage /> */}
          </div>
        )
      ) : (
        <LoadingScreen />
      )}
      <InstructionsModal />
      <SupportFooter />
    </div>
  );
};

export default ChallengeG;
