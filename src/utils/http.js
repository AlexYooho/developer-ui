import httpRequest from './httpRequest'

const http = {
    GET(url,params){
        const config={
            method: 'GET',
            url: url
        }

        if(params)  config.params=params;
        return httpRequest(config);
    },
    POST(url,params,headers){
        const config={
            method: 'POST',
            url: url
        }

        if(params){
            config.data=params;
        }

        if(headers){
            config.headers=headers;
        }

        return httpRequest(config);
    },
    PUT(url,params){
        const config={
            method: 'PUT',
            url: url
        }

        if(params)  config.data=params;
        return httpRequest(config);
    },
    DELETE(url,params){
        const config={
            method: 'DELETE',
            url: url
        }

        if(params)  config.data=params;
        return httpRequest(config);
    }
}

export default http;