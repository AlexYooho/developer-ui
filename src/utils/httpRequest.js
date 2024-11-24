import axios from "axios";
import router from "@/router";
import { Message } from 'element-ui';

const http = axios.create({
    baseURL: "http://localhost:9009",
    timeout: 30000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
})

// 请求
http.interceptors.request.use(config => {
    let authorization = sessionStorage.getItem("accessToken");
    if(authorization){
        config.headers.authorization = "Bearer " + authorization;
    }
    return config;
},error => {
    return Promise.reject(error)
})

// 响应
http.interceptors.response.use(async response => {
    if(response.data.code == 200){
        return response.data.data;
    } else if(response.data.code == 400){
        router.replace("/home");
    } else if(response.data.code == 401){
        console.log("token失效，尝试重新获取")
        let refreshToken = sessionStorage.getItem("refreshToken");
        if(!refreshToken){
            router.replace("/home");
        }

        const data = await http({
            method: 'GET',
            url: '/refreshToken',
            headers: {
                refreshToken: refreshToken
            }
        }).catch(() => {
            router.replace("/home")
        })

        sessionStorage.setItem("token",data.accessToken);
        sessionStorage.setItem("refreshToken",data.refreshToken);
        response.config.headers=undefined;
        return http(response.config);
    } else {
        Message.error(response.data.msg);
        return Promise.reject(response.data);
    }
}, error => {
    switch (error.response.status) {
		case 400:
            alert(error.response.data);
			break
		case 401:
			router.replace("/home");
			break
		case 405:
            alert("http请求方式有误");
			break
		case 404:
		case 500:
            alert("服务器出了点小差，请稍后再试");
			break
		case 501:
            alert("服务器不支持当前请求所需要的某个功能");
			break
	}

	return Promise.reject(error)
})

export default http
