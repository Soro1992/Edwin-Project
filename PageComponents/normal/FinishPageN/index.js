import { Typography } from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import LoadingScreen from "../../../components/LoadingScreen";
import TopBar from "../../../components/TopBar";
import { badgesAtom } from "../../../recoil/app";

const FinishPageN = () => {
  const badgesCount = useRecoilValue(badgesAtom);
  const router = useRouter();

  useEffect(() => {
    if (badgesCount < 3) {
      let userId = router.query.userId;
      router.replace(`/${userId}`);
    }
  }, [badgesCount, router]);

  if (badgesCount < 3) {
    return <LoadingScreen message="Redirecting" />;
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TopBar title="Finish" />
      <Typography variant="h6">
        You have already received all payments
      </Typography>
      <hr />
      <Typography variant="h6">
        Do not forget to save your payment codes in&nbsp;
        <NextLink href={"/" + router.query.userId + "/codes"} passHref>
          <a
            style={{
              color: "blue",
              textDecoration: "underline",
            }}
          >
            Payment Page
          </a>
        </NextLink>
      </Typography>
    </div>
  );
};

export default FinishPageN;
