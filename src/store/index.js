/**
 Vuex状态管理
 */
import {createStore} from 'vuex'
import mutations from './mutations'
import getters from './getters'
import actions from './actions'
import storage from './../utils/storage'

const state = {
    userInfo : "" || storage.getItem('userInfo'), //获取用户信息
    menuList : [] || storage.getItem('menuList'),//获取菜单信息
    actionList : [] || storage.getItem('actionList'),//按钮列表
}
export default createStore({
    state,
    mutations,
    getters,
    actions
})