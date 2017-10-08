<template>
    <div class="loading">
        <img src="./loading.gif"/>
        <p class="desc">{{title}}</p>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: "正在载入..."
        }
    },
    name: 'loading'
}
</script>

<style>
    .loading {
        width: 100%;
        text-align: center;
    }
    .loading img {
        width: 10%;
        height: 10%;
    }
    .desc {
        font-size: .4rem;
        line-height: 2.4rem;
        color: #fff;
    }
</style>