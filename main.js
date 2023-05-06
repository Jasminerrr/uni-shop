import App from './App'

// #ifndef VUE3
import Vue from 'vue'

// 导入store实例对象
import store from '@/store/store.js'

// 导入网络请求的包
import {
  $http
} from '@escook/request-miniprogram'
// 挂载到顶级对象身上
uni.$http = $http

// 配置请求的根路径
$http.baseUrl = 'https://www.uinav.com'
// $http.baseUrl = 'https://www.esinsis.tech'

// 挂载请求拦截器,options包含请求相关的信息
$http.beforeRequest = function(options) {
  // 展示loading效果
  uni.showLoading({
    title: '数据加载中',
  })
  // 在请求头中添加 Token 身份认证的字段：只有在登录之后才允许调用支付相关的接口
  // 判断请求的是否为有权限的 API 接口
  if(options.url.indexOf('/my/') !== -1){
    // 为请求头添加身份认证字段
    options.header = {
      // 字段的值可以直接从 vuex 中进行获取
      Authorization:store.state.m_user.token,
    }
  }
}

// 相应拦截器
$http.afterRequest = function(options) {
  // 隐藏loading
  uni.hideLoading()
}

// 封装提示框,没有传参就使用默认参数
uni.$showMsg = function(title = '数据请求失败！', duration = 1500) {
  // 调用uni的提示框方法
  uni.showToast({
    title,
    duration, // 指定弹窗时间，在规定时间内会隐藏
    icon: 'none' // 消息不需要任何的图标
  })
}

Vue.config.productionTip = false
App.mpType = 'app'

try {
  function isPromise(obj) {
    return (
      !!obj &&
      (typeof obj === "object" || typeof obj === "function") &&
      typeof obj.then === "function"
    );
  }

  // 统一 vue2 API Promise 化返回格式与 vue3 保持一致
  uni.addInterceptor({
    returnValue(res) {
      if (!isPromise(res)) {
        return res;
      }
      return new Promise((resolve, reject) => {
        res.then((res) => {
          if (res[0]) {
            reject(res[0]);
          } else {
            resolve(res[1]);
          }
        });
      });
    },
  });
} catch (error) {}

const app = new Vue({
  ...App,
  // 将 store 挂载到 Vue 实例上
  store
})
app.$mount()
// #endif

// #ifdef VUE3
import {
  createSSRApp
} from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif