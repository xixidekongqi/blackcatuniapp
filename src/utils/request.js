// src/utils/request.js
const BASE_URL = '/api' // 配合 vite.config.js 的代理

export const request = (options) => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: BASE_URL + options.url,
            method: options.method || 'GET',
            data: options.data || {},
            header: {
                'Content-Type': 'application/json',
                // 如果以后需要登录取 token，就加上这段
                ...(uni.getStorageSync('token') ? { Authorization: 'Bearer ' + uni.getStorageSync('token') } : {})
            },
            success: (res) => {
                // 核心：你的后端业务错误返回 HTTP 200，错误码在 res.data.code
                if (res.data.code === 200) {
                    resolve(res.data.data) // 直接吐出 data，业务层少写一层 .data
                } else if (res.data.code === 401) {
                    uni.removeStorageSync('token')
                    uni.showToast({ title: '请先登录', icon: 'none' })
                    // 暂时没配登录页，先注释掉
                    // uni.navigateTo({ url: '/pages/login/login' })
                    reject(res.data)
                } else {
                    uni.showToast({ title: res.data.msg || '请求失败', icon: 'none' })
                    reject(res.data)
                }
            },
            fail: (err) => {
                uni.showToast({ title: '网络异常', icon: 'none' })
                reject(err)
            }
        })
    })
}