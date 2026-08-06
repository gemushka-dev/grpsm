import { FormFieldProps } from "../../type/props";

export const FormField = (props: FormFieldProps) => {
  const { type = "text", id, value, onChange, children } = props;

  return (
    <>
      <label htmlFor={id}>{children}</label>
      <input
        type={type}
        id={id}
        className="move-input"
        value={value}
        onChange={onChange}
      />
    </>
  );
};
