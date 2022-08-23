import Vue from "vue";
import Component from "vue-class-component";

const map: { [key: string]: string } = {
  "tag name duplicated": "标签名重复了QAQ",
};
@Component
export class TagHelper extends Vue {
  createTag() {
    this.$prompt("请输入标签名", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      customClass: "msgBox",
    })
      .then(({ value }) => {
        const name = value;

        if (name === null) {
          return window.alert("标签名不能为空");
        }
        if (this.$store.state.createTagError) {
          return window.alert(
            map[this.$store.state.createTagError.message] || "未知错误"
          );
        }
        this.$store.commit("createTag", name);
        window.alert("新建标签成功^^");
      })
      .catch(() => {});
  }
}
export default TagHelper;
