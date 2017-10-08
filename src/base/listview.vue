<template>
    <scroll class="listview"
        :listenScroll = "listenScroll" 
        @scroll="scroll"
        :data="data" 
        :probeType="probeType"
        ref="listview">
        <ul>
            <li class="list-group" v-for="group in data" ref="listGroup">
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li class="list-group-item"
                        v-for="item in group.items" 
                        @click="selectItem(item)"
                        >
                        <img class="avatar" v-lazy="item.avatar"/>
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut" 
            @touchstart="onShortcutTouchStart"
            @touchmove.stop.prevent="onShortcunTouchMove">
            <ul>
                <li 
                    v-for="(item,index) in shortcutList" 
                    class="item" 
                    :class="{'current': currentIndex==index}"
                    :data-index="index"
                >
                {{item}}
                </li>
            </ul>
        </div>
        <div class="list-fixed" v-show="fixedTitle" ref="fixed">
            <h1 class="fixed-title">{{fixedTitle}}</h1>
        </div>
    </scroll>
</template>

<script>
import Scroll from '@/base/scroll'
import {getData} from 'common/js/dom'

const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 33
export default {
    created(){
        this.touch = {}
        this.listenScroll = true
        this.listHeight = []
        this.probeType = 3
    },
    props: {
        data: {
            type: Array,
            default: []
        },
    },
    data(){
        return {
            scrollY: -1,
            currentIndex: 0,
            diff: -1
        }
    },
    name: 'listview',
    computed: {
        shortcutList(){
            return this.data.map((group)=>{
                return group.title.substr(0,1)
            })
        },
        fixedTitle(){
            if (this.scrollY > 0) {
                return ''
            }
            return this.data[this.currentIndex]?this.data[this.currentIndex].title:''
        }
    },
    methods: {
        selectItem(item){
            this.$emit('select',item)
        }
        ,
        onShortcutTouchStart(e){
            let anchorIndex = getData(e.target,'index') 
            let firstTouch = e.touches[0]
            this.touch.y1 = firstTouch.pageY
            this.touch.anchorIndex = anchorIndex
            this._scrollTo(anchorIndex)              
        },
        onShortcunTouchMove(e){
            let firstTouch = e.touches[0]
            this.touch.y2 = firstTouch.pageY
            let delta = Math.floor((this.touch.y2 - this.touch.y1)/ANCHOR_HEIGHT)
            let anchorIndex = parseInt(this.touch.anchorIndex) + delta
            this._scrollTo(anchorIndex)  
        },
        refresh() {
            this.$refs.listview.refresh()
        },
        scroll(pos){
            this.scrollY = pos.y
        },
        _scrollTo(index){
            if (!index && index !== 0) {
                return
            }
            if (index < 0) {
                index = 0
            } else if(index > this.listHeight - 2) {
                index = this.listHeight - 2
            }
            this.scrollY = -this.listHeight[index]
            this.$refs.listview.scrollToElement(this.$refs.listGroup[index],0)
        },
        _calculateHeight(){
            this.listHeight = []
            const list = this.$refs.listGroup
            let height = 0
            this.listHeight.push(height)
            for (var i = 0; i < list.length; i++) {
                height+=list[i].clientHeight
                this.listHeight.push(height)
            }
        }
    },
    watch: {
        data(){
            setTimeout(()=>{
                this._calculateHeight()
            },20)
        },
        scrollY(newY){
            const listHeight = this.listHeight
            if (newY > 0) {
                this.currentIndex = 0
                return
            }
            for (let i = 0; i < listHeight.length-1; i++) {
                let height1 = listHeight[i]
                let height2 = listHeight[i+1]
                if (-newY >= height1 && -newY < height2) {
                    this.currentIndex = i
                    this.diff = height2 + newY
                    return
                }
            }

            this.currentIndex = listHeight.length - 2
        },
        diff(newVal){
            let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT)?newVal - TITLE_HEIGHT: 0
            if (this.fixedTop == fixedTop) {
                return
            }
            this.fixedTop = fixedTop
            this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
        }
    },
    components: {
        Scroll
    }
}
</script>

<style scoped>
    .listview {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        font-size: .24rem;
        color: #000;
        background: #fff;
    }
    .list-group {
        padding-bottom: .4rem;
    }
    .list-group .list-group-title {
        font-weight: normal;
        padding-left: .4rem;
        font-size: .26rem;
        line-height: .6rem;
        color: rgba(255, 255, 255, .5);
        background: #9f7b84;
    }
    .list-group .list-group-item {
        position: relative;
        height: .8rem;
        line-height: .8rem;
        padding-left: .4rem;
        padding-top: .4rem;
    }
    .list-group-item .avatar {
        position: absolute;
        width: .8rem;
        height: .8rem;
        border-radius: 50%;
    }
    .list-group-item .name {
        position: absolute;
        width: 100%;
        border-bottom: 1px solid #ccc;
        left: 1.5rem;
    }
    .list-shortcut {
        position: absolute;
        z-index: 30;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        text-align: center;
        width: .4rem;
        background: #2e2238;
        line-height: 18px;
        color: rgba(255, 255, 255, .5);
        border-radius: 4px;
    }
    .list-shortcut .current {
        color: #fff;
    }
    .list-fixed {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        line-height: .6rem;
        color: rgba(255, 255, 255, .5);
        background: #9f7b84;
    }
    .fixed-title {
        font-weight: normal;
        padding-left: .4rem;
        font-size: .26rem
    }
</style>