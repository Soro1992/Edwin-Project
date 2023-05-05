import { useRecoilValue } from "recoil";
import FinishPageG from "../../../PageComponents/gamified/FinishPageG";
import FinishPageN from "../../../PageComponents/normal/FinishPageN";
import { userAtom } from "../../../recoil/app";

const Questionaire = () => {
  const currentUser = useRecoilValue(userAtom);

  if (currentUser.appVersion === "gamified") return <FinishPageG />;
  if (currentUser.appVersion === "normal") return <FinishPageN />;
  return null;
};

export default Questionaire;
