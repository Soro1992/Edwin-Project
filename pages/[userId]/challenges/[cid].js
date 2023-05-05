import { useRecoilValue } from "recoil";
import ChallengeG from "../../../PageComponents/gamified/ChallengePageG";
import ChallengeN from "../../../PageComponents/normal/ChallengePageN";
import { userAtom } from "../../../recoil/app";

const Challenge = () => {
  const currentUser = useRecoilValue(userAtom);

  if (currentUser.appVersion === "gamified") return <ChallengeG />;
  if (currentUser.appVersion === "normal") return <ChallengeN />;
  return null;
};

export default Challenge;
