import clone from "@/lib/clone";

const recordStore = {
  recordList: [] as RecordItem[],

  createRecord(record: RecordItem) {
    const record2: RecordItem = clone(record);
    record2.createAt = new Date();
    this.recordList?.push(record2);
    recordStore.saveRecords();
  },
};
recordStore.fetchRecords();

export default recordStore;
