import { ButtonProps } from "../../type/props";

export const Button = (props: ButtonProps) => {
  const { onClick, className, children, ...rest } = props;

  return (
    <button className={className} onClick={onClick} {...rest}>
      {children}
    </button>
  );
};
