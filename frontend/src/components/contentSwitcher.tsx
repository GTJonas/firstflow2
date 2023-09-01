import ContentSwitcher from "./contentSwitcher";
import Scrollbar from "./Scrollbar";
import "./Style-modules/contentWrapper-style-module.css";

function ContentWrapper({ user }: { user: any }) {
  return (
    <div className="ContentWrapper">
      <Scrollbar />
      <ContentSwitcher user={user} />
    </div>
  );
}

export default ContentWrapper;
