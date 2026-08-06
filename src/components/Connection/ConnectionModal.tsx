import { Connection } from "../../type/connection.type";
import "../styles/connection.css";
import { ConnectionForm } from "./ConnectionForm";

type ConnectionProps = {
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
  setIsVisible: (visible: boolean) => void;
};

export const ConnectionModal = ({
  setConnections,
  setIsVisible,
}: ConnectionProps) => {
  return (
    <div className="move">
      <span className="close" onClick={() => setIsVisible(false)}>
        <i className="ri-close-large-line"></i>
      </span>
      <ConnectionForm setConnections={setConnections}></ConnectionForm>
    </div>
  );
};
