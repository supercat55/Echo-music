import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import {saveFavorite,deleteFavorite} from 'common/js/cache'

function findIndex(list,song) {
    return list.findIndex((item) => {
        return item.id === song.id
    })
}

export const selectPlay = function ({ commit, state }, { list, index }) {
    commit(types.SET_SEQUENCE_LIST, list)
    if (state.mode === playMode.random) {
        let randomList = shuffle(list)
        commit(types.SET_PLAYLIST, randomList)
        index = findIndex(randomList,list[index])
    } else {
        commit(types.SET_PLAYLIST, list)   
    }
    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function ({commit},{list}) {
    commit(types.SET_PLAY_MODE, playMode.random)
    commit(types.SET_SEQUENCE_LIST, list)
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    commit(types.SET_CURRENT_INDEX, 0)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

export const inserSong = function ({ commit, state }, song) {
    let playlist = state.playlist.slice()
    let sequencelist = state.sequencelist.slice()
    let currentIndex = state.currentIndex
    //记录当前歌曲 
    let currentSong = playlist[currentIndex]
    //查找当前列表中是否有该索引，并返回其索引
    let fpIndex = findIndex(playlist, song)
    //因为是插入歌曲，所以索引要+1
    currentIndex++
    //插入这首歌到当前索引位置
    playlist.splice(currentIndex, 0, song)
    //如果已经包含这首歌
    if (fpIndex > -1) {
        //如果当前插入的序号大于列表中的需要
        if (currentIndex > fpIndex) {
            playlist.splice(fpIndex, 1)
            currentIndex--
        } else {
            playlist.splice(fpIndex + 1,1)
        }
    }

    let currentSIndex = findIndex(sequencelist, currentSong) + 1
    
    let fsIndex = findIndex(sequencelist, song)
    
    sequencelist.splice(currentSIndex, 0, song)
    
    if (fsIndex > -1) {
        if (currentSIndex > fsIndex) {
          sequenceList.splice(fsIndex, 1)
        } else {
          sequenceList.splice(fsIndex + 1, 1)
        }
    }
    
    commit(types.SET_PLAYLIST,playlist)
    commit(types.SET_SEQUENCE_LIST, sequencelist)
    commit(types.SET_CURRENT_INDEX, currentIndex)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

export const deleteSong = function ({ commit, state },song) {
    let playlist = state.playlist.slice()
    let sequencelist = state.sequencelist.slice()
    let currentIndex = state.currentIndex
    let pIndex = findIndex(playlist, song)
    playlist.splice(pIndex, 1)
    let sIndex = findIndex(sequencelist, song)
    sequencelist.splice(sIndex, 1)
    
    if (currentIndex > pIndex||currentIndex === playlist.length) {
        currentIndex--
    }

    commit(types.SET_PLAYLIST, playlist)
    commit(types.SET_SEQUENCE_LIST, sequencelist)
    commit(types.SET_CURRENT_INDEX, currentIndex)
    
    const playingState = playlist.length > 0
    commit(types.SET_PLAYING_STATE,playingState)
    
}

export const delectSonglist = function ({ commit }) {
    commit(types.SET_PLAYLIST, [])
    commit(types.SET_SEQUENCE_LIST, [])
    commit(types.SET_CURRENT_INDEX, -1)
    commit(types.SET_PLAYING_STATE, false)
}

export const saveFavoriteList = function ({ commit }, song) {
    commit(types.SET_FAVORITE_LIST,saveFavorite(song))
}

export const deleteFavoriteList = function ({ commit }, song) {
    commit(types.SET_FAVORITE_LIST,deleteFavorite(song))
}