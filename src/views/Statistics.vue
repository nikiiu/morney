<template>
  <Layout>
    <Tabs
      class-prefix="type"
      :data-source="recordTypeList"
      :value.sync="type"
    />
    <Tabs
      class-prefix="interval"
      :data-source="intervalList"
      :value.sync="interval"
    />
    <div class="chart-wrapper" ref="chartWrapper">
      <Chart
        class="chart"
        :options="chartOptions"
        :class="[my ? 'shortClass' : 'longClass']"
      />
    </div>
    <ol v-if="groupedList.length > 0">
      <li v-for="(group, index) in groupedList" :key="index">
        <h3 class="title">
          {{ beautify(group.title) }}
          <span>￥{{ group.total }}</span>
        </h3>
        <ol>
          <li v-for="item in group.items" :key="item.createAt" class="record">
            <span>{{ tagString(item.tags) }}</span>
            <span class="notes">{{ item.notes }}</span>
            <span>￥{{ item.amount }} </span>
          </li>
        </ol>
      </li>
    </ol>
    <div v-else class="noResult">目前没有相关记录</div>
  </Layout>
</template>
<script lang="ts">
import recordTypeList from "@/constants/recordTypeList";
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import Tabs from "../components/Tabs.vue";
import dayjs from "dayjs";
import clone from "@/lib/clone";
import Chart from "@/components/Chart.vue";
import _ from "lodash";
import day from "dayjs";
import intervalList from "@/constants/intervalList";

const oneDay = 86400 * 1000;
@Component({
  components: { Tabs, Chart },
})
export default class Statistics extends Vue {
  my = false;
  @Watch("interval", { immediate: true, deep: true })
  onWidthChanged(val: string, oldVal: string) {
    const widthMap: { [key: string]: boolean } = {
      week: true,
      month: false,
      year: true,
    };
    this.my = widthMap[this.interval];
  }

  mounted() {
    const div = this.$refs.chartWrapper as HTMLDivElement;

    div.scrollLeft = div.scrollWidth;
  }
  beautify(string: string) {
    const day = dayjs(string);
    const now = dayjs();
    if (day.isSame(now, "day")) {
      return "今天";
    } else if (day.isSame(now.valueOf() - oneDay, "day")) {
      return "昨天";
    } else if (day.isSame(now.subtract(2, "day"), "day")) {
      return "前天";
    } else if (day.isSame(now, "year")) {
      return day.format("M月D日");
    } else {
      return day.format("YYYY年M月D日");
    }
  }
  tagString(tags: Tag[]) {
    return tags.length === 0 ? "无" : tags.join("，");
  }
  get keyValueList() {
    const intervalMap: { [key: string]: number } = {
      week: 6,
      month: 28,
      year: 11,
    };
    const today = new Date();
    const array = [];
    if (this.interval != "year") {
      for (let i = 0; i <= intervalMap[this.interval]; i++) {
        const dateString = day(today).subtract(i, "day").format("YYYY-MM-DD");
        const found = _.find(this.groupedList, { title: dateString });

        array.push({
          key: dateString,
          value: found ? found.total : 0,
        });
      }
      array.sort((a, b) => {
        if (a.key > b.key) {
          return 1;
        } else if (a.key === b.key) {
          return 0;
        } else {
          return -1;
        }
      });
      return array;
    } else {
      for (let i = 0; i <= intervalMap[this.interval]; i++) {
        const monthString = day(today).subtract(i, "month").format("YYYY-MM");
        const found = _.find(this.groupedYearList, { title: monthString });

        array.push({
          key: monthString.substring(0, 7).concat("月"),
          value: found ? found.total : 0,
        });
      }
      array.sort((a, b) => {
        if (a.key > b.key) {
          return 1;
        } else if (a.key === b.key) {
          return 0;
        } else {
          return -1;
        }
      });
      return array;
    }
  }
  get chartOptions() {
    const interval = this.interval;
    const keys = this.keyValueList.map((item) => item.key);
    const values = this.keyValueList.map((item) => item.value);
    return {
      grid: {
        left: 0,
        right: 0,
      },
      xAxis: {
        type: "category",
        data: keys,
        axisTick: { show: false, alignWithLabel: true },
        axisLine: { lineStyle: { color: "#666" } },
        interval: 0,
        axisLabel: {
          formatter: function (value: string) {
            const intervalMap: { [key: string]: number[] } = {
              week: [5, 10],
              month: [8, 10],
              year: [5, 8],
            };
            return value.substring(
              intervalMap[interval][0],
              intervalMap[interval][1]
            );
          },
        },
      },
      yAxis: {
        type: "value",
        show: false,
      },
      series: [
        {
          symbolSize: 10,
          itemStyle: { borderWidth: 0.8, color: "#666", borderColor: "#666" },
          data: values,
          type: "line",
        },
      ],
      tooltip: {
        show: true,
        confine: true,
        position: "top",
        triggerOn: "click",
        formatter: "{b}:{c}",
      },
    };
  }
  get recordList() {
    return this.$store.state.recordList;
  }

  get groupedYearList() {
    const { recordList } = this;

    const newList = clone(recordList)
      .filter((r: { type: string }) => r.type === this.type)
      .sort(
        (
          a: {
            createAt: string | number | Date | dayjs.Dayjs | null | undefined;
          },
          b: {
            createAt: string | number | Date | dayjs.Dayjs | null | undefined;
          }
        ) => dayjs(b.createAt).valueOf() - dayjs(a.createAt).valueOf()
      );
    if (newList.length === 0) {
      return [];
    }
    type Result = { title: string; total?: string; items: RecordItem[] }[];

    const result: Result = [
      {
        title: dayjs(newList[0].createAt).format("YYYY-MM"),
        items: [newList[0]],
      },
    ];
    for (let i = 1; i < newList.length; i++) {
      const current = newList[i];
      const last = result[result.length - 1];
      if (dayjs(last.title).isSame(dayjs(current.createAt), "month")) {
        last.items.push(current);
      } else {
        result.push({
          title: dayjs(current.createAt).format("YYYY-MM"),
          items: [current],
        });
      }
    }
    result.map((group) => {
      group.total = group.items
        .reduce((sum, item) => sum + item.amount, 0)
        .toFixed(2);
    });
    return result;
  }

  get groupedList() {
    const { recordList } = this;

    const newList = clone(recordList)
      .filter((r: { type: string }) => r.type === this.type)
      .sort(
        (
          a: {
            createAt: string | number | Date | dayjs.Dayjs | null | undefined;
          },
          b: {
            createAt: string | number | Date | dayjs.Dayjs | null | undefined;
          }
        ) => dayjs(b.createAt).valueOf() - dayjs(a.createAt).valueOf()
      );
    if (newList.length === 0) {
      return [];
    }
    type Result = { title: string; total?: string; items: RecordItem[] }[];

    const result: Result = [
      {
        title: dayjs(newList[0].createAt).format("YYYY-MM-DD"),
        items: [newList[0]],
      },
    ];
    for (let i = 1; i < newList.length; i++) {
      const current = newList[i];
      const last = result[result.length - 1];
      if (dayjs(last.title).isSame(dayjs(current.createAt), "month")) {
        last.items.push(current);
      } else {
        result.push({
          title: dayjs(current.createAt).format("YYYY-MM-DD"),
          items: [current],
        });
      }
    }
    result.map((group) => {
      group.total = group.items
        .reduce((sum, item) => sum + item.amount, 0)
        .toFixed(2);
    });

    return result;
  }
  beforeCreate() {
    this.$store.commit("fetchRecords");
  }
  type = "+";
  recordTypeList = recordTypeList;
  interval = "month";
  intervalList = intervalList;
}
</script>
<style scoped lang="scss">
.noResult {
  padding: 16px;
  text-align: center;
}
::v-deep {
  .type-tabs-item {
    background: #f6cbcb;

    &.selected {
      background: rgb(252, 249, 249);
      &::after {
        display: none;
      }
    }
  }
  .interval-tabs-item {
    height: 48px;
  }
}
%item {
  padding: 8px 16px;
  line-height: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title {
  @extend %item;
}
.record {
  @extend %item;
  background: rgb(252, 249, 249);
}
.notes {
  margin-right: auto;
  margin-left: 16px;
  color: #999;
}
.chart {
  &-wrapper {
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
.shortClass {
  width: 100%;
}
.longClass {
  width: 430%;
}
</style>
