import {
  badgesAtom,
  dailyXP,
  loggingIn,
  previousAnnotations,
  userAtom,
} from "../recoil/app";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import LoadingScreen from "./LoadingScreen";
import { useCallback, useEffect, useLayoutEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Parse from "parse";
import { answers } from "../constants/results";

const UserInfo = Parse.Object.extend("UserInfo");

const AuthWrapper = ({ children }) => {
  const [currentUser, setCurrentUser] = useRecoilState(userAtom);
  const [loginPending, setLoginPending] = useRecoilState(loggingIn);
  const setPrevAnnotations = useSetRecoilState(previousAnnotations);
  const setXP = useSetRecoilState(dailyXP);
  const setBadges = useSetRecoilState(badgesAtom);
  const router = useRouter();

  const userRequired = useMemo(() => {
    return router.pathname.startsWith("/[userId]");
  }, [router.pathname]);

  const demographicRequired = useMemo(() => {
    if (router.pathname.startsWith("/[userId]/introduction")) return false;
    if (router.pathname.startsWith("/[userId]/demographic")) return false;
    return router.pathname.startsWith("/[userId]");
  }, [router.pathname]);

  useLayoutEffect(() => {
    if (!loginPending && demographicRequired && !currentUser?.demographic) {
      const userId = router.query.userId;
      router.push(`/${userId}/introduction`);
    }
  }, [currentUser, router, demographicRequired, loginPending]);

  const loginAndFetchData = useCallback(async () => {
    const userId = router.query.userId;
    if (!loginPending || !userId) return;

    const infoQ = new Parse.Query("UserInfo");
    infoQ.equalTo("userId", userId);
    let userInfo = await infoQ.first();

    if (!userInfo) {
      if (loginPending && userId) {
        let lastUser = await new Parse.Query("UserInfo")
          .descending("createdAt")
          .first();

        let appVersion =
          lastUser?.get("appVersion") === "normal" ? "gamified" : "normal";

        userInfo = new UserInfo({
          userId: userId,
          appVersion: appVersion,
        });
        userInfo = await userInfo.save();
      }
    } else {
      const annotatinQ = new Parse.Query("Annotation");
      annotatinQ.equalTo("userId", userId);

      let annotations = await annotatinQ.findAll();

      setPrevAnnotations(annotations);

      let s = 0;
      let badges = 0;

      annotations.forEach((obj) => {
        if (obj.get("success")) badges++;

        obj.get("images").forEach((im, i) => {
          let ans = obj.get("answers")[i];
          let expected = answers[im] ? "yes" : "no";
          if (ans === expected) {
            s += 2;
          }
        });
      });

      setXP(s);
      setBadges(badges);
    }

    setCurrentUser({
      appVersion: userInfo.get("appVersion"),
      demographic: userInfo.get("demographic"),
    });
  }, [
    loginPending,
    router.query.userId,
    setBadges,
    setCurrentUser,
    setPrevAnnotations,
    setXP,
  ]);

  useEffect(() => {
    if (currentUser) {
      setLoginPending(false);
    }
  }, [currentUser, setLoginPending]);

  useEffect(() => {
    loginAndFetchData();
  }, [loginAndFetchData]);

  if (demographicRequired) {
    if (currentUser?.demographic && !loginPending) {
      return children;
    } else {
      return <LoadingScreen message="Checking for previous data" />;
    }
  } else if (userRequired) {
    if (currentUser && !loginPending) {
      return children;
    } else {
      return <LoadingScreen message="Checking for previous data" />;
    }
  } else {
    return children;
  }
};

export default AuthWrapper;
