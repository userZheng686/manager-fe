/**
 * 环境配置封装
 */

const env = import.meta.env.MODE || 'prod'
const EnvConfig = {
    dev : {
        baseApi : '/',
        mockApi : 'https://www.fastmock.site/mock/eb848828aa92ca8ec4b39a0ed23a828a/api'
    },
    test : {
        baseApi : '/',
        mockApi : 'https://www.fastmock.site/mock/eb848828aa92ca8ec4b39a0ed23a828a/api'
    },
    prod : {
        baseApi : '/',
        mockApi : 'https://www.fastmock.site/mock/eb848828aa92ca8ec4b39a0ed23a828a/api'
    }
}

export default{
    namespace : 'manager',
    env,
    mock : true,
    ...EnvConfig[env]
}