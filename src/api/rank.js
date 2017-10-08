import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'
import axios from 'axios'
export function getTopList() {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

    const data = Object.assign({}, commonParams, {
        g_tk: 1961408367,
        platform: "h5",
        needNewCode: 1
    })
    return jsonp(url,data,options)
}

export function getMusicList(id) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

    const data = Object.assign({}, commonParams, {
        g_tk: 1961408367,
        platform: "h5",
        needNewCode: 1,
        tpl: 3,
        page: 'detail',
        type: 'top',
        topid: id
    })
    return jsonp(url,data,options)
}