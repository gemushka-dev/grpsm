export type Result =
  | {
      type: "select";
      data: Record<string, any>[];
      columns: string[];
    }
  | {
      type: "mutation";
      rows_affected: string;
    };
