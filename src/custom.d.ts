type RecordItem = {
  tags: Tag[];
  notes: string;
  type: string;
  amount: number;
  createAt?: string;
};
type Tag = {
  id: string;
  name: string;
};
type TagListModel = {
  data: Tag[];
  fetch: () => Tag[];
  create: (name: string) => "success" | "duplicated";
  update: (name: string, id: string) => "success" | "not found" | "duplicated";
  remove: (id: string) => boolean;
  save: () => void;
};
type RootState = {
  recordList: RecordItem[];
  createRecordError?: Error | null;
  createTagError: Error | null;
  tagList: Tag[];
  currentTag?: Tag;
};
interface Window {}
