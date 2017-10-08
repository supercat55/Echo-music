<template>
    <div class="music-list">
        <div class="bg-image" :style="bgStyle" ref="bgimg">
            <div class="play-wrapper">
                <div class="play" v-show="songs.length>0" ref="playBtn" @click="random">
                    <i class="icon-play"></i>
                    <span class="text">随机播放全部</span>
                </div>
            </div>
            <div class="filter" ref="filter"></div>
        </div>
        <div class="back" @click="back"></div>
        <h1 class="title" v-html="title"></h1>
        <div class="bg-layer" ref="layer"></div>
        <scroll class="list" ref="list"
            @scroll="scroll" 
            :probe-type="probeType" 
            :listen-scroll="listenScroll" 
            :data="songs">
            <div class="song-list-wrapper">
                <song-list @select="selectItem" :songs="songs" :rank="rank"></song-list>
            </div>
            <div class="loading-container" v-show="!songs.length">
                <loading></loading>
            </div>
        </scroll>  
    </div>
</template>

<script>
import Scroll from 'base/scroll'
import SongList from 'base/song-list'
import Loading from 'base/loading/loading'
import { prefixStyle } from 'common/js/dom'
import { mapActions } from 'vuex'
import {playlistMixin} from 'common/js/mixin'

const RESERVED_HEIGHT = 60
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')
export default {
    mixins:[playlistMixin],
    name: 'music-list',
    props: {
        bgImage: {
            type: String,
            default: ''
        },
        songs: {
            type: Array,
            default: []
        },
        title: {
            type: String,
            default: ''
        },
        rank: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return {
            scrollY: 0
        }
    },
    computed: {
        bgStyle(){
            return `background-image:url(${this.bgImage})`
        }
    },
    created(){
        this.probeType = 3
        this.listenScroll = true
    },
    mounted(){
        this.imgHeight = this.$refs.bgimg.clientHeight
        this.minTranslateY = -this.imgHeight + RESERVED_HEIGHT
        this.$refs.list.$el.style.top = `${this.imgHeight}px`
    },
    methods: {
        handlePlaylist(playlist) {
            const bottom = playlist.length > 0 ? '60px' : ''
            this.$refs.list.$el.style.bottom = bottom
            this.$refs.list.refresh()
        },
        scroll(pos){
            this.scrollY = pos.y
        },
        back(){
            this.$router.back()
        },
        selectItem(item,index) {
            this.selectPlay({              
                list: this.songs,
                index
            })
        },
        random() {
            this.randomPlay({
                list: this.songs
            })
        },
        ...mapActions([
            'selectPlay',
            'randomPlay'
        ])
    },
    watch: {
        scrollY(newY){
            let translateY = Math.max(this.minTranslateY,newY)
            let zIndex = 0
            let scale = 1
            let blur = 0
            this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
            const percent = Math.abs(newY/this.imgHeight)
            if (newY > 0) {
                scale = 1 + percent
                zIndex = 10
            }else {
                blur = Math.min(20 * percent,20)
            }
            this.$refs.filter.style[backdrop] = `blur(${blur}px)`
            if (newY < this.minTranslateY) {
                zIndex = 10
                this.$refs.bgimg.style.paddingTop = 0
                this.$refs.bgimg.style.height = `${RESERVED_HEIGHT}px`
                this.$refs.playBtn.style.display = 'none'
            }else {
                this.$refs.bgimg.style.paddingTop = '70%'
                this.$refs.bgimg.style.height = 0
                this.$refs.playBtn.style.display = ''
            }
            this.$refs.bgimg.style.zIndex = zIndex
            this.$refs.bgimg.style[transform] = `scale(${scale})`
        }
    },
    components: {
        Scroll,
        SongList,
        Loading
    }
}
</script>

<style scoped>
.music-list {
    position: fixed;
    width: 100%;
    top: 0;
    bottom: 0;
    z-index: 100;
    background: #603546;
}
.bg-image {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;
}
.bg-image .play-wrapper {
    position: absolute;
    bottom: .4rem;
    width: 100%;
    z-index: 100;
}
.play-wrapper .play {
    margin: 0 auto;
    width: 2.3rem;
    box-sizing: border-box;
    font-size: .24rem;
    padding: 7px 0;
    text-align: center;
    border: 1px solid #fff;
    border-radius: 100px;
}
.play-wrapper .play .icon-play {
    display: inline-block;
    width: .24rem;
    height: .24rem;
    background: url('../../common/img/play-1.png') no-repeat;
    background-size: cover;
}
.filter {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(7,17,27,.4);
}
.music-list .back {
    position: absolute;
    z-index: 1000;
    top: .3rem;
    left: .4rem;
    width: .5rem;
    height: .5rem;
    background: url('../../common/img/back.png') ;
    background-size: cover;
}
.music-list .title {
    position: absolute;
    width: 5rem;
    top: 0;
    left: 1.125rem;
    padding-top: .3rem;
    font-size: .32rem;
    line-height: .4rem;
    color: #fff;
    margin: 0 auto;
    text-align: center;
    font-weight: normal;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    z-index: 40;
}
.music-list .list {
    position: fixed;
    background: #fff;
    width: 100%;
    top: 0;
    bottom: 0;
}
.music-list .song-list-wrapper {
    padding: .35rem .25rem;
}
.bg-layer {
    position: relative;
    height: 100%;
    background: #fff;
}
</style>