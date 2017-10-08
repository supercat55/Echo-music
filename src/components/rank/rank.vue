<template>
    <div class="rank" ref="rank">
        <scroll class="toplist" :data="topList" ref="ranklist">
            <ul class="itemlist">
                <li class="item" v-for="item in topList" @click="selectItem(item)">
                    <div class="img">
                        <img v-lazy="item.picUrl"/>
                    </div>
                    <div class="title">{{item.topTitle}}</div>
                    <ul class="songlist">
                        <li class="song" v-for="(song,index) in item.songList">
                            <span>{{index + 1}}</span>
                            <span>{{song.songname}} - {{song.singername}}</span>
                        </li>
                    </ul>
                </li> 
            </ul>
            <div class="loding-container" v-show="!topList.length">
                <loading></loading>
            </div>
        </scroll>
        <router-view></router-view>
    </div>
</template>

<script>
import { getTopList } from '@/api/rank'
import { ERR_OK } from '@/api/config'
import Scroll from 'base/scroll'
import Loading from 'base/loading/loading'
import { playlistMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'

export default {
    mixins:[playlistMixin],
    name: 'rank',
    data() {
        return {
            topList: []
        }
    },
    created() {
        this._getTopList()
    },
    methods: {
        handlePlaylist(playlist) {
            const bottom = playlist.length > 0 ? '60px' : ''
            this.$refs.rank.style.bottom = bottom
            this.$refs.ranklist.refresh()
        },
        selectItem(item) {
            this.$router.push({
                path: `/rank/${item.id}`
            })
            this.setTopList(item)
            console.log(item);
        },
        _getTopList() {
            getTopList().then((res) => {
                if (res.code == ERR_OK) {
                    this.topList = res.data.topList
                }
            })
        },
        ...mapMutations({
            setTopList: 'SET_TOP_LIST'
        })
    },
    components: {
        Scroll,
        Loading
    }
}
</script>

<style scoped>
.rank {
    position: fixed;
    top: .94rem;
    bottom: 0;
    width: 100%;
    color: #fff;
    /* background: url('../../common/img/rankBg.png') no-repeat #000; */
    background: linear-gradient(
    to bottom,#633747 0,#472c40 19%,#3b273b 60%,#352439 100%);
    /* background: #9f7b84; */
}
.ranktext {
    font-size: .4rem;
    margin-top: .2rem;
    padding-left: .4rem;
    color: #fff;
}
.rank .toplist {
    height: 100%;
    overflow: hidden;
    font-size: .28rem;
}
.rank .toplist .itemlist {
    padding-bottom: .4rem;
}
.rank .item {
    display: flex;
    position: relative;
    margin: .4rem;
    background: #fff;
    border-radius: 2%;
}
.rank .item .img {
    flex: 0 0 2rem;
    width: 2rem;
    height: 2rem;
}
.item .img img {
    width: 100%;
    height: 100%;
}
.rank .item .title {
    position: absolute;
    width: .28rem;
    padding: 0.06rem;
    height: 1.5rem;
    font-size: 12px;
    background: #73777b;
    color: #fff;
    border-radius: 2px;
    top: .15rem;
    left: 1.6rem;
    overflow: hidden;
    text-align: center;
    writing-mode: tb-rl;
}
.rank .songlist {
    flex: 1;
    padding: .2rem .6rem 0;
    flex-direction: column;
    justify-content: center;
    /* background: #8b8e90; */
    height: 1.8rem;
    overflow: hidden;
    color: #343434;
}
.rank .songlist .song {
    line-height: .5rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
.loding-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
}
</style>