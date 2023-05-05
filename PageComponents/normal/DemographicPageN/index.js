import {
  Autocomplete,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { countries } from "../../../constants/countries";
import { userAtom } from "../../../recoil/app";
import { useRecoilState } from "recoil";
import { useSnackbar } from "notistack";
import TopBar from "../../../components/TopBar";
import SupportFooter from "../../../components/SupportFooter";
import { useRouter } from "next/router";
import Parse from "parse";
import { LoadingButton } from "@mui/lab";

const data = [
  {
    q: "What is your age",
    options: ["Under 18", "18-25 years old", "26-40 years old", "Over 40"],
    type: "textfield",
    key: "age",
  },
  {
    q: "What is your gender",
    options: ["Male", "Female", "Prefer not to say", "Other"],
    type: "radio",
    key: "gender",
  },
  {
    q: "What is your current continental location",
    options: [
      "Asia",
      "Europe",
      "North America",
      "South America",
      "Africa",
      "Australia",
      "Antarctica",
    ],
    type: "radio",
    key: "continent",
  },
  {
    q: "Which country do you live in currently",
    options: countries,
    type: "select",
    key: "country",
  },
  {
    q: "How often do you check crowdworking platform",
    options: [
      "Several times a day",
      "Once a day",
      "A few times a week",
      "Hardly ever",
    ],
    type: "radio",
    key: "crowdWorking",
  },
  // {
  //   q: "How much time do you spend playing games on average",
  //   options: [
  //     "I don't play games",
  //     "Less than 1h/week",
  //     "2-5h/week",
  //     "5-10h/week",
  //     "10-20h/week",
  //     "More than 20h/week",
  //   ],
  //   type: "radio",
  //   key: "gameTime",
  // },
  {
    q: "How much are you familiar with image annotation",
    options: ["None", "A little", "Completely familiar"],
    type: "radio",
    key: "imageAnnotation",
  },
];

const DemographicN = () => {
  const [formData, setFormData] = useState({});
  const [currentUser, setCurrentUser] = useRecoilState(userAtom);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const userId = router.query.userId;
  const [error, setError] = useState(null);

  const submit = useCallback(async () => {
    let missing = data.find((item) => !formData[item.key]);
    if (missing) {
      let el = document.getElementById(missing.key);
      el.scrollIntoView(false);
      enqueueSnackbar("Please answer all the questions", {
        variant: "warning",
      });
      setError(missing.key);
    } else {
      setLoading(true);
      try {
        let userId = router.query.userId;

        let infoQ = new Parse.Query("UserInfo");
        infoQ.equalTo("userId", userId);
        let userInfo = await infoQ.first();
        userInfo.set("demographic", formData);
        userInfo = await userInfo.save();

        setCurrentUser({
          appVersion: userInfo.get("appVersion"),
          demographic: userInfo.get("demographic"),
        });
      } catch (ex) {
        enqueueSnackbar(ex.message, { variant: "error" });
      } finally {
        setLoading(false);
      }
    }
  }, [enqueueSnackbar, formData, router.query.userId, setCurrentUser]);

  useEffect(() => {
    if (currentUser?.demographic) {
      router.push("/" + userId + "/instructions");
    }
  }, [currentUser, router, userId]);

  return (
    <div
      style={{
        padding: "5em",
      }}
    >
      <TopBar title="Demographic Questionnaire" />
      {data.map((obj, i) => {
        return (
          <div
            key={i}
            style={{
              background: i % 2 === 0 ? "lightgray" : "white",
              padding: 8,
            }}
          >
            {obj.type === "radio" ? (
              <FormControl error={error === obj.key}>
                <FormLabel>{`Question ${i + 1}) ${obj.q}?`}</FormLabel>
                <FormHelperText>
                  {error === obj.key ? "please provide an answer" : ""}
                </FormHelperText>
                <RadioGroup
                  id={obj.key}
                  sx={{ paddingLeft: 3 }}
                  aria-labelledby={"q" + i}
                  defaultValue="female"
                  name={"q" + i}
                  value={formData[obj.key] || null}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      [obj.key]: e.target.value,
                    }));
                  }}
                >
                  {obj.options.map((t, ii) => (
                    <FormControlLabel
                      key={ii}
                      value={t}
                      control={<Radio />}
                      label={t}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            ) : obj.type === "textfield" ? (
              <div>
                <FormLabel>{`Question ${i + 1}) ${obj.q}?`}</FormLabel>
                <TextField
                  error={error === obj.key}
                  helperText={
                    error === obj.key ? "please provide an answer" : ""
                  }
                  id={obj.key}
                  type="number"
                  fullWidth
                  label="Age"
                  sx={{ mt: 1 }}
                  value={formData.age}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      [obj.key]: e.target.value,
                    }));
                  }}
                />
              </div>
            ) : (
              <FormControl fullWidth sx={{ marginTop: 2 }}>
                <FormLabel>{`Question ${i + 1}) ${obj.q}?`}</FormLabel>
                <Autocomplete
                  id={obj.key}
                  options={obj.options}
                  renderInput={(params) => (
                    <TextField
                      error={error === obj.key}
                      helperText={
                        error === obj.key ? "Please Select an option" : ""
                      }
                      {...params}
                      label="Country"
                    />
                  )}
                  onChange={(e, newValue) => {
                    setFormData((prev) => ({
                      ...prev,
                      [obj.key]: newValue.label,
                    }));
                  }}
                />
              </FormControl>
            )}
            {/* {i < data.length - 1 && (
              <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
            )} */}
          </div>
        );
      })}
      <LoadingButton
        loading={loading}
        variant="contained"
        fullWidth
        sx={{ marginTop: 2 }}
        onClick={submit}
      >
        Submit
      </LoadingButton>
      <SupportFooter />
    </div>
  );
};

export default DemographicN;
