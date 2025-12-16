export type TabType<T extends object = object> = {
  title: string;
  key: string;
} & T;
