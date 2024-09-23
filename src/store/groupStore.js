import http from '../utils/httpRequest.js'
import api from '../api/api.js'

export default{
    state: {
		groups: [],
		activeIndex: -1,
	},

    mutations: {
		setGroups(state, groups) {
			state.groups = groups;
		},
		activeGroup(state, index) {
			state.activeIndex = index;
		},
		addGroup(state, group) {
			state.groups.unshift(group);
		},
		removeGroup(state, groupId) {
			state.groups.forEach((g, index) => {
				if (g.id == groupId) {
					state.groups.splice(index, 1);
					state.activeIndex = -1;
				}
			})

		},
		updateGroup(state, group) {
			state.groups.forEach((g, idx) => {
				if (g.id == group.id) {
					// 拷贝属性
					Object.assign(state.groups[idx], group);
				}
			})
		},
		clear(state){
			state.groups = [];
			state.activeGroup = -1;
		}
	},

    actions:{
        loadGroup(context){
            return new Promise((resolve, reject) => {
				api.getGroupList().then((groups) => {
					context.commit("setGroups", groups);
					resolve();
				}).catch((res) => {
					reject(res);
				})
			});
        }
    }
}