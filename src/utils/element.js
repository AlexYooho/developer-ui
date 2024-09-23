let fixTop = (e) => {
	var offset = e.offsetTop
	if (e.offsetParent != null) {
		offset += fixTop(e.offsetParent)
	}
	return offset
}

let fixLeft = (e) => {
	var offset = e.offsetLeft
	if (e.offsetParent != null) {
		offset += fixLeft(e.offsetParent)
	}
	return offset
}

let setTitleTip = (tip) => {
	let title = "开发者社群";
	if(tip){
		title = `(${tip})${title}`;
	}
	document.title =title;
	
}

export default{
	fixTop,
	fixLeft,
	setTitleTip
}
