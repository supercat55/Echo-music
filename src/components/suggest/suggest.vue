<template>
    <scroll class="suggest" 
        :data="result" 
        :pullup="pullup" 
        :beforeScroll="beforeScroll"
        @scrollToEnd="searchMore"
        @beforeScroll="listScroll"
        ref="suggest"

    >
        <ul class="suggest-list">
            <li class="item" v-for="item in result" @click="selectItem(item)">
                <span class="icon" :class="getIconCls(item)"></span>
                <span class="name" v-html="getDisplayName(item)"></span>
            </li>
            <loading v-show="hasMore" title=""></loading>
        </ul>
        <div class="no-result-wrapper" v-show="!hasMore && !result.length">
            <no-result title="抱歉，暂无搜索结果"></no-result>
        </div>
    </scroll>
</template>

<script>
import { search } from '@/api/search'
import { ERR_OK } from "@/api/config"
import { createSong } from 'common/js/song'
import Scroll from '@/base/scroll'
import Singer from 'common/js/singer'
import Loading from '@/base/loading/loading'
import { mapMutations } from 'vuex'
import { mapActions } from 'vuex'
import NoResult from '@/base/no-result'

const TYPE_SINGER = 'singer'
const PER_PAGE = 20

export default {
    name: 'suggest',
    props: {
        query: {
            type: String,
            default: ''
        },
        showSinger: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            page: 1,
            result: [],
            pullup: true,
            hasMore: true,
            beforeScroll: true
        }
    },
    methods: {
        search() {
            this.page = 1
            this.hasMore = true
            this.$refs.suggest.scrollTo(0)
            search(this.query, this.page, this.showSinger,PER_PAGE).then((res) => {
                if (res.code === ERR_OK) {
                    this.result = this._getResult(res.data)
                    this._checkMore(res.data)
                } 
            })
        },
        searchMore() {
            if (!this.hasMore) {
                return
            }
            this.page++
            search(this.query, this.page, this.showSinger, PER_PAGE).then((res) => {
                if (res.code === ERR_OK) {
                    this.result = this.result.concat(this._getResult(res.data))
                    this._checkMore(res.data)
                } 
            })
        },
        selectItem(item) {
            if (item.type === TYPE_SINGER) {
                const singer = new Singer({
                    id: item.singermid,
                    name: item.singername
                })
                this.$router.push({
                    path: `/search/${singer.id}`
                })
                this.setSinger(singer)
            } else {
                this.inserSong(item)
            }
        },
        refresh() {
            this.$refs.suggest.refresh()
        },
        listScroll() {
            this.$emit('listScroll')
        },
        _checkMore(data) {
            const song = data.song
            if (!song.list.length || (song.curnum + song.curpage * PER_PAGE) > song.totalnum) {
                this.hasMore = false
            }
        },
        getIconCls(item) {
            if (item.type === TYPE_SINGER) {
                return 'icon-mine'
            } else {
                return 'icon-music'
            }
        },
        getDisplayName(item) {
            if (item.type === TYPE_SINGER) {
                return item.singername
            } else {
                return `${item.name}-${(item.singer)}`
            }
        },
        _getResult(data) {
            let ret = []
            if (data.zhida && data.zhida.singerid) {
                ret.push({...data.zhida,...{type: TYPE_SINGER}})
            }
            if (data.song) {
                ret = ret.concat(this._normalizeSongs(data.song.list))
            }
            return ret
        },
        _normalizeSongs(list) {
            let ret = []
            list.forEach((musicData) => {
                if (musicData.songid && musicData.albumid) {
                    ret.push(createSong(musicData))
                }
            })
            return ret
        },
        ...mapMutations({
            setSinger: 'SET_SINGER'
        }),
        ...mapActions([
            'inserSong'
        ])
    },
    watch: {
        query() {
            this.search()
        }
    },
    components: {
        Scroll,
        Loading,
        NoResult
    }
}
</script>

<style scoped>
.suggest {
    height: 100%;
    overflow: hidden;
}
.suggest-list {
    padding: 0 .5rem;
    font-size: .26rem;
    line-height: .58rem;
    color: #dbdbdb;
}
.suggest-list .item {
    display: flex;
    align-items: center;
}
.item .icon {
    display: block;
    flex: 0 0 .26rem;
    width: .26rem;
    height: .26rem;
    margin-right: .3rem;
}
.item .icon.icon-mine {
    background: url(../../common/img/mine.png) no-repeat;
    background-size: cover;
}
.item .icon.icon-music {
    background: url(../../common/img/music.png) no-repeat;
    background-size: cover;
}
.item .name {
    flex: 1;
}
.no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
}
</style>