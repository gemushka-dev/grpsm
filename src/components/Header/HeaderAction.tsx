import { HeaderActionProps } from "../../type/props";
import { Button } from "../Button/Button";

export const HeaderAction = (props: HeaderActionProps) => {
  const { items, className } = props;

  return (
    <ul className={className}>
      {items.map((item) => (
        <li key={item.id} className="list-item">
          <Button
            text={<i className={item.iconClass}></i>}
            className={item.className}
            onClick={item.onClick}
          ></Button>
        </li>
      ))}
    </ul>
  );
};
