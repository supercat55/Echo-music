<template>
    <transition name="list-fade">
        <div class="playlist" v-show="showFlag" @click="hide">
            <div class="list-wrapper" @click.stop="">
                <div class="list-header">
                    <div class="title">
                        <span class="icon" :class="iconMode" @click="changeMode"></span>
                        <span class="text">{{modeText}}</span>
                        <span class="clear" @click="showConfirm"></span>
                    </div>
                </div>
                <scroll class="list-content" ref="listContent" :data="sequencelist">
                    <transition-group name="list" tag="ul">
                        <li :key="item.id" class="item"  ref="listItem"
                            v-for="(item,index) in sequencelist" 
                            @click="selectItem(item,index)"
                        > 
                            <span class="current" :class="getCurrentIcon(item)"></span>
                            <span class="text">{{item.name}} </span>
                            <span @click.stop="toggleFavorite(item)" class="like" :class="getFavoriteIcon(item)"></span>
                            <span class="delete" @click.stop ="deleteOne(item)"></span>
                        </li>
                    </transition-group>
                </scroll>
                <div class="list-close" @click="hide">
                    <span>关闭</span>
                </div>
            </div>
            <confirm ref="confirm" @confirm="confirmClear" text="是否情空播放列表" confirmBtnText="清空"></confirm>
        </div>
    </transition>
</template>

<script>
import { mapActions } from 'vuex'
import { playMode } from 'common/js/config'
import Scroll from '@/base/scroll'
import Confirm from '@/base/confirm'
import {playerMixin} from 'common/js/mixin'

export default {
    mixins: [playerMixin],
    name: 'playlist',
    data: function() {	
        return {
            showFlag: false
        }
    },
    computed: {
        modeText() {
            return this.mode===playMode.sequence ? '顺序播放': this.mode===playMode.random? '随机播放': '单曲循环'
        }
    },
    methods: {
        show() {
            this.showFlag = true
            setTimeout(() => {
                this.$refs.listContent.refresh()
                this.scrollTocurrent(this.currentsong)
            },20)
        },
        hide() {
            this.showFlag = false
        },
        getCurrentIcon(item) {
            if (this.currentsong.id === item.id) {
                return 'icon-play'
            }
            return ''
        },
        scrollTocurrent(current) {
            const index = this.sequencelist.findIndex((song) => {
                return current.id === song.id
            })
            if (!index > -1) {
                this.$refs.listContent.scrollToElement(this.$refs.listItem[index],300)   
            }
        },
        selectItem(item, index) {
            if (this.mode === playMode.random) {
                index = this.playlist.findIndex((song) => {
                    return song.id === item.id
                })
            }
            this.setCurrentIndex(index)
            this.setPlayingState(true)
        },
        deleteOne(item) {
            this.deleteSong(item)
            if (!this.playlist.length) {
                this.hide()
            }
        },
        showConfirm() {
            this.$refs.confirm.show()  
        },
        confirmClear() {
            this.delectSonglist()
            this.hide()
        },
        ...mapActions([
            'deleteSong',
            'delectSonglist'
        ])
    },
    watch: {
        currentsong(newsong, oldsong) {
            if (!this.showFlag || newsong.id === oldsong.id) {
                return
            }
            this.scrollTocurrent(newsong)
        }
    },
    components: {
        Scroll,
        Confirm
    }
}
</script>

<style scoped>
.list-fade-enter-active, .list-fade-leave-active {
    transition: opacity 0.3s;
}
.list-fade-leave-active .list-wrapper,
.list-fade-enter-active .list-wrapper {
    transition: all 0.3s;
}
.list-fade-enter, .list-fade-leave-to {
    opacity: 0;
}
.list-fade-enter .list-wrapper,
.list-fade-leave-to .list-wrapper {
    transform: translate3d(0, 100%, 0)
}
.list-fade-enter .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #302238;
}
.playlist {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    background: rgba(0,0,0,.3);
}
.list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #3d273c;
}
.list-header {
    padding: .3rem;
}
.list-header .title {
    display: flex;
    align-items: center;
    font-size: .26rem;
}
.title .icon {
    flex: 0 0 .3rem;
    width: .3rem;
    height: .3rem;
    background: url('../../common/img/player.png') no-repeat;
    background-size: 1.1rem 2.34rem;
    margin-right: .2rem;
}
.title .icon.sequence {
    background-position: 0 -2.06rem;
}
.title .icon.loop {
    background-position: right 0;
}
.title .icon.random {
    background-position: 0 -1.57rem;
}
.list-header .text {
    flex: 1;
    color: #dbdbdb;
}
.list-header .clear {
    flex: 0 .3rem 0 0;
    width: .3rem;
    height: .3rem;
    background: url('../../common/img/clear.png') no-repeat;
    background-size: cover;
}
.list-content {
    max-height: 240px;
    overflow: hidden;
    margin-bottom: .5rem;
}
.list-content .item {
    display: flex;
    align-items: center;
    height: .8rem;
    font-size: .28rem;
    padding: 0 .3rem;
}
.list-content .item .current {
    flex: 0 0 .22rem;
    width: .22rem;
    height: .22rem;
    margin-right: .1rem;
}
.list-content .item .current.icon-play {
    background: url('../../common/img/play-1.png') no-repeat;
    background-size: cover;
}
.list-content .item .text {
    flex: 1;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: #b4acb4;
}
.list-content .item .like {
    width: .4rem;
    height: .35rem;
}
.list-content .item .like.favorite {
    background: url('../../common/img/favorite.png') no-repeat;
    background-size: cover;
}
.list-content .item .like.no-favorite {
    background: url('../../common/img/player.png')  0 -1rem no-repeat;
    background-size: 1.1rem 2.34rem;
}
.list-content .item .delete {
    position: relative;
    width: .3rem;
    height: .3rem;
    background: url('../../common/img/delete.png') no-repeat;
    background-size: cover;
    margin-left: .1rem;
}
.list-content .list-enter-active,.list-content .list-leave-active {
    transition: all .1s linear;
}
.list-content .list-enter,.list-content .list-leave-to {
    height: 0;
}
.list-close {
    text-align: center;
    line-height: 50px;
    background: #2d2137;
    font-size: 16px;
    color: rgba(255,255,255,.4);
}
</style>