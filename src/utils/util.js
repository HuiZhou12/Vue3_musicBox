import { formatSongInfo } from '../utils/song' 

export default {
    // 数字过万和亿的处理
        formartNum (val) {
        let num = 0;
        if (val > 99999999) {
            // 保留两位小数并添加“亿”后缀
            num = (val / 100000000).toFixed(2) + "亿";
        } else if (val > 9999) {
            // 保留两位小数并添加“万”后缀
            num = (val / 10000).toFixed(2) + "万";
        } else {
            num = val;
        }
        return num;
    },


    //时间处理   
        formartDate( originVal, dateRegul) {
            // 详细请见：https://blog.csdn.net/qq_50977450/article/details/121534539
            const date = new Date(originVal)
            const requlation = {
                yyyy:date.getFullYear(),
                MM:date.getMonth() + 1,
                dd:date.getDate(),
                HH:date.getHours(),
                mm:date.getMinutes(),
                ss:date.getSeconds()
            }
            for (const i in requlation) {
                const ret = new RegExp('('+ i +')').exec(dateRegul)//exec() 方法在一个指定字符串中执行一个搜索匹配。返回一个结果数组或 null
                if(ret) {
                    dateRegul = dateRegul.replace(ret[1], requlation[i])
                }
            }

            return dateRegul
        },
    // 处理歌曲
        formatSongs (list, privileges) {
            const ret = []
            list.map((item, index) => { //map() 的返回值是一个新的数组，新数组中的元素为 “原数组调用函数处理过后的值”
                if (item.id) {
                    // 是否有版权播放
                    item.license = privileges && !privileges[index].cp
                    ret.push(formatSongInfo(item))
                }
            })
            return ret
        },


    //歌曲毫秒转换处理
        formatSongTime ( duration = 0 ) { //注意：这里是设置默认值，不是赋予操作
            duration = duration? duration / 1000 : 0; //举例：1分钟 = 60000, 除以1000=60
            const m = (Math.floor(duration / 60) + '').padStart(2, '0');//等于01
            const s = (Math.floor(duration % 60) + '').padStart(2, '0');//等于00
            return `${m}:${s}`;//得01:00
        },

    //时间处理
        formatTime(duration) {
            let date = '';
            const now = new Date();
            const past =  new Date(duration);

            //判断是否为当天时间
            if(now.toDateString() === past.toDateString()) {
                date = this.formartDate(duration, 'HH:mm');
            //判断是否为今年
            } else if( now.getFullYear() === past.getFullYear()) {
                date = this.formartDate(duration, 'MM月dd日 HH:mm');
            //正常显示，如果不做美观，上面不做要求,直接这样写就行
            } else {
                date = this.formartDate(duration, 'yyyy年MM月dd日');
            }

            return date
        },

    //添加歌曲到播放列表 ，过滤掉重复的歌曲
        concatPlayList (newList = [], oldList =[] ) { //同理，这也不是赋值操作，而是设置默认值
            const arr = [...oldList, ...newList]; // 摊开语法
            const map = new Map();
            
            //遍历arr数组里的每个元素
            for(const item of arr ) {
                //添加个新的数组map，如果有相同就跳过
                if(!map.has(item.id)) { 
                    map.set(item.id, item)
                }
            }
            
            return [...map.values()] // 返回map中的所有值
        }
}