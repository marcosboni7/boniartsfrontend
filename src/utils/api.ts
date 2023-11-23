import axios from 'axios'
import Cookies from 'js-cookie'

const isProduction = process.env.NEXT_PUBLIC_PRODUCTION === 'true'
const productionApi = process.env.NEXT_PUBLIC_PRODUCTION_API
const developmentApi = process.env.NEXT_PUBLIC_DEVELOPMENT_API

const api = axios.create({
    baseURL: isProduction ? productionApi : developmentApi,
    headers: {
        Authorization: `bearer ${Cookies.get('authorization')}`,
    },
})

export default api
