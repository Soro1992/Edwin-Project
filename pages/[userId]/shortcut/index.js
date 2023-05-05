/* eslint-disable @next/next/no-img-element */
import { Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import ImageView from "../../../components/ImageView";
import InstructionsModal from "../../../components/InstructionsModal";
import LoadingScreen from "../../../components/LoadingScreen";
import RadialProgress from "../../../components/RadialProgress";
import SupportFooter from "../../../components/SupportFooter";
import TopBar from "../../../components/TopBar";
import { answers } from "../../../constants/results";
import { useRandomImage } from "../../../hooks/data";
import { completion, userAtom, userState } from "../../../recoil/app";
import styles from "./Shortcut.module.scss";
import Image from "next/image";

const ShortCut = () => {
  const [imageNumber, getRandomImage] = useRandomImage();
  const router = useRouter();
  const currentUser = useRecoilValue(userAtom);

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

  const [answer, setanswer] = useState(null);
  const setCompleted = useSetRecoilState(completion);

  useEffect(() => {
    if (answer) {
      if (answer === expected) {
        setCompleted((prev) => ({
          ...prev,
          shortcut: true,
          challenge1: true,
          challenge2: true,
          challenge3: true,
        }));
      }
    }
  }, [answer, expected, setCompleted]);

  const tryAgain = () => {
    getRandomImage();
    setanswer(null);
  };

  const goToNext = () => {
    const userId = router.query.userId;
    router.push(`/${userId}`);
  };

  useEffect(() => {
    if (currentUser?.appVersion !== "gamified") {
      const userId = router.query.userId;
      router.push(`/${userId}`);
    }
  }, [currentUser?.appVersion, router]);

  if (currentUser?.appVersion !== "gamified") return <LoadingScreen />;

  return (
    <div
      style={{
        background: answer
          ? ""
          : "linear-gradient(180deg, rgba(113, 167, 214, 0.5) 0%, rgba(150, 94, 152, 0.5) 100%)",
        height: "100vh",
      }}
    >
      <TopBar title="Shortcut" />
      <RadialProgress />
      {imageNumber ? (
        answer ? (
          <div className={styles.container}>
            {answer === expected ? (
              <div className={styles.result}>
                <Typography color="green" variant="h5">
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
                <Typography color="red">Attention!</Typography>
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
          <div className={styles.container}>
            <Typography variant="h3" align="left">
              Shortcut
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
                    setanswer("yes");
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
      <SupportFooter />
      <InstructionsModal />
    </div>
  );
};

export default ShortCut;
