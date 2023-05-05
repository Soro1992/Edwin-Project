import Image from "next/image";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { badgesAtom, previousAnnotations, userAtom } from "../../recoil/app";
import styles from "./NewBadges.module.scss";

const NewBadges = () => {
  // const prevAnnotations = useRecoilValue(previousAnnotations);

  const currentUser = useRecoilValue(userAtom);

  const successful = useRecoilValue(badgesAtom);

  return (
    <div className={styles.container}>
      {currentUser &&
        ["Bronze", "Silver", "Gold"].map((text, index) => {
          let src;
          if (successful >= index + 1) {
            src = `/Images/Badges/${text}.png`;
          } else {
            src = `/Images/Badges/${text}-silhouette.png`;
          }
          return (
            <div key={text} className={styles.badgeBox}>
              <Image src={src} alt={text} layout="fill" objectFit="contain" />
            </div>
          );
        })}
    </div>
  );
};

export default NewBadges;
