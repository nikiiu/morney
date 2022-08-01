<template>
        <ul class="types">
            <li :class="type === '-' && 'selected'" 
                @click="selectType('-')">支出</li>
            <li :class="type === '+' && 'selected'" 
                @click="selectType('+')">收入</li>
        </ul>
</template>

<script>
    export default {
        name: 'Types',
        props: ['xxx'],
        data() {
            return{
                type:'-' // '-'表示收入， '+'表示支出
            }
        },
        mounted() {
            console.log(this.xxx)
        },
        methods: {
            selectType(type) { //type只能是+或-
                if(type !== '-' && type !== '+'){
                    throw new Error('type is unknown')
                }
                this.type = type
            }
        }
    }
</script>

<style lang="scss" scoped>
 .types{
    background: #c4c4c4;
    display: flex;
    text-align: center;
    font-size: 24px;
    > li {
        width: 50%;
        height: 64px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        &.selected::after{//当前li被选中
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: #333;
        }
    }
  }
</style>