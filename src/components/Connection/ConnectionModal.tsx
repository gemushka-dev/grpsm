import { ConnectionModalProps } from "../../type/props";
import "../../styles/connection.css";
import { ConnectionForm } from "./ConnectionForm";
import { memo } from "react";

export const ConnectionModal = memo((props: ConnectionModalProps) => {
  const { setConnections, setIsVisible } = props;
  return (
    <div className="move">
      <span className="close" onClick={() => setIsVisible(false)}>
        <i className="ri-close-large-line"></i>
      </span>
      <ConnectionForm setConnections={setConnections}></ConnectionForm>
    </div>
  );
});
