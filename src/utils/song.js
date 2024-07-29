import utils from './util';

export default class Song{ //自定义一个Song类，用于创建song实例对象，结构和PHP类似

    //构造函数，用于初始化属性
    constructor( {
        id,
        name,
        mvId,
        singer,
        album,
        alia,
        duration,
        milliseconds,
        url,
        vip,
        license,
        publishTime
    }) {
        this.id = id
        this.name = name
        this.mvId = mvId
        this.singer = singer
        this.album = album
        this.alia = alia
        this.duration = duration
        this.milliseconds = milliseconds
        this.url = url
        this.vip = vip
        this.license = license
        this.publishTime = publishTime
    }
}

export function formatSongInfo (song) {
    return new Song({
        id: String(song.id),
        name: song.name,
        //兼容,有些后端的命名方式不一样，
        mvId: song.mv || song.mvid,
        singer: song.ar || song.artists,
        album: song.al || song.album,
        alia: song.alia || song.alias,
        vip: song.fee === 1,
        license: song.license,
        duration: utils.formatSongTime(song.dt || song.duration),
        milliseconds: (song.dt || song.duration) / 1000, // 不用duration是因为时间多次转换后，会有误差，导致进度条实时更新会有偏移，但无伤大雅
        url: `https://music.163.com/song/media/outer/url?id=${song.id}.mp3`,
        publishTime: utils.formatTime(song.publishTime)
    })
}