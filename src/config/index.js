const env = import.meta.env.MODE || 'prod'
const EnvConfig = {
    dev : {
        baseApi : '/',
        mockApi : 'https://www.fastmock.site/mock/eb848828aa92ca8ec4b39a0ed23a828a/api'
    },
    test : {
        baseApi : '/',
        mockApi : ''
    },
    prod : {
        baseApi : '/',
        mockApi : ''
    }
}

export default{
    env,
    mock : true,
    baseApi : ''
}