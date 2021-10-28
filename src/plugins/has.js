import storage from "../utils/storage"

const has = {
    beforeMount(el,binding) {
        //获取按钮权限
        let userAction = storage.getItem('actionList')
        let value = binding.value
        console.log('12312312',userAction,value)
        //盘点列表中是否有对应按钮权限标识
        let hasPermission = userAction.includes(value)
        if(!hasPermission){
            el.style = 'display:none'
            setTimeout(() => {
                el.parentNode.removeChild(el)
            },0)
            
        }
    },
}

const directives = {
    has
}

export default {
    install(Vue){
        Object.keys(directives).forEach((keys) => {
            Vue.directive(keys,directives[keys])
        })
    }
}