<template>
    <div class="preloader">
        <img src="../assets/logo.png" alt="preloader">
        <p>Загрузка</p>
    </div>
</template>

<script>
    export default {
        name: "preloader"
    }
</script>

<style scoped lang="sass">
    @keyframes preloader
        0%
            transform: rotateZ(0deg)
        100%
            transform: rotateZ(360deg)
    .preloader
        img
            transition: all .5s linear
            animation: preloader 2s infinite linear
            height: 50px

</style>