import userApi from "./userApi";
import messageApi from "./messageApi";
import groupApi from "./groupApi";
import friendApi from "./friendApi";
import ossApi from "./ossApi";

const api = {
    ...userApi,
    ...messageApi,
    ...groupApi,
    ...friendApi,
    ...ossApi
}

export default api;