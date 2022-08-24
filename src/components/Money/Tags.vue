<template>
  <div class="tags">
    <div class="new">
      <button @click="createTag">新增标签</button>
    </div>
    <ul class="current">
      <li
        v-for="tag in tagList"
        :key="tag.id"
        :class="{ selected: selectedTags.indexOf(tag.name) >= 0 }"
        @click="toggle(tag)"
      >
        {{ tag.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import TagHelper from "@/mixins/TagHelper";
import { mixins } from "vue-class-component";
import { Component } from "vue-property-decorator";

@Component
export default class Tags extends mixins(TagHelper) {
  get tagList() {
    return this.$store.state.tagList;
  }
  selectedTags: string[] = [];
  created() {
    this.$store.commit("fetchTags");
  }
  toggle(tag: Tag) {
    const index = this.selectedTags.indexOf(tag.name);
    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    } else if (this.selectedTags.length != 0) {
      return;
    } else {
      this.selectedTags.push(tag.name);
    }
    this.$emit("update:value", this.selectedTags);
  }
}
</script>
<style>
@media (max-width: 720px) {
  .msgBox {
    width: 320px !important;
  }
}
</style>
<style lang="scss" scoped>
@use "sass:math";

.tags {
  background: rgb(252, 249, 249);
  flex-grow: 1;
  font-size: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column-reverse;
  > .current {
    display: flex;
    flex-wrap: wrap;
    > li {
      $bg: #fceeee;
      background: $bg;
      $h: 24px;
      height: $h;
      line-height: $h;
      border-radius: math.div($h, 2);
      padding: 0 16px;
      margin-right: 12px;
      margin-top: 4px;
      &.selected {
        background: darken($bg, 50%);
        color: white;
      }
    }
  }
  > .new {
    padding-top: 16px;
    button {
      background: transparent;
      color: #999;
      border: none;
      border-bottom: 1px solid;
      padding: 0 4px;
    }
  }
}
</style>
