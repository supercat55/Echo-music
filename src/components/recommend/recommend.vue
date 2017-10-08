<template>
    <div class="recommend" ref="recommend">
        <scroll ref="scroll" class="scroll" :data="discList">
            <div>
                <swiper 
                    @load="loadImage"
                    v-if="silderData.length" 
                    :list=silderData 
                    :loop=true 
                    :auto=true 
                    dots-position='center'>
                </swiper>
                <div class="wrap">
                    <div class="recommend-list">
                        <h4>推荐歌单</h4>
                        <ul class="clearFix">
                            <li v-for="(item,index) in discList" :key="item.id" @click="selectItem(item)">
                                <img v-lazy="item.imgurl"/>
                                <div class="text">{{item.dissname}}</div>
                            </li>
                        </ul>
                    </div>
                    <new-song></new-song>
                </div>
            </div>
            <div class="loading-container" v-show="!discList.length">
                <loading></loading>
            </div>
        </scroll>
        <router-view></router-view>
    </div>
</template>

<script>
import Loading from 'base/loading/loading'
import Scroll from 'base/scroll'
import { getRecommend, getDiscList } from '@/api/recommend'
import { ERR_OK } from '@/api/config'
import { Swiper } from 'vux'
import { playlistMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'
import NewSong from 'components/new-song/new-song'

export default {
    mixins:[playlistMixin],
    name: 'recommend',
    data: function() {	
        return {
            silderData: [],
            discList: []
        }
    },
    created(){
        this._getRecommend()
        this._getDiscList()
    },
    methods: {
        handlePlaylist(playlist) {
            const bottom = playlist.length > 0 ? '60px' : ''
            this.$refs.recommend.style.bottom = bottom
            this.$refs.scroll.refresh()
        },
        selectItem(item) {
            this.$router.push({
                path: `/recommend/${item.dissid}`
            })
            this.setDisc(item)
        },
        _getRecommend(){
            getRecommend().then((res)=>{
                if (res.code === ERR_OK ) {
                   for (var i = 0; i < res.data.slider.length; i++) {
                       this.silderData.push({
                           url: res.data.slider[i].linkUrl,
                           img: res.data.slider[i].picUrl
                       })
                       
                   }
                }
            })
        },
        _getDiscList(){
            getDiscList().then((res)=>{
                if (res.code === ERR_OK) {
                    for(var i = 0;i < 6;i++){
                        this.discList.push(res.data.list[i])
                    }
                }
            })
        },
        loadImage(){
            if (!this.checkLoaded) {
                this.$refs.scroll.refresh()
                this.checkLoaded = true;
            }
        },
        ...mapMutations({
            setDisc: 'SET_DISC'
        })
    },
    components: {
        Swiper,
        Scroll,
        Loading,
        NewSong
    }
}
</script>

<style>
.recommend {
    position: fixed;
    width: 100%;
    top: .94rem;
    bottom: 0;
    background: linear-gradient(
    to bottom,#633747 0,#472c40 19%,#3b273b 60%,#352439 100%);
}
.recommend .scroll {
    height: 100%;
    overflow: hidden;
}
.recommend h4 {
    font-weight: normal;
    font-size: .3rem;
    line-height: 1rem;
    letter-spacing: 5px;
    text-align: center;
    color: #fff;
}
.recommend-list {
    padding: 0 .15rem 0 .4rem;
}
.recommend-list li {
    position: relative;
    z-index: 22;
    float: left;
    width: 2.14rem;
    height: 2.8rem;
    margin: 0 .12rem .3rem 0;
}
.recommend-list li img {
    display: block;
    width: 2.14rem;
    height: 2.14rem;
}
.recommend-list .text {
    position: absolute;
    box-sizing: border-box;
    transform: translateY(.1rem);
    padding-left: .1rem;
    width: 100%;
    height: .7rem;
    bottom: 0;
    left: 0;
    font-size: .14rem;
    line-height: .35rem;
    color: #fff;
    overflow: hidden;
}
.loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
}
</style>