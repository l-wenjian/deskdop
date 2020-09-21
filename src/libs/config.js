export let serveUrl = `http://localhost:3300`

export function setItem (str, data) {
	localStorage.setItem(str, JSON.stringify(data))
}

export function getItem(str) {
	let listStr = localStorage.getItem(str)
	if (listStr) {
		return JSON.parse(listStr)
	} else {
		return null
	}
}