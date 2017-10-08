<template>
    <div class="newsong">
        <h4>新曲首发</h4>
        <ul class="piclist">
            <li v-for="item in songList" @click="selectItem(item)">
                <div class="song-img">
                    <img v-lazy="item.image"/>
                    <span class="play-btn">
                        <a href="javascript:;">
                            <img src="../../common/img/play-1.png"/>
                        </a>
                    </span>
                </div>
                <div class="song-text">
                    <p class="name">{{item.name}}</p>
                    <p class="author">{{item.singer}}</p>
                </div>
                <div class="operate"></div>
            </li>
        </ul>
        <router-view></router-view>
    </div>
</template>

<script>
import { getNewSong } from '@/api/newsong'
import { ERR_OK } from '@/api/config'
import { createNewSong } from 'common/js/song'
import { mapActions } from 'vuex'
import Song from 'common/js/song'

export default {
    name: 'newsong',
    data() {
        return {
            songList: []
        }
    },
    created() {
        this.getNewSong()
    },
    methods: {
        getNewSong() {
            getNewSong().then((res) => {
                if (res.code === ERR_OK) {
                    this.songList = this._normalizeSongs(res.new_song.data.song_list)
                }
            })
        },
        selectItem(item) {
             this.inserSong(new Song(item))
        },
        _normalizeSongs(list) {
            let ret = []
            list.forEach((musicData,index) => {
                if (index < 12) {
                    ret.push(createNewSong(musicData))
                }
            })
            return ret
        },
        ...mapActions([
            'inserSong'
        ])
    }
}
</script>

<style scoped>
.newsong {
    padding: 0 .4rem;
}
.piclist {
    background: #fff;
    padding: .1rem .3rem;
    border-radius: 5px;
}
.piclist li {
    margin: .2rem 0;
    height: .8rem;
    width: 100%; 
}
.piclist .song-img {
    position: relative;
    float: left;
    width: .8rem;
    height: .8rem;
    border-radius: 50%;
}
.song-img img {
    display: block;
    width: .8rem;
    height: .8rem;
    border-radius: 50%;
}
.song-img .play-btn {
    position: absolute;
    width: .4rem;
    height: .4rem;
    top: .2rem;
    left: .2rem;
    border: 1px solid #fff;
    border-radius: 50%;
}
.play-btn a {
    position: absolute;
    top: 0.08rem;
    left: 0.08rem;
    width: .24rem;
    height: .24rem;
}
.play-btn img {
    display: block;
    width: .24rem;
    height: .24rem;
}
.piclist .song-text {
    float: left;
    margin-left: .28rem;
    width: 70%;
    padding: 0.14rem 0 6px;
    color: #000;
}
.piclist .song-text .name {
    font-size: .24rem;
    line-height: 1;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
.piclist .song-text .author {
    font-size: .22rem;
    line-height: .36rem;
}
.piclist .operate {
    float: right;
    margin-top: .2rem;
    width: 0.06rem;
    height: .36rem;
    background: url('../../common/img/base.png') no-repeat;
    background-size: cover;
}
</style>