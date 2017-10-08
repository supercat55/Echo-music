<template>
    <div class="tab">
        <router-link tag="div" to="/user" class="p-center"></router-link>
        <nav>
            <router-link tag="div" to="/recommend">
                <span class="tab-link">推荐</span>
            </router-link>
            <router-link tag="div" to="/singer">
                <span class="tab-link">歌手</span>
            </router-link>
            <router-link tag="div" to="/rank">
                <span class="tab-link">排行</span>
            </router-link>
        </nav>
        <router-link tag="div" to="/search" class="search-link"></router-link>
    </div> 
</template>

<script>
export default {
    name: 'tab',
    data: function() {	
        return {}
    },
    methods: {}
}
</script>

<style>
.tab nav .router-link-active {
    color: #fff;
    border-bottom: 2px solid #fff;
}
.tab {
    display: flex;
    height: .94rem;
    font-size: .30rem;
    line-height: .94rem;
    background: #633646;
}
.tab .p-center {
    flex: 1;
    background: url('../../common/img/p-center.png') no-repeat .4rem .3rem;
    background-size: .34rem .34rem;
}
.tab nav {
    flex: 5;
    display: flex;
}
.tab nav div {
    flex: 1;
    text-align: center;
    margin: 0 .35rem;
    text-align: center;
    color: rgba(255, 255, 255, .5);
    letter-spacing: 2px;
    box-sizing: border-box;
}
.tab .tab-link {
    display: block;
    padding-bottom: 0.05rem;
}
.tab .search-link {
    flex: 1;
    background: url('../../common/img/search.png') no-repeat 0.3rem .3rem;
    background-size: .34rem .34rem;
}
</style>