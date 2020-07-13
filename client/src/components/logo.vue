<template>
    <img :src="logo" alt="logo">
</template>

<script>
    import logo from '../assets/logo.png'
    export default {
        name: "logo",
        data:()=>({
            logo,
        })
    }
</script>

<style scoped lang="sass">
img
    height: 30px
</style>