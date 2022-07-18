<template>
    <svg class="icon">
        <use v-bind:xlink:href="'#'+name"/>
    </svg>
</template>

<script lang="ts">
// import一个目录,context()是指定要去哪个目录搜索
    let importAll = (requireContext:__WebpackModuleApi.RequireContext) => requireContext.keys().forEach(requireContext)
    try{importAll(require.context('../assets/icons',true,/\.svg$/));}catch(error){console.log(error);}
    export default {
        props: ['name'],
        name: 'Icon'
    }
</script>

<style lang="scss" scoped>
    .icon{
        width: 1em; //1em是一个字
        height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
    }
</style>