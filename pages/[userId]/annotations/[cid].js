import { useRecoilValue } from "recoil";
import AnnotationPageG from "../../../PageComponents/gamified/AnnotationPageG";
import AnnotationPageN from "../../../PageComponents/normal/AnnotationPageN";
import { userAtom } from "../../../recoil/app";

const Questionaire = () => {
  const currentUser = useRecoilValue(userAtom);

  if (currentUser.appVersion === "gamified") return <AnnotationPageG />;
  if (currentUser.appVersion === "normal") return <AnnotationPageN />;
  return null;
};

export default Questionaire;
