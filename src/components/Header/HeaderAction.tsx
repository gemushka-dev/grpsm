import { HeaderActionProps } from "../../type/props";
import { Button } from "../Button/Button";

export const HeaderAction = (props: HeaderActionProps) => {
  const { items, className } = props;

  return (
    <ul className={className}>
      {items.map((item) => (
        <li key={item.id} className="list-item">
          <Button className={item.className} onClick={item.onClick}>
            <i className={item.iconClass}></i>
          </Button>
        </li>
      ))}
    </ul>
  );
};
