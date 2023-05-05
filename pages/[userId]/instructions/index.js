import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import Instructions from "../../../components/Instructions";
import LoadingScreen from "../../../components/LoadingScreen";
import SupportFooter from "../../../components/SupportFooter";
import TopBar from "../../../components/TopBar";
import { userAtom } from "../../../recoil/app";

const InstructionsPage = () => {
  const currentUser = useRecoilValue(userAtom);
  const router = useRouter();

  useEffect(() => {
    if (!currentUser?.demographic) {
      let userId = router.query.userId;
      router.push("/" + userId + "/demographic");
    }
  }, [currentUser, router]);

  if (!currentUser?.demographic) {
    return <LoadingScreen message="Redirecting" />;
  }

  return (
    <div
      style={{
        padding: "5em 2em 5em 2em",
      }}
    >
      <TopBar title="Instructions" />
      <Instructions />
      <div style={{ textAlign: "center", paddingTop: 24 }}>
        <Button
          sx={{ width: "200px" }}
          variant="contained"
          onClick={() => {
            let userId = router.query.userId;
            router.push("/" + userId);
          }}
        >
          Continue
        </Button>
      </div>
      <SupportFooter />
    </div>
  );
};

export default InstructionsPage;
