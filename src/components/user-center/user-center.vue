<template>
    <transition name="silde">
        <div class="user-center">
            <div class="user-wrapper" ref="userWrapper">
                <div class="hearder clearFix">
                    <span class="back" @click="back"></span>
                    <span class="setting"></span>
                </div>
                <div class="portrait">
                    <div class="img">
                        <img src="../../common/img/portrait.png"/>
                    </div>
                    <div class="fans">
                        <span>关注 36</span>
                        <span>粉丝 145</span>
                    </div>
                </div>
                <div class="content">
                    <div class="like-music">
                        <h1 class="title">
                            <span class="text">我喜欢的音乐</span>
                            <div class="play" v-show="favoriteList.length>0" ref="playBtn" @click="random">
                                <span>随机播放全部</span>
                            </div>
                        </h1>
                        <div class="list-wrapper">
                            <scroll ref="favoriteList" :data="favoriteList" class="scroll-list">
                                <div class="song-inner">
                                    <song-list :songs="favoriteList" :isIndex='false' @select="selectSong"></song-list>
                                </div>
                            </scroll>
                        </div>
                    </div>
                </div>
            </div>
            <div class="no-result-wrapper">
                <no-result title="暂无喜欢的歌曲" v-show="noResult"></no-result>
            </div>
        </div>
    </transition>
</template>

<script>
import { mapGetters,mapActions } from 'vuex'
import Scroll from '@/base/scroll'
import SongList from '@/base/song-list'
import Song from 'common/js/song'
import { playlistMixin } from 'common/js/mixin'
import NoResult from '@/base/no-result'

export default {
    name: 'user-center',
    computed: {
        ...mapGetters([
            'favoriteList'
        ]),
        noResult() {
            return !this.favoriteList.length
        }
    },
    methods: {
        handlePlaylist(playlist) {
            const bottom = playlist.length > 0 ? '60px' : ''
            this.$refs.userWrapper.style.bottom = bottom
            this.$refs.favoriteList && this.$refs.favoriteList.refresh()
        },
        back() {
            this.$router.back()  
        },
        random() {
            let list = this.favoriteList
            if (list.length === 0) {
                return
            }
            list = list.map((song) => {
                return new Song(song)
            })
            this.randomPlay({
                list
            })

        },
        selectSong(song) {
            this.inserSong(new Song(song))
        },
        ...mapActions([
            'inserSong',
            'randomPlay'
        ])
    },
    components: {
        Scroll,
        SongList,
        NoResult
    }
}
</script>

<style scoped>
.slide-enter-active,.slide-leave-active {
    transition: all 5s;
}
.slide-enter,.slide-leave-to {
    transform: translate3d(0,-100%,0);
}
.user-center {
    position: fixed;
    width: 100%;
    top: .94rem;
    bottom: 0;
    background: #000;
    background-size: cover;
}
.user-wrapper {
    position: absolute;
    top: 0;
    width: 100%;
    bottom:60px;
}
.hearder {
    padding: .4rem .4rem 0;
}
.hearder .back {
    float: left;
    width: .4rem;
    height: .4rem;
    background: url('../../common/img/playlist.png') no-repeat;
    background-size: 3.45rem 1.9rem;
}
.hearder .setting {
    float: right;
    width: .4rem;
    height: .4rem;
    background: url('../../common/img/setting.png') no-repeat;
    background-size: cover;
}
.user-center .portrait {
    margin-top: .5rem;
    width: 100%;
    height: 5rem;
    background: url('../../common/img/centerBg.png') no-repeat;
    background-size: cover;
}
.portrait .img {
    width: 1.2rem;
    height: 1.2rem;
    margin: 0 auto;
    border-radius: 50%;
}
.portrait .img img {
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 50%;
}
.portrait .fans {
    margin-top: .4rem;
    font-size: .24rem;
    text-align: center;
}
.fans span {
    display: inline-block;
}
.user-center .content {
    position: absolute;
    top: 3.5rem;
    margin: .9rem .3rem 0;
    width: 6.4rem;
    border-radius: 7px;
    padding: 0 .25rem;
    background: #fff;
    height: 7rem;
}
.content .title {
    position: relative;
    font-size: .3rem;
    height: .8rem;
    color: #a0a0a0;
    text-align: center;
    /* line-height: .8rem; */
    border-bottom: 1px solid #b9b9b9;
}
.title .text {
    line-height: .8rem;
}
.title .play {
    position: absolute;
    right: 10px;
    width: 1.6rem;
    font-size: 12px;
    text-align: center;
    border: 1px solid #000;
    height: 18px;
    line-height: 18px;
    bottom: 10px;
    border-radius: 6px;
    background: rgba(0, 0, 0, .1);
    color: #000;
}
.content .list-wrapper {
    position: absolute;
    top: 1rem;
    width: 100%;
    bottom: 0;
}
.scroll-list {
    height: 100%;
    overflow: hidden;
}
.user-center .no-result-wrapper {
    position: absolute;
    z-index: 200;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    color: #ccc;
}
</style>