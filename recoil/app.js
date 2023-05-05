import { atom, selector } from "recoil";
import { answers } from "../constants/results";
const challenges = [1, 2, 3].map((i) => "challenge" + i); // challenge 1, 2, & 3
const annotations = [1, 2, 3, 4, 5].map((i) => "annotation" + i); // annotation 1, 2, ...

export const userAtom = atom({
  // whether the user is login or not.
  key: "user",
  default: null, // default is the user not log-in yet.
});

export const loggingIn = atom({
  // whether the user is logging in or not.
  key: "loggingIn",
  default: true, // default is the user already loged-in.
});

// export const dailyXP = selector({
//   key: "dailyXP",
//   get: ({ get }) => {
//     let list = get(previousAnnotations);
//     let s = 0;

//     list.forEach((obj) => {
//       let images = obj.get("images");
//       let ans = obj.get("answers");

//       images.forEach((num, index) => {
//         let expected = answers[num] ? "yes" : "no";

//         if (expected === ans[index]) s += 2;
//       });
//     });
//     return s;
//     // return list.filter((obj) => obj.get("success")).length * 10;
//   },
// });

export const dailyXP = atom({
  // we have for XP
  key: "dailyXP",
  default: 0, // default is 0 and maximum is 30
});

export const userState = selector({
  // this is the user state; we cannot directly change their values.
  key: "userState", // we define its value from other atoms.
  get: ({ get }) => {
    let completed = get(completion); // we read the completion atom

    if (annotations.every((k) => completed[k])) return "done"; // If all anntotations completed, it is done.
    if (challenges.every((k) => completed[k])) return "annotation"; // If all challenges completed, go to annotation.
    if (completed.challenge1) return "challenge"; // If challenge 1 is completed, do not go to shortcut and return to
    // the rest of the chanllenges 2 or 3
    return "init"; // If there is nothing, just starts from the beginning.
  },
});

export const unseenImages = atom({
  // images that have not seen by the user yet
  key: "unseenImages",
  default: Array.from(new Array(50)).map((_, i) => i + 1), // [1 to 50]
});

export const previousAnnotations = atom({
  key: "previousAnnotations",
  default: [],
});

export const badgesAtom = atom({
  key: "badgesAtom",
  default: 0,
});

export const completion = atom({
  // Which level is completed
  key: "completion",
  default: {
    // default is no level completed.
    challenge1: false,
    challenge2: false,
    challenge3: false,
    annotation1: false,
    annotation2: false,
    annotation3: false,
    annotation4: false,
    annotation5: false,
    shortcut: false,
  },
});

export const annotationImagesAtom = atom({
  // These are the annotation images
  key: "annotationImagesAtom",
  default: [], // for example image [37]
});

export const annotationAnswersAtom = atom({
  // These are the annotation answers
  key: "annotationAnswersAtom",
  default: [], // for example the answer for image 37 is ["yes"]
});

export const popupOpen = atom({
  key: "popupOpen",
  default: false,
});
