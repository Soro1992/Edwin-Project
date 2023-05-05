import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { unseenImages } from "../recoil/app";

export const useRandomImage = () => {
  const [unseen, setUnseen] = useRecoilState(unseenImages);
  const resetUnseen = useResetRecoilState(unseenImages);
  const [imageNumber, setImageNumber] = useState(null);

  useEffect(() => {
    if (imageNumber) return;
    getRandomImage();
  }, [getRandomImage, imageNumber]);

  useEffect(() => {
    if (imageNumber) {
      setUnseen((prev) => prev.filter((v) => v !== imageNumber));
    }
  }, [setUnseen, imageNumber]);

  useEffect(() => {
    if (unseen.length === 0) {
      resetUnseen();
    }
  }, [resetUnseen, unseen.length]);

  const getRandomImage = useCallback(() => {
    let index = Math.floor(Math.random() * unseen.length);
    setImageNumber(unseen[index]);
  }, [unseen]);

  return [imageNumber, getRandomImage];
};
