import { Button, Divider, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import SupportFooter from "../../../components/SupportFooter";
import TopBar from "../../../components/TopBar";
import { userAtom } from "../../../recoil/app";

const Introduction = () => {
  const router = useRouter();
  const currentUser = useRecoilValue(userAtom);

  return (
    <div
      style={{
        paddingTop: "5em",
        paddingLeft: 120,
        paddingRight: 120,
        paddingBottom: "4em",
      }}
    >
      <TopBar title="Introduction" />
      <Typography align="center" variant="h3">
        Image Annotation & Questionnaire
      </Typography>
      <Divider style={{ background: "#965E98", height: 7, borderRadius: 3 }} />
      <Typography variant="h5">General instructions</Typography>
      <br />
      <Typography>
        The main aim of this research is to foster and enhance the motivation of
        crowdworkers in an image annotation task.
      </Typography>
      <br />
      <Typography>The test is divided into four sections:</Typography>
      <br />
      <Typography>
        1. You should answer some <b>demographic questions</b>.
      </Typography>
      <br />
      <Typography>
        2. You will be <b>trained</b> for the image annotation task.
      </Typography>
      <br />
      <Typography>
        3. You will <b>annotate 5 images</b>.
      </Typography>
      <br />
      <Typography>
        4. You will answer a <b>motivation questionnaire</b>.
      </Typography>
      <br />
      <Typography>
        All of these tasks can be completed in about 10 minutes for each
        experiment. Also, you can try the experiment several times.
      </Typography>
      <br />
      <Typography>
        Once you complete your last task you will see a payment code. Just copy
        and paste it on the crowdworking site, so you can get your compensation.
      </Typography>
      <br />
      <Typography>Thank you for your help in this experiment.</Typography>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          onClick={() => {
            if (currentUser.demographic) {
              router.push(`/${router.query.userId}`);
            } else {
              router.push(`/${router.query.userId}/demographic`);
            }
          }}
        >
          Start Questionnaire
        </Button>
      </div>
      <SupportFooter />
    </div>
  );
};

export default Introduction;
