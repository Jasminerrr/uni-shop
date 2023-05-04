// 1. 导入Vue和Vuex
import Vue from 'vue'
import Vuex from 'vuex'
// 导入购物车的 vuex 模块
import moduleCart from './cart.js'
// 导入用户的 vuex 模块
import moduleUser from './user.js'

// 2. 将Vuex安装为Vue的插件
Vue.use(Vuex)

// 3. 创建store实例对象
const store = new Vuex.Store({
  // 挂载store模块
  modules:{
    // 挂载购物车的 vuex 模块，访问路径是 m_cart/cart
    'm_cart':moduleCart,
    // 挂载用户的 vuex 模块，m_user/user
    'm_user':moduleUser
  },
})

// 4. 向外共享事例
export default store