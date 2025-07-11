import userApi from "./userApi";
import messageApi from "./messageApi";
import groupApi from "./groupApi";
import friendApi from "./friendApi";
import ossApi from "./ossApi";
import paymentApi from "./payment";

const api = {
    ...userApi,
    ...messageApi,
    ...groupApi,
    ...friendApi,
    ...ossApi,
    ...paymentApi
}

export default api;