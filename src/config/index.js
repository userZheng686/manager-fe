/**
 * 环境配置封装
 */

const env = import.meta.env.MODE || 'prod'
const EnvConfig = {
    dev : {
        baseApi : '/api',
        mockApi : 'https://www.fastmock.site/mock/c1c302e8baed9894c48c17e4738c092e/api'
    },
    test : {
        baseApi : '/',
        mockApi : 'https://www.fastmock.site/mock/c1c302e8baed9894c48c17e4738c092e/api'
    },
    prod : {
        baseApi : '/',
        mockApi : 'https://www.fastmock.site/mock/c1c302e8baed9894c48c17e4738c092e/api'
    }
}

export default{
    namespace : 'manager',
    env,
    mock : false,
    ...EnvConfig[env]
}