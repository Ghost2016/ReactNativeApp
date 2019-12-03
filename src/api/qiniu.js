import { apiFetch, apiPostUpload } from "./apiFetch";
import * as HOSTS from "@src/host";

export const getUploadToken = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/attachment/get_upload_token/`, callBack, params, "POST");
};

/**
存储区域	地域简称	上传域名
华东	z0	服务器端上传：http(s)://up.qiniup.com
客户端上传： http(s)://upload.qiniup.com
华北	z1	服务器端上传：http(s)://up-z1.qiniup.com
客户端上传：http(s)://upload-z1.qiniup.com
华南	z2	服务器端上传：http(s)://up-z2.qiniup.com
客户端上传：http(s)://upload-z2.qiniup.com
北美	na0	服务器端上传：http(s)://up-na0.qiniup.com
客户端上传：http(s)://upload-na0.qiniup.com
东南亚	as0	服务器端上传：http(s)://up-as0.qiniup.com
客户端上传：http(s)://upload-as0.qiniup.com

 */
export const uploadFile = async (formData: object, callBack: () => {}) => {
  return apiPostUpload(HOSTS.UPLOAD, formData, callBack);
};
