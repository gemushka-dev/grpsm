import { MetaDataSectionProps } from "../../type/props";

export const MetaDataSection = (props: MetaDataSectionProps) => {
  const { title, items, emptyText } = props;

  return (
    <details>
      <summary>{title}</summary>

      {items.length > 0 ? (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.label}
              {item.badge && <small>({item.badge})</small>}
            </li>
          ))}
        </ul>
      ) : (
        <div>{emptyText}</div>
      )}
    </details>
  );
};
