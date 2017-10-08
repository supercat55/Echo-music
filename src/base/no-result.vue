<template>
    <div class="no-result">
        <p class="no-result-text" v-html="title"></p>
    </div>
</template>

<script>
export default {
    name: 'no-result',
    props: {
        title: {
            type: String,
            default: ''
        }
    },
    methods: {}
}
</script>

<style scoped>
.no-result {
    text-align: center;
}
.no-result-text {
    font-size: .3rem;
}
</style>