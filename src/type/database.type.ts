export type ColumnInfo = {
  table_name: string;
  column_name: string;
  data_type: string;
};

export type ConstraintInfo = {
  table_name: string;
  constraint_name: string;
  constraint_type: string;
  constraint_definition: string;
};
