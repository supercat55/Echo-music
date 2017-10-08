<template>
    <div class="player" v-show="playlist.length>0">
        <transition name="normal"
            @enter="enter"
            @after-enter='afterEnter'
            @leave="leave"
            @after-leave="afterLeave">
            <div class="normal-player" v-show="fullScreen">
                <div class="top">
                    <div class="back icons" @click="back"></div>
                    <h1 class="title" v-html="currentsong.name"></h1>
                    <h2 class="subtitle" v-html="currentsong.singer"></h2>
                </div>
                <div class="middle" 
                    @touchstart.prevent="middleTouchStart" 
                    @touchmove.prevent="middleTouchMove" 
                    @touchend="middleTouchEnd"
                >
                    <div class="middle-c" ref="middleC">
                        <div class="cd-wrapper" ref="cdWrapper">
                            <div class="rotation-bar"></div>
                            <div class="rotation-dot"></div>
                            <div class="cd" :class="cdRotate">
                                <img width="100%" height="100%" :src="currentsong.image">
                            </div>
                        </div>
                    </div>
                    <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
                        <div class="lyric-wrapper">
                            <div v-if="currentLyric">
                                <p class="text"  ref="lyricLine" 
                                    :class="{'current': currentLineNum === index}"
                                    v-for="(line,index) in currentLyric.lines"
                                    >
                                    {{line.txt}}
                                </p>
                            </div>
                        </div>
                    </scroll>
                </div>
                <div class="bottom">
                    <div class="dot-wrapper">
                        <span class="dot" :class="{'active': currentShow==='cd'}"></span>
                        <span class="dot" :class="{'active': currentShow==='lyric'}"></span>
                    </div>
                    <div class="progress-wrapper clearFix">
                        <span class="time time-l">{{format(currentTime)}}</span>
                        <div class="progress-bar-wrapper">
                            <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
                        </div>
                        <span class="time time-r">{{format(currentsong.duration)}}</span>
                    </div>
                    <div class="operators">
                        <div class="i-left" >
                            <i class="icons" :class="iconMode" @click="changeMode"></i>
                        </div>
                        <div class="i-left" :class="disableCls">
                            <i class="icons prve" @click.stop="prve"></i>
                        </div>
                        <div class="i-center" @click="togglePlaying" :class="disableCls">
                            <i class="icons" :class="playIcon"></i>
                        </div>
                        <div class="-right" :class="disableCls">
                            <i class="icons next" @click="next"></i>
                        </div>
                        <div class="i-right">
                            <i class="icons" 
                                @click="toggleFavorite(currentsong)" 
                                :class="getFavoriteIcon(currentsong)"
                            >
                            </i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini">   
            <div class="mini-player clearFix" v-show="!fullScreen" @click="open">
                <div class="icon">
                    <img width="40" height="40" :src="currentsong.image" :class="cdRotate">
                </div>
                <div class="text">
                    <h1 class="name" v-html="currentsong.name"></h1>
                    <p class="playing-lyric">{{playingLyric}}</p>
                </div>
                <div class="control play">
                    <progress-circle :radius="radius" :percent="percent">
                        <i class="icons icon-mini" :class="miniIcon" @click.stop="togglePlaying"></i>
                    </progress-circle>                 
                </div>
                <div class="control" @click.stop="showPlaylist">
                    <i class="icons icon-playlist"></i>
                </div>
            </div>
        </transition>    
        <playlist ref="playlist"></playlist>
        <audio ref="audio" :src="currentsong.url" 
            @play="ready" 
            @error="error"
            @timeupdate="updateTime"
            @ended="end"
            >
        </audio> 
    </div>
</template>

<script>
import {mapGetters,mapMutations} from 'vuex'
import animations from 'create-keyframe-animation'
import {prefixStyle} from 'common/js/dom'
import ProgressBar from '@/base/progress-bar'
import ProgressCircle from '@/base/progress-circle'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import Lyric from 'lyric-parser'
import Scroll from '@/base/scroll'
import Playlist from 'components/playlist/playlist'
import {playerMixin} from 'common/js/mixin'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')
export default {
    mixins: [playerMixin],
    name: 'player',
    data(){
        return {
            songReady: false,
            currentTime: 0,
            radius: 32,
            currentLyric: null,
            currentLineNum: 0,
            currentShow: 'cd',
            playingLyric: null
        }
    },
    computed: {
        cdRotate(){
            return this.playing? 'play' : 'play pause'
        },
        playIcon(){
            return this.playing? 'pause' : 'play'
        },
        miniIcon(){
            return this.playing? 'pause-mini' : 'play-mini'
        },
        disableCls(){
            return this.ready? "" : 'disable'
        },
        percent(){
            return this.currentTime/this.currentsong.duration
        },
        ...mapGetters([
            'fullScreen',
            'playing',
            'currentIndex'
        ])
    },
    created() {
        this.touch = {}
    },
    methods: {
        back(){
            this.setFullScreen(false)
        },
        open(){
            this.setFullScreen(true)
        },
        enter(el,done){
            const {x,y,scale} = this._getPosAndSacle()
            let animation = {
                0: {
                    transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
                },
                60: {
                    transform: `translate3d(0,0,0) scale(1.1)`
                },
                100: {
                    transform: `translate3d(0,0,0) scale(1)`
                }
            }
            animations.registerAnimation({
                name: 'move',
                animation,
                presets: {
                    duration: 400,
                    easing: 'linear'
                }
            })

            animations.runAnimation(this.$refs.cdWrapper,'move',done)
        },
        afterEnter(){
            animations.unregisterAnimation('move')
            this.$refs.cdWrapper.style.animation = ''
        },
        leave(el,done){
            this.$refs.cdWrapper.style.transition = 'all .4s'
            const {x,y,scale} = this._getPosAndSacle()
            this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
            this.$refs.cdWrapper.addEventListener('transitionend',done)
        },
        afterLeave(){
            this.$refs.cdWrapper.style.transition = ''
            this.$refs.cdWrapper.style[transform] = ''
        },
        togglePlaying(){
            if (!this.songReady) {
                return
            }
            this.setPlayingSate(!this.playing)
            if (this.currentLyric) {
                this.currentLyric.togglePlay()
            }
        },
        end() {
            if (this.mode === playMode.loop) {
                this.loop()
            } else {
                this.next()   
            }
        },
        loop() {
            this.$refs.audio.currentTime = 0
            this.$refs.audio.play()
            if (this.currentLyric) {
                this.currentLyric.seek(0)
            }
        },
        next(){
            if (!this.songReady) {
                return
            }
            if (this.playlist.length === 1) {
                this.loop()
            } else {
                let index = this.currentIndex + 1
                if (index == this.playlist.length) {
                    index = 0
                }
                this.setCurrentIndex(index)
                if (!this.playing) {
                    this.togglePlaying()
                }   
            }
            this.songReady = false
        },
        prve(){
            if (!this.songReady) {
                return
            }
            if (this.playlist.length === 1) {
                this.loop()
            } else {
                let index = this.currentIndex - 1
                if (index == -1) {
                    index = this.playlist.length - 1
                }
                this.setCurrentIndex(index)
                if (!this.playing) {
                    this.togglePlaying()
                }   
            }
            this.songReady = false
        },
        ready(){
            this.songReady = true
        },
        error(){
            this.songReady = true
        },
        updateTime(e){
            this.currentTime = e.target.currentTime
        },
        format(interval){
            interval = interval | 0 
            const minute = interval/60 | 0
            const second = this._pad(interval%60)
            return `${minute}:${second}`
        },
        getLysic() {
            this.currentsong.getLysic().then((lyric) => {
                // if (this.currentSong.lyric !== lyric) {
                //     return
                // }
                this.currentLyric = new Lyric(lyric,this.handleLyric)
                if (this.playing) {
                    this.currentLyric.play()   
                }
            }).catch(() => {
                this.currentLyric = null
                this.playingLyric = ''
                this.currentLineNum = 0
            })
        },
        handleLyric({lineNum,txt}) {
            this.currentLineNum = lineNum
            if (lineNum > 5) {
                let lineEl = this.$refs.lyricLine[lineNum - 5]
                this.$refs.lyricList.scrollToElement(lineEl,1000)
            } else {
                this.$refs.lyricList.scrollTo(0,0,1000)
            }
            this.playingLyric = txt
        },
        showPlaylist() {
            this.$refs.playlist.show()  
        },
        middleTouchStart(e) {
            this.touch.initiated = true
            const touch = e.touches[0]
            this.touch.startX = touch.pageX
            this.touch.stratY = touch.pageY

        },
        middleTouchMove(e) {
            if (!this.touch.initiated) {
                return
            }
            const touch = e.touches[0]
            const deltaX = touch.pageX - this.touch.startX
            const deltaY = touch.pageY - this.touch.stratY
            if (Math.abs(deltaY) > Math.abs(deltaX)) {
                return
            }
            const left = this.currentShow === 'cd'? 0 : -window.innerWidth
            const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
            this.touch.percent = Math.abs(offsetWidth/window.innerWidth)
            this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
            this.$refs.lyricList.$el.style[transitionDuration] = 0
            this.$refs.middleC.style.opacity = 1 - this.touch.percent
            this.$refs.middleC.style[transitionDuration] = 0
         },
        middleTouchEnd() {
            let offsetWidth
            let opacity
            if (this.currentShow === 'cd') {
                if (this.touch.percent > 0.1) {
                    offsetWidth = -window.innerWidth
                    opacity = 0
                    this.currentShow = 'lyric'
                } else {
                    offsetWidth = 0
                    opacity = 1
                }
            } else {
                if (this.touch.percent < 0.9) {
                    offsetWidth = 0
                    opacity = 1
                    this.currentShow = 'cd'
                } else {
                    offsetWidth = -window.innerWidth
                    opacity = 0
                }
            }
            const time = 400
            this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
            this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
            this.$refs.middleC.style.opacity = opacity
            this.$refs.middleC.style[transitionDuration] = `${time}ms`
        },
        _pad(num,n = 2){
            let len = num.toString().length
            while (len < n) {
                num = "0" + num
                len++
            }
            return num
        },
        onProgressBarChange(percent) {
            const currentTime = this.currentsong.duration * percent
            this.$refs.audio.currentTime = this.currentsong.duration * percent
            if (!this.playing) {
                this.togglePlaying()
            }
            if (this.currentLyric) {
                this.currentLyric.seek(currentTime * 1000)
            }
        },
        _getPosAndSacle(){
            const targetWidth = 40
            const paddingLeft = 40
            const paddingBottom = 30
            const paddingTop = 80
            const width = window.innerWidth * 0.8
            const scale = targetWidth/width
            const x = -(window.innerWidth/2 - paddingLeft)
            const y = window.innerHeight - paddingTop - width/2 - paddingBottom
            return {
                x,
                y,
                scale
            }
        },
        ...mapMutations({
            setFullScreen: 'SET_FULL_SCREEN'
        })
    },
    watch: {
        currentsong(newSong, oldSong) {
            if (!newSong.id) {
                return
            }
            if (newSong.id === oldSong.id) {
                return
            }
            if (this.currentLyric) {
                this.currentLyric.stop()
                this.currentTime = 0
                this.playingLyric = ''
                this.currentLineNum = 0
            }
            clearTimeout(this.timer)
            this.timer = setTimeout(()=>{
                this.$refs.audio.play()
                this.getLysic()
            },1000)
        },
        playing(newPlaying){
            const audio = this.$refs.audio
            this.$nextTick(()=>{
                newPlaying? audio.play() : audio.pause()
            })
        }
    },
    components: {
        ProgressBar,
        ProgressCircle,
        Scroll,
        Playlist
    }
}
</script>

<style scoped>
.normal-enter-active,.normal-leave-active {
    transition: all .6s;  
}
.normal-enter-active .top,
.normal-enter-active.bottom,
.normal-leave-active .top,
.normal-leave-active .bottom {
    transition: all .6s cubic-bezier(0.86,0.18,0.82,1.32)
}
.normal-enter, .normal-leave-to {
    opacity: 0;
}
.normal-enter .top,
.normal-leave-to .top {
    transform: translate3d(0,-100px,0)
}
.normal-enter .bottom,
.normal-leave-to .bottom {
    transform: translate3d(0,200px,0)
}
.mini-enter-active, .mini-leave-active {
    transition: all .6s;  
}
.mini-enter, .mini-leave-to {
    opacity: 0;
}
.player .normal-player {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: linear-gradient(
        to bottom,#6e3b4a 0,#683848 19%,#4e2e40 60%,#2e2138 100%);
}
.normal-player .icons {
    background: url('../../common/img/player.png') no-repeat;
    background-size: 1.1rem 2.34rem;
}
.normal-player .top {
    position: relative;
    margin-bottom: .3rem;
    padding-top: .2rem;
}
.normal-player .top .back {
    position: absolute;
    left: .42rem;
    top: .34rem;
    width: .4rem;
    height: .24rem;
}
.top .title {
    width: 70%;
    margin: 0 auto;
    text-align: center;
    font-size: .34rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
.top .subtitle {
    font-size: .24rem;
    text-align: center;
    margin-top: .1rem;
    color: #b4acb4;
}
.normal-player .middle {
    position: fixed;
    top: 1.62rem;
    bottom: 3.9rem;
    white-space: nowrap;
    font-size: 0;
    width: 100%;
}
.middle .middle-c {
    display: inline-block;
    vertical-align: top;
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 80%;
}
.middle .middle-c .cd-wrapper {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    height: 100%;
    border: 2px solid #fff;
    border-radius: 50%;
}
.middle .middle-c .cd {
    position: absolute;
    top: 7%;
    left: 7%;
    width: 86%;
    height: 86%;
}
.middle .middle-c .play {
    animation: rotate 20s linear infinite;
}
.middle .middle-c .pause {
    animation-play-state: paused
}
.middle .middle-c .cd img {
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 50%;
}
.middle .middle-r {
    display: inline-block;
    width: 100%;
    height: 100%;
    vertical-align: top;
    overflow: hidden;
}
.middle .middle-r .lyric-wrapper {
    width: 80%;
    margin: 0 auto;
    overflow: hidden;
    text-align: center;
}
.middle-r .lyric-wrapper .text {
    line-height: 32px;
    color: #b4acb4;
    font-size: 14px;
}
.middle-r .lyric-wrapper .current {
    color: #fff;
}
.normal-player .bottom {
    position: absolute;
    width: 100%;
    bottom: .5rem;
}
.bottom .dot-wrapper {
    text-align: center;
    font-size: 0;
}
.bottom .dot-wrapper .dot {
    display: inline-block;
    vertical-align: middle;
    margin: 0 0.08rem;
    width: .16rem;
    height: .16rem;
    border-radius: 50%;
    background: rgba(255, 255, 255, .5);
}
.bottom .dot-wrapper .active {
    width: .4rem;
    border-radius: .1rem;
    background: rgba(255, 255, 255, .8);
}
.bottom .progress-wrapper {
    display: flex;
    align-items: center;
    width: 80%;
    margin: 0 auto;
    padding: .6rem 0;
}
.bottom .time {
    flex: 0 0 .7rem;
    width: .5rem;
    font-size: .24rem;
    line-height: .3rem;
}
.bottom .time-l {
    text-align: left;
}
.bottom .time-r {
    text-align: right;
}
.bottom .progress-bar-wrapper {
    flex: 1;
}
.bottom .operators {
    display: flex;
    align-items: center
}
.bottom .operators div {
    flex: 1;
}
.bottom .operators i {
    display: inline-block;
    width: .4rem;
    height: .46rem; 
}
.bottom .operators .i-left {
    text-align: right;
}
.bottom .operators .i-center {
    text-align: center;
    margin: 0 .7rem;
    background: #b25dc8;
    border-radius: 50%;
}
.bottom .operators .i-right {
    text-align: left;
}
.bottom .operators .loop {
    background-position: right 0;
}
.bottom .operators .sequence {
    background-position: 0 -2.06rem;
}
.bottom .operators .random {
    background-position: 0 -1.57rem;
}
.bottom .operators .prve {
    background-position: right -.46rem;
}
.bottom .operators .next {
    background-position: 0 -.46rem;
}
.bottom .operators .play {
    background-position: right -1rem;
    transform: translateY(-2px);
}
.bottom .operators .pause {
    background: url('../../common/img/pause.png') no-repeat;
    background-size: cover;
    transform: translateX(-2px) translateY(-4px);
}
.bottom .operators .favorite {
    /* background-position: 0 -1rem; */
    background: url('../../common/img/favorite.png') no-repeat;
    background-size: cover;
}
.bottom .operators .no-favorite {
    background-position: 0 -1rem;
}
.mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 160;
    width: 100%;
    height: 60px;
    padding-top: 10px;
    background: #333;
}
.mini-player .icon {
    flex: 0 0 40px;
    width: 40px;
    padding: 0px 10px 0 20px;
}
.mini-player .icon img {
    border-radius: 50%;
    vertical-align: baseline;
}
.mini-player .icon .play {
    animation: rotate 20s linear infinite;
}
.mini-player .icon .pause {
    animation-play-state: paused
}
.mini-player .text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    overflow: hidden;
    line-height: 20px;
}
.mini-player .text .name {
    margin-bottom: 2px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 14px;
    color: #fff;
}
.mini-player .text .playing-lyric {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 12px;
    color: #ccc;
}
.mini-player .control {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
    text-align: center;
}
.control .play-mini {
    display: block;
    width: .34rem;
    height: .34rem;
    background: url('../../common/img/player.png') no-repeat;
    background-size: 1.1rem 2.34rem;
    background-position: right -1.05rem;
    transform: translateX(0.15rem) translateY(0.07rem);
}
.control .pause-mini {
    display: block;
    width: .34rem;
    height: .34rem;
    background: url('../../common/img/pause.png') no-repeat;
    background-size: cover;
    transform: translateX(0.1rem) translateY(0.05rem);
}
.control .icon-playlist {
    display: inline-block;
    width: .5rem;
    height: .5rem;
    background: url('../../common/img/player.png') no-repeat;
    background-size: 1.1rem 2.34rem;
    background-position: right -1.6rem;
}
.icon-mini {
    position: absolute;
    left: 0.06rem;
    top: 0.12rem;
}
@keyframes rotate {
    0% {
        transform: rotate(0)
    }
    100% {
        transform: rotate(360deg)
    }
}
</style>