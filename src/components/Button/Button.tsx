import { ButtonProps } from "../../type/props";

export const Button = (props: ButtonProps) => {
  const { onClick, className, text, ...rest } = props;

  return (
    <button className={className} onClick={onClick} {...rest}>
      {text}
    </button>
  );
};
