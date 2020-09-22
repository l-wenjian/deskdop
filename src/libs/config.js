export let serveUrl = `http://localhost:3300`

export function setItem (str, data) {
	if (typeof data == 'object') {
		localStorage.setItem(str, JSON.stringify(data))
	}else{
		localStorage.setItem(str, data)
	}
}

export function getItem(str) {
	let listStr = localStorage.getItem(str)
	if (listStr) {
		if (listStr.indexOf('{')>-1&&listStr.indexOf('}')>-1) {
			return JSON.parse(listStr)
		} else {
			return listStr
		}
	} else {
		return null
	}
}
export function guid() {
	return Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36);
}