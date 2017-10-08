<template>
    <div class="search-box clearFix">
        <div class="search">
            <span class="btn"></span>
            <input type="text" placeholder="搜索音乐、歌手、歌词、用户" v-model="query" ref="query"/>
        </div>
        <div class="cancel" v-show="query" @click="clear">取消</div>
    </div>
</template>

<script>
import {debounce} from 'common/js/util'
export default {
    name: 'search-box',
    data: function() {	
        return {
            query: ''
        }
    },
    methods: {
        clear() {
            this.query = ''
        },
        setQuery(query) {
            this.query = query
        },
        blur() {
            this.$refs.query.blur()
        }
    },
    created() {
        this.$watch('query', debounce((newQuery) => {
            this.$emit('query',newQuery)
        },200))
    }
}
</script>

<style scoped>
.search-box .search {
    float: left;
    width: 6.3rem;
    height: .68rem;
    border-bottom: 1px solid #f27cc2;
}
.search .btn {
    float: left;
    width: .42rem;
    height: .42rem;
    margin-top: .14rem;
    background: url('../common/img/search.png') no-repeat;
    background-size: .42rem .42rem;
}
.search input {
    float: left;
    padding-left: .3rem; 
    border: none;
    background: none;
    width: 5rem;
    line-height: .68rem;
    outline: none;
    color: #fff;
}
.search-box .cancel {
    float: right;
    font-size: .3rem;
    line-height: .68rem;
    color: #fff;
}
</style>