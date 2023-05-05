import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useSnackbar } from "notistack";

export const questions = [
  { id: 1, text: "I enjoyed doing this activity very much." },
  { id: 2, text: "This activity was fun to do." },
  {
    id: 3,
    text: ["I thought this was a ", <b key="1">boring</b>, " activity."],
  },
  {
    id: 4,
    text: [
      "This activity ",
      <b key="1">did not hold</b>,
      " my attention at all.",
    ],
  },
  { id: 5, text: "I would describe this activity as very interesting." },
  { id: 6, text: "I thought this activity was quite enjoyable." },
  {
    id: 7,
    text: "While I was doing this activity, I was thinking about how much I enjoyed it.",
  },
];

const options = [
  "Strongly Agree",
  "Agree",
  "Somewhat Agree",
  "Neither",
  "Somewhat Disagree",
  "Disagree",
  "Strongly Disagree",
];

/**
 *
 * @param {[*]} array
 */
const shuffle = (array) => {
  return array
    .map((x) => ({ value: x, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((x) => x.value);
};

const MotivationG = ({ setStep, motivation, setMotivation }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [error, setError] = useState(null);

  const submit = useCallback(() => {
    let missing = questions.map((_, i) => motivation[i]).findIndex((d) => !d);
    let valid = missing === -1;

    if (valid) {
      setStep((s) => s + 1);
    } else {
      setError(missing);
      enqueueSnackbar("Please provide an answer to all questions", {
        variant: "warning",
      });
    }
  }, [enqueueSnackbar, motivation, setStep]);

  const shuffled = useMemo(() => {
    return shuffle(questions);
  }, []);

  return (
    <div
      style={{
        padding: "5em",
        height: "90vh",
        overflowY: "scroll",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* <TopBar title="Player Type Questionaire" /> */}
      <div>
        <Typography fontSize="1.25em">
          To what extent do you agree or disagree with each of the following
          statements?
        </Typography>
        <Typography variant="subtitle1">
          Please select one answer per row
        </Typography>
        <br />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "5fr repeat(7, 1.5fr)",
            alignItems: "center",
            background: "lightgray",
            padding: "4px 4px 4px 8px",
            justifyItems: "center",
          }}
        >
          <Typography>Question</Typography>
          {options.map((op) => (
            <Typography
              key={op}
              variant="subtitle1"
              fontSize={"0.875em"}
              textAlign="center"
            >
              {op}
            </Typography>
          ))}
        </div>
        {shuffled.map((q, i) => {
          return (
            <FormControl
              key={i}
              error={error === i}
              style={{
                width: "100%",
              }}
            >
              <RadioGroup
                onChange={(e) => {
                  setMotivation((prev) =>
                    prev.map((item, j) => {
                      if (j === i) return { id: q.id, answer: e.target.value };
                      else return item;
                    })
                  );
                }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "5fr repeat(7, 1.5fr)",
                  alignItems: "center",
                  background: i % 2 === 0 ? "white" : "lightgray",
                  padding: "4px 4px 4px 8px",
                  justifyItems: "center",
                }}
              >
                <FormLabel style={{ justifySelf: "start" }}>{q.text}</FormLabel>
                {/* <div style={{ justifySelf: "start" }}>{q}</div> */}
                {/* <RadioGroup> */}
                {options.map((op) => (
                  <div
                    key={op}
                    style={{
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    <FormControlLabel
                      value={op}
                      control={<Radio />}
                      style={{ margin: 0 }}
                    />
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
          );
        })}
      </div>
      <Button variant="contained" sx={{ marginTop: 2 }} onClick={submit}>
        Continue
      </Button>
    </div>
  );
};

export default MotivationG;
