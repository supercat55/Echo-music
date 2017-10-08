<template>
    <div class="song-list">
        <ul>
            <li @click="selectItem(song, index)" class="item" v-for="(song, index) in songs">   
                <div class="index"  :class="{'rank': getRankCls(index)}">
                    <span v-if="isIndex">{{index + 1}}</span>    
                </div>          
                <div class="content">
                    <h2 class="name">{{song.name}}</h2>
                    <p class="text">{{getDesc(song)}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'song-list',
    props: {
        songs: {
            type: Array,
            default: []
        },
        isBtn: {
            type: Boolean,
            default: true
        },
        rank: {
            type: Boolean,
            default: false
        },
        isIndex: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        selectItem(item,index){
            this.$emit('select',item,index)
        },
        getDesc(song){
            return `${song.singer} - ${song.album}`
        },
        getRankCls(index) {
            if (index <= 2 && this.rank) {
                return true
            }
        }
    }
}
</script>

<style scoped>
.song-list .item {
    height: .65rem;
    padding: .1rem 0 .25rem 0;
    display: flex;
}
.item .index {
    font-size: .26rem;
    flex: 0 0 .47rem;
    margin-right: .3rem;
    width: .47rem;
    text-align: center;
    color: #343434;
    line-height: .65rem;
}
.item .index.rank {
    color: red;
    font-size: .28rem;
    font-weight: bold;
}
.item .content {
    flex: 1;
    overflow: hidden;
}
.item .content .name {
    font-size: .26rem;
    font-weight: normal;
    line-height: .36rem;
    color: #343434;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
.item .content .text {
    font-size: .22rem;
    color: #b9b9b9;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
</style>