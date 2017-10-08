<template>
    <div class="search">
        <div class="search-box-wrapper">
            <search-box ref="searchBox" @query="onQuertChange"></search-box>
        </div>
        <div class="hot-search" v-show="!query" ref="hotSearch">
            <p>热门搜索</p>
            <ul class="hot-list clearFix">
                <li v-for="item in hotKey" @click="addQuery(item.k)">{{item.k}}</li>
            </ul>
        </div>
        <div class="search-result" v-show="query" ref="searchResult">
            <suggest ref="suggest" :query="query" @listScroll="blurInput"></suggest>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
import SearchBox from 'base/search-box'
import { getHotKey } from '@/api/search'
import { ERR_OK } from '@/api/config'
import Suggest from 'components/suggest/suggest'
import {playlistMixin} from 'common/js/mixin'

export default {
    mixins: [playlistMixin],
    name: 'search',
    data: function() {	
        return {
            hotKey: [],
            query: ''
        }
    },
    created() {
        this._getHotKey()
    },
    methods: {
        handlePlaylist(playlist) {
            const bottom = playlist.length > 0 ? '60px' : ""
            this.$refs.searchResult.style.bottom = bottom
            this.$refs.suggest.refresh()
        },
        addQuery(query) {
            this.$refs.searchBox.setQuery(query)
        },
        onQuertChange(query) {
            this.query = query  
        },
        blurInput() {
            this.$refs.searchBox.blur()
        },
        _getHotKey() {
            getHotKey().then((res) => {
                if (res.code === ERR_OK) {
                    this.hotKey = res.data.hotkey.slice(0,10);
                }
            })
        }
    },
    components: {
        SearchBox,
        Suggest
    }
}
</script>

<style scoped>
.search {
    position: fixed;
    width: 100%;
    top: .94rem;
    bottom: 0;
    background: linear-gradient(
        to bottom,#6e3b4a 0,#5f3546 25%,#603546 45%,#5a3344 60%,#4a2c3f 75%,#42293e 100%);
    color: #fff;
}
.search-box-wrapper {
    margin: 0.2rem .3rem 0;
}
.hot-search {
    margin-top: .48rem;
    font-size: .24rem;
    padding: 0 .3rem;
}
.hot-list {
    width: 100%;
    margin-top: .38rem;
}
.hot-list li {
    float: left;
    padding: 0 .24rem;
    margin: 0 .2rem .2rem 0;
    line-height: .56rem;
    border: 1px solid #fb81b8;
    border-radius: 8%;
}
.search-result {
    position: fixed;
    width: 100%;
    top: 2rem;
    bottom: 0;
}
</style>