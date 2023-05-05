import { useRecoilValue } from "recoil";
import ResultPageG from "../../../PageComponents/gamified/ResultPageG";
import ResultPageN from "../../../PageComponents/normal/ResultPageN";
import { userAtom } from "../../../recoil/app";

const Questionaire = () => {
  const currentUser = useRecoilValue(userAtom);

  if (currentUser.appVersion === "gamified") return <ResultPageG />;
  if (currentUser.appVersion === "normal") return <ResultPageN />;
  return null;
};

export default Questionaire;
