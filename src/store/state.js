import {playMode} from 'common/js/config'
import { loadFavorite } from 'common/js/cache'

const state = {
    singer: {},
    playing: false,
    fullScreen: false,
    playlist: [],
    sequencelist: [],
    mode: playMode.sequence,
    currentIndex: -1,
    disc: {},
    newsonglist: [],
    topList: {},
    favoriteList: loadFavorite()
}
export default state