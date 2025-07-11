import http from '../utils/http'

const ossApi = {
    //file相关
    // 文件上传
    uploadFile(param,headers){
        return http.POST(`oss-module/api/oss/file/upload`,param,headers);
    },

    // 图片上传
    uploadImage(param){
        return http.POST(`oss-module/api/oss/image/upload`,param);
    }
};

export default ossApi;