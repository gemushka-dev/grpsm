import "../styles/header.css";
export const Header = () => {
  return (
    <header className="header">
      <h3 className="header-logo">grpsm</h3>
      <ul className="header-list">
        <li className="list-item">
          <button className="item-connection">➕</button>
        </li>
        <li className="list-item">
          <button className="item-start">⏩</button>
        </li>
      </ul>
    </header>
  );
};
