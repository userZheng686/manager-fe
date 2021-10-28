import api from '../api/index'
const actions = {
    queryMenuList({commit},query){
        return new Promise(async (resolve,reject) => {
            try {
                let res = await api.getMenuList(query)
                commit('saveUserMenu',res)
                resolve(res)
            }catch (err){
                reject(err)
            }
        })
        
    }
}

export default actions