import App from './App'

// #ifndef VUE3
import Vue from 'vue'

// 导入网络请求的包
import {
  $http
} from '@escook/request-miniprogram'
// 挂载到顶级对象身上
uni.$http = $http

// 配置请求的根路径
$http.baseUrl = 'https://www.uinav.com'

// 挂载请求拦截器
$http.beforeRequest = function(options) {
  // 展示loading效果
  uni.showLoading({
    title: '数据加载中',
  })
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
  ...App
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