let httpBaseUrl = () => {
	return "http://localhost:8090";
}

let socketBaseUrl = () => {
	return "ws://localhost:8867/im";
}

export default {
	httpBaseUrl,
	socketBaseUrl
}
