import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { useMemo, useRef } from "react";
import {
  badgesAtom,
  dailyXP,
  previousAnnotations,
  userAtom,
} from "../recoil/app";
import { useRecoilValue } from "recoil";
import HomeIcon from "@mui/icons-material/Home";
// import { styled } from "@mui/material/styles";
// import LinearProgress, {
//   linearProgressClasses,
// } from "@mui/material/LinearProgress";
import { useRouter } from "next/router";
import NewBadges from "./NewBadges";
import CreditScoreIcon from "@mui/icons-material/CreditScore";

// const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
//   height: 10,
//   borderRadius: 5,
//   [`&.${linearProgressClasses.colorPrimary}`]: {
//     backgroundColor:
//       theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
//   },
//   [`& .${linearProgressClasses.bar}`]: {
//     borderRadius: 5,
//     backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
//   },
// }));

const TopBar = ({ title }) => {
  const router = useRouter();
  const currentUser = useRecoilValue(userAtom);

  const showBadge = useMemo(() => {
    if (currentUser?.appVersion === "normal") return false;
    if (router.pathname.includes("/instructions")) return false;
    if (router.pathname.includes("/demographic")) return false;
    if (router.pathname.includes("/introduction")) return false;
    return true;
  }, [router.pathname, currentUser]);

  const showPayment = useMemo(() => {
    if (router.pathname.includes("/instructions")) return false;
    if (router.pathname.includes("/demographic")) return false;
    if (router.pathname.includes("/introduction")) return false;
    return true;
  }, [router.pathname]);

  const showHome = useMemo(() => {
    if (router.pathname.includes("/instructions")) return false;
    if (router.pathname.includes("/demographic")) return false;
    if (router.pathname.includes("/introduction")) return false;
    if (router.pathname.includes("/result")) return false;
    return true;
  }, [router.pathname]);

  const badges = useRecoilValue(badgesAtom);
  const prevAnnotations = useRecoilValue(previousAnnotations);

  const paymentDisabled = useMemo(() => {
    if (prevAnnotations.filter((t) => t.get("success")).length === 0)
      return true;

    if (prevAnnotations.filter((t) => t.get("success")).length !== badges)
      return true;

    return false;
  }, [badges, prevAnnotations]);

  const xpButtonRef = useRef();
  const xp = useRecoilValue(dailyXP);

  const userId = router.query.userId;

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          {showHome && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => router.push(`/${userId}`)}
            >
              <HomeIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>

          {showBadge && (
            <div
              ref={xpButtonRef}
              component="div"
              style={{
                minWidth: 200,
                padding: 8,
                borderRadius: 8,
                display: "flex",
                alignItems: "stretch",
              }}
            >
              <div style={{ flexGrow: 1, display: "flex" }}>
                <Typography variant="subtitle2">Current XP: {xp}</Typography>
              </div>
              {/* <div style={{ flexGrow: 1 }}>
                <Typography variant="subtitle2">XP Goal</Typography>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <BorderLinearProgress
                    sx={{ flexGrow: 1 }}
                    variant="determinate"
                    value={Math.round((100 * xp) / 30)}
                  />
                  <Typography variant="subtitle2">
                    {Math.min(xp, 30)}/30
                  </Typography>
                </div>
              </div> */}
            </div>
          )}
          {showBadge && <NewBadges />}
          {showPayment && (
            <Button
              disabled={paymentDisabled}
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ ml: 2 }}
              onClick={() => router.push(`/${userId}/codes`)}
              variant="outlined"
              endIcon={<CreditScoreIcon />}
            >
              Payment Codes
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default TopBar;
