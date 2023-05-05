/* eslint-disable @next/next/no-img-element */
import { Divider, Typography } from "@mui/material";
import ImageView from "../ImageView";
import styles from "./Instructions.module.scss";

const Instructions = () => {
  return (
    <div className={styles.container}>
      <Typography align="center" variant="h3">
        Instruction for Image Task
      </Typography>
      <Divider style={{ background: "#965E98", height: 7, borderRadius: 3 }} />
      <Typography style={{ marginTop: 24}}>
      In this task, you will see two images:
      <br/>
      <Typography style={{marginLeft: 20}}>
      1. On the left, an image with a blue box on it
      <br/>
      2.	On the right, a zoomed-in version of content of the blue box 
      </Typography>
      You should tell us whether the blue box contains a car or a part of a car.
      </Typography>
      <br />
      <hr />

      <br />
      <br />
      <Typography>
      <b>Example 1:</b>
      </Typography>
      <div className={styles.imageBox}>
        <ImageView
          imageNumber={52}
          fractionName={"52-correct"}
          path="/Images/Instruction"
        />
      </div>
      <Typography>
      In this example, the blue box <b>contains</b> the front part of a car as shown below:
      </Typography>
      <br />      
      <div className={styles.main}>
        <div>
          <div>
            <img
              style={{
                maxWidth: "auto",
                maxHeight: "100%",
              }}
              src={`/Images/Instruction/52-correct-green.jpg`}
              alt=""
            />
          </div>
        </div>
      </div>
      <Typography>
        So, the correct answer is <b>&quot;Yes&quot;</b>.
      </Typography>
      <hr />

      <br />
      <Typography>
      <b>Example 2:</b>
      </Typography>
      <br />
      <div className={styles.imageBox}>
        <ImageView
          imageNumber={51}
          fractionName={"51-wrong"}
          path="/Images/Instruction"
        />
      </div>
      <Typography>
      In this example, the blue box <b>does not have</b> any car or part of a car in it:
      </Typography>
      <br />
      <div className={styles.main}>
        <div>
          <div>
            <img
              style={{
                maxWidth: "auto",
                maxHeight: "100%",
              }}
              src={`/Images/Instruction/51-wrong-green.jpg`}
              alt=""
            />
          </div>
        </div>
      </div>
      <Typography>
        So, the correct answer is <b>&quot;No&quot;</b>.
      </Typography>

      {/* <div className={styles.main}>
        <div>
          <div>
            <img
              style={{
                maxWidth: "auto",
                maxHeight: "100%",
              }}
              src={`/Images/Instruction/51-wrong-green.jpg`}
              alt=""
            />
          </div>
        </div>
        <div>
          <Typography>The wrong answer is &quot;Yes&quot;</Typography>
          <div>
            <img
              style={{
                maxWidth: "auto",
                maxHeight: "100%",
              }}
              src={`/Images/Instruction/51-wrong-red.jpg`}
              alt=""
            />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Instructions;
