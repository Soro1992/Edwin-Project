import { Lock } from "@mui/icons-material";
import { Tooltip, Typography, useTheme } from "@mui/material";
import TopBar from "../../components/TopBar";
import {
  badgesAtom,
  completion,
  popupOpen,
  previousAnnotations,
  userAtom,
  userState,
} from "../../recoil/app";
import styles from "./app.module.scss";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import LoadingScreen from "../../components/LoadingScreen";
import SupportFooter from "../../components/SupportFooter";
import MenuButton from "../../components/MenuButton";
import MessageBox from "../../components/PopupMessage";

const challenges = [1, 2, 3].map((i) => "challenge" + i); // We save 5 arrays and map them to annotation + 1/2/... [name]
const annotations = [1, 2, 3, 4, 5].map((i) => "annotation" + i); // We save 5 arrays and map them to annotation + 1/2/... [name]

const MainPage = () => {
  const theme = useTheme();
  const router = useRouter();

  const currentState = useRecoilValue(userState);

  const prevAnnotations = useRecoilValue(previousAnnotations);

  const [completed, setCompleted] = useRecoilState(completion);
  const canAnnotate = useMemo(() => {
    return currentState === "annotation" || prevAnnotations.length > 0;
  }, [currentState, prevAnnotations.length]);

  const resumeAnnotation = useMemo(() => {
    return (
      prevAnnotations.length > 0 &&
      challenges.every((k) => !completed[k]) &&
      annotations.every((k) => !completed[k])
    );
  }, [completed, prevAnnotations]);

  const firstAnnotation = useMemo(() => {
    // this is a hook; It defines a value with regard to the other values.
    return (
      challenges.every((k) => completed[k]) &&
      annotations.every((k) => !completed[k])
    ); // it is used after the completion of training "Perfect! Now
  }, [completed]); // you can start annotation" (it means all annotations are false)

  const lastAnnotation = useMemo(() => {
    // this is a hook; It defines a value with regard to the other values.
    return canAnnotate && annotations.filter((k) => completed[k]).length === 4; // it is used for displaying last annotation message
  }, [canAnnotate, completed]); // "WOW! just 1 more image" (it means only one annotation left)

  useEffect(() => {
    // when the annotation is completed "done", then it shows to the feedback page
    if (currentState === "done") {
      const userId = router.query.userId;
      router.push(`/${userId}/result`);
    }
  }, [currentState, router]);

  // const xp = useRecoilValue(dailyXP); // when the XPs is equal 30 or become more than 30, then it shows the thanks page
  const badges = useRecoilValue(badgesAtom);
  useEffect(() => {
    if (badges >= 3) {
      const userId = router.query.userId;
      router.push(`${userId}/thanks`);
    }
  }, [router, badges]);

  const completedAnnotation = useMemo(() => {
    return currentState === "done";
  }, [currentState]);

  const setPopupOpen = useSetRecoilState(popupOpen);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    let message;
    if (firstAnnotation) {
      message = "Perfect! Now you can start annotation!";
    } else if (resumeAnnotation) {
      message =
        "Since you are familiar with annotating images, You can start right away!";
    } else if (lastAnnotation) {
      message = "WOW! Just 1 more Image.";
    }

    if (message) {
      setPopupMessage(message);
      setPopupOpen(true);
    }
  }, [firstAnnotation, lastAnnotation, resumeAnnotation, setPopupOpen]);

  const currentUser = useRecoilValue(userAtom);

  useEffect(() => {
    if (currentUser.appVersion === "normal" && badges > 0) {
      setCompleted((p) => ({
        ...p,
        challenge1: true,
        challenge2: true,
        challenge3: true,
      }));
    }
  }, [badges, currentUser.appVersion, setCompleted]);

  useEffect(() => {
    if (currentUser.appVersion === "normal") {
      if (badges >= 3) return;

      let userId = router.query.userId;
      let incompleteChallenge = challenges.findIndex((s) => !completed[s]);

      if (incompleteChallenge > -1 && badges === 0) {
        router.push(`/${userId}/challenges/${incompleteChallenge + 1}`);
      } else {
        let incompleteAnnotation = annotations.findIndex((s) => !completed[s]);
        if (incompleteAnnotation > -1) {
          router.push(`/${userId}/annotations/${incompleteAnnotation + 1}`);
        }
      }
    }
  }, [completed, currentUser.appVersion, router, badges]);

  if (currentUser.appVersion === "normal") {
    return <LoadingScreen />;
  }

  if (badges >= 3) {
    // in this time we show a loading screen
    return <LoadingScreen message="Redirecting" />;
  }

  if (completedAnnotation) {
    // if the annotation is completed
    return (
      // we need to have a loading screen and do not see the main menu, because afterwards go to payment page
      <div>
        <LoadingScreen message="Processing Answers" />
      </div>
    );
  }

  return (
    // if not the user is in the main menu; the main menu style as below
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: theme.palette.background.default,
        paddingTop: "4em",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TopBar title="Home" />
      <div // here is the style of the TopBar
        style={{
          display: "flex",
          flexDirection: "row",
          padding: 16,
          flexGrow: 1,
          marginBottom: 30,
        }}
      >
        <div
          className={styles.row}
          style={{
            position: "relative",
            background: "rgba(113, 167, 214, 0.1)",
            flexGrow: 1,
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
            border: "1px solid #71A7D6",
            paddingTop: 64,
            paddingBottom: 36,
          }}
        >
          <Typography
            style={{ position: "absolute", left: 16, top: 16 }}
            variant="h6"
          >
            Training
          </Typography>

          <div className={styles.column}>
            <MenuButton text="Challenge 1" type="challenge" number={1} />
          </div>
          <div className={styles.column}>
            <MenuButton text="Challenge 2" type="challenge" number={2} />
            <MenuButton text="Challenge 3" type="challenge" number={3} />
          </div>
          <div
            style={{
              position: "absolute",
              right: -76,
              zIndex: 2,
              padding: 12,
              background: theme.palette.background.default,
              borderRadius: "50%",
              borderLeftColor: "#71A7D6",
              borderBottomColor: "#71A7D6",
              borderTopColor: "#965E98",
              borderRightColor: "#965E98",
              borderStyle: "solid",
              borderWidth: 1,
              rotate: "45deg",
            }}
          >
            <Tooltip title="Complete this shortcut in order to unlock the annotation phase">
              <span>
                <MenuButton text="Shortcut" type="shortcut" />
              </span>
            </Tooltip>
          </div>
        </div>
        <div
          className={styles.row}
          style={{
            position: "relative",
            background: "rgba(150, 94, 152, 0.1)",
            flexGrow: 1,
            border: "1px solid #965E98",
            borderBottomRightRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <Typography
            variant="h6"
            style={{ position: "absolute", left: 16, top: 16 }}
          >
            Annotation
          </Typography>
          <div className={styles.column}>
            <MenuButton text="Image 1" type="annotation" number={1} />
            <MenuButton text="Image 2" type="annotation" number={2} />
          </div>
          <div className={styles.column}>
            <MenuButton text="Image 3" type="annotation" number={3} />
          </div>
          <div className={styles.column}>
            <MenuButton text="Image 4" type="annotation" number={4} />
            <MenuButton text="Image 5" type="annotation" number={5} />
          </div>
          {!canAnnotate && (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                background: "rgba(100, 100, 100, 0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Lock fontSize="large" />
            </div>
          )}
        </div>
      </div>
      <MessageBox title="">
        <Typography>{popupMessage}</Typography>
      </MessageBox>
      {/* <div style={{ marginBottom: 40, height: "2.625em" }}>
        {firstAnnotation && (
          <Typography textAlign="center" variant="h4">
            Perfect! Now you can start annotation!
          </Typography>
        )}
        {lastAnnotation && (
          <Typography textAlign="center" variant="h4">
            WOW! Just 1 more Image.
          </Typography>
        )}
      </div> */}

      <SupportFooter />
    </div>
  );
};

export default MainPage;
