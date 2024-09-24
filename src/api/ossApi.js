import http from '../utils/http'

const ossApi = {
    //file相关
    // 文件上传
    uploadFile(param,headers){
        return http.POST(`/file/upload`,param,headers);
    },

    // 图片上传
    uploadImage(param,headers){
        return http.POST(`/oss/image/upload`,param,headers);
    }
};

export default ossApi;