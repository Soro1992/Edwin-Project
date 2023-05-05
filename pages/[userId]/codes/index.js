import {
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import TopBar from "../../../components/TopBar";
import { previousAnnotations } from "../../../recoil/app";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SupportFooter from "../../../components/SupportFooter";

const PaymentCodes = () => {
  const prevAnnotations = useRecoilValue(previousAnnotations);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const successfulAnnotations = useMemo(() => {
    return prevAnnotations.filter((t) => t.get("success"));
  }, [prevAnnotations]);

  return (
    <div>
      <TopBar title="Payment Codes" />
      <div
        style={{
          marginTop: "5em",
          marginLeft: "2em",
          marginRight: "2em",
        }}
      >
        {successfulAnnotations.length > 0 ? (
          <div>
            <Typography>
              <b>Here you</b> find <b>all the payment codes you have</b>{" "}
              received.
            </Typography>

            <Typography>
              Click on each item to copy and paste it in crowdsourcing platform
              to get fully paid
            </Typography>
            <br />
            <Grid container justifyContent="center">
              <Grid item xs={12} sm={10} md={8} lg={6} xl={4}>
                <Paper elevation={16}>
                  <List>
                    {successfulAnnotations.map((obj, i) => (
                      <ListItem
                        key={obj.id}
                        secondaryAction={
                          <IconButton
                            edge="start"
                            onClick={() => {
                              navigator.clipboard.writeText(obj.get("code"));
                              enqueueSnackbar("Code Copied to clipboad");
                            }}
                          >
                            <ContentCopyIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText primary={obj.get("code")} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
                <div
                  style={{
                    marginTop: "5vh",
                    textAlign: "center",
                  }}
                >
                  <Button
                    style={{
                      alignItems: "center",
                    }}
                    variant="contained"
                    onClick={() => {
                      let userId = router.query.userId;
                      router.push(`/${userId}`);
                    }}
                  >
                    Gain More
                  </Button>
                </div>
              </Grid>
            </Grid>
          </div>
        ) : (
          <div>
            <Grid container justifyContent="center">
              <Grid item xs={12} sm={10} md={8} lg={6} xl={4}>
                <Typography variant="h5" textAlign="center">
                  You haven&apos;t done any annotaion. Go to home page and start
                  annotating to get paid!
                </Typography>
                <Button
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => {
                    let userId = router.query.userId;
                    router.push("/" + userId);
                  }}
                  variant="contained"
                >
                  Start Annotating
                </Button>
              </Grid>
            </Grid>
          </div>
        )}
      </div>
      <SupportFooter />
    </div>
  );
};

export default PaymentCodes;
