import { useRecoilValue } from "recoil";
import DemographicG from "../../../PageComponents/gamified/DemographicPageG";
import DemographicN from "../../../PageComponents/normal/DemographicPageN";
import { userAtom } from "../../../recoil/app";

const Questionaire = () => {
  const currentUser = useRecoilValue(userAtom);

  if (currentUser.appVersion === "gamified") return <DemographicG />;
  if (currentUser.appVersion === "normal") return <DemographicN />;
  return null;
};

export default Questionaire;
