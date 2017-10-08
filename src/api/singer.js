import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'

export function getSingerList(){
    const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
    const data = Object.assign({}, commonParams, {
        channel: 'singer',
        pagesize: 100,
        page: 'list',
        key: 'all_all_all',
        hostUin: 0,
        needNewCode: 0,
        platform: 'yqq',
        pagenum: 1,
        g_tk: 198623625,
        uin: 0,
        needNewCode: 1
    })
    return jsonp(url,data,options)
}

export function getSingerDetail(singerId) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
    const data = Object.assign({}, commonParams, {
        hostUin: 0,
        needNewCode: 0,
        platform: 'yqq',
        order: "listen",
        begin: 0,
        num: 100,
        songstatus: 1,
        singermid: singerId,
        g_tk: 5381
    })
    return jsonp(url,data,options)
}

