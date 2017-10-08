import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'
import axios from 'axios'
export function getMv() {
    const url = 'https://c.y.qq.com/v8/fcg-bin/getmv_by_tag'

    const data = Object.assign({}, commonParams, {
        g_tk: 1961408367,
        hostUin: 0,
        needNewCode: 0,
        outCharset: 'GB2312',
        cmd: 'shoubo',
        lan: 'all',
        platform: 'yqq'
    })
    return jsonp(url,data,options)
}

export function getNewSong() {
    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'

    const data = Object.assign({}, commonParams, {
        g_tk: 1915723616,
        hostUin: 0,
        needNewCode: 0,
        callback: 'recom6045637854009605',
        platform: 'yqq',
        data: '{"comm":{"ct":24},"new_song":{"module":"QQMusic.MusichallServer","method":"GetNewSong","param":{"type":1}}}'
    })
    return jsonp(url, data, {
            param: 'jsonpCallback',
            name: 'recom6045637854009605'
        })
}