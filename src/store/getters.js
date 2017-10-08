export const singer = state => state.singer

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playlist = state => state.playlist

export const sequencelist = state => state.sequencelist

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const currentsong = (state) => {
    return state.playlist[state.currentIndex] || {}
} 

export const disc = state => state.disc

export const newsonglist = state => state.newsonglist

export const topList = state => state.topList

export const favoriteList = state => state.favoriteList