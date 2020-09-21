import emojiList from '@/libs/emoji'
// function geterPsonInfoXY(event) {
// 	let winW = window.innerWidth
//     let winH = window.innerHeight
//     let domH = 520, domW = 320, margin = 30
//     let x = event.x, y = event.y - margin

//     if (winH - (event.y + domH) <= 0) {
//         y = winH - domH - margin
//     }
//     // 默认显示右边
//     if (winW > event.x + domW + margin) {
//         x = event.x + margin
//     } else {
//         x = event.x - domW - margin
//     }

//     return {x, y}
// }

/*
    替换表情符号为图片
*/
function replaceEmoji(str, emojiSize) {
    // 正则表达式匹配内容
    let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g, (item, index) => {
        for (let i = 0; i < emojiList.length; i++) {
            let emoji = emojiList[i]
            if (emoji.alt == item) {
                let imgstr = `<img style="width:${emojiSize ? emojiSize + 'px' : '24px'};height:${emojiSize ? emojiSize+'px' : '24px'};display:inline-block;" src="${emoji.url}" />`
                return imgstr
            }
        }
        return item 
    })

    return replacedStr
}

// 节流
function throttle(func, delay = 60) {
    let lock = false
    return (...args) => {
        if (lock) return
        lock = true
        func(...args)
        setTimeout(()=>{
            lock = false
        }, delay)
    }
}

export {
	// geterPsonInfoXY,
    replaceEmoji
}