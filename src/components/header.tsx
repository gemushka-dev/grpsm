import "../styles/header.css";

type HeaderProps = {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
};

export const Header = ({ isVisible, setIsVisible }: HeaderProps) => {
  return (
    <header className="header">
      <h3 className="header-logo">grpsm</h3>
      <ul className="header-list">
        <li className="list-item">
          <button
            className="item-connection"
            onClick={() => setIsVisible(!isVisible)}
          >
            ➕
          </button>
        </li>
        <li className="list-item">
          <button className="item-start">⏩</button>
        </li>
      </ul>
    </header>
  );
};
