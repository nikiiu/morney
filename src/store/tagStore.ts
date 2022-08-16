import createId from "@/lib/createId";

const localStorageKeyName = "tagList";

const tagStore = {
  tagList: [] as Tag[],

  removeTag(id: string) {
    let index = -1;
    for (let i = 0; i < this.tagList.length; i++) {
      if (this.tagList[i].id === id) {
        index = i;
        break;
      }
    }
    this.tagList.splice(index, 1);
    tagStore.saveTags();
    return true;
  },
};
tagStore.fetchTags();
export default tagStore;
