export default {
  namespaced:true,
  // 由于大括号被解释为代码块，所以如果箭头函数直接返回一个对象，必须在对象外面加上括号，否则会报错。 
  state:() => ({
    // 3. 读取本地的收货地址数据，初始化 address 对象
    address:JSON.parse(uni.getStorageSync('address')||'{}'),
    token:uni.getStorageSync('token')||'',
    userinfo:JSON.parse(uni.getStorageSync('userinfo')||'{}'),
    // 重定向的 object 对象 { openType, from }
    redirectInfo:null
  }),
  
  mutations:{
    // 更新收货地址,第一个参数永远是state,第二个参数是外界传的
    updateAddress(state,address){
      state.address = address
      // 2. 通过 this.commit() 方法，调用 m_user 模块下的 saveAddressToStorage 方法将 address 对象持久化存储到本地(这样外界调用更新收货地址时，都会将地址持久化存储)
      this.commit('m_user/saveAddressToStorage')
    },
    
    // 1. 定义将 address 持久化存储到本地 mutations 方法
    saveAddressToStorage(state){
      uni.setStorageSync('address',JSON.stringify(state.address))
    },
    
    // 更新用户的基本信息，存储到 vuex 
    updateUserInfo(state,userinfo){
      state.userinfo = userinfo
      this.commit('m_user/saveUserInfoToStorage')
    },
    
    // 持久化存储用户信息
    saveUserInfoToStorage(state){
      uni.setStorageSync('userinfo',JSON.stringify(state.userinfo))
    },
   
   // 更新token字符串，存储到 vuex 
   updateToken(state,token){
     state.token = token
     this.commit('m_user/saveTokenToStorage')
   },
   
   // 持久化存储token
   saveTokenToStorage(state){
     uni.setStorageSync('token', state.token)
   }, 
    
    // 更新重定向对象，将对象信息存储到 vuex 
    updateRedirectInfo(state,info){
      state.redirectInfo = info
    },
  },
  
  
  getters:{
    // 收货详细地址的计算属性
    addstr(state){
      // 如果收货地址为空,则返回空字符串
      if(!state.address.provinceName) return ''
      // 拼接 省，市，区，详细地址 的字符串并返回给用户
      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
    },
  },
}