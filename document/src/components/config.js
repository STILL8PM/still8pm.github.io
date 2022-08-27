const devUrl = '/api'
const productionUrl = 'https://v.api.aa1.cn'

export default {
    baseUrl: process.env.NODE_ENV === 'production' ? productionUrl : devUrl,
    path: '/'
}