// 向外导出cart的vuex模块
export default {
  namespaced:true,
  
  // 模块的 state 数据
  state:() => ({
    // 购物车的数组，用来存储购物车中每个商品的信息对象
    // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    // 项目初始化时,需要为购物车数组重新赋值(在本地读取数据,需要将字符串转换为数组)
    cart: JSON.parse(uni.getStorageSync('cart') || '[]')
  }),
  
  // 修改state数据的方法
  mutations:{
    // 加入购物车方法：接收两个参数,state是模块数据,goods是添加商品信息对象(外界传的)
    addToCart(state,goods){
      // 根据 goods_id 查询购物车中对应商品的信息对象
      // 如果不存在，则 findResult 为 undefined；否则，为查找到的商品信息对象  
      const findResult = state.cart.find((item)=>{
        return item.goods_id === goods.goods_id
      })
      // 如果不存在,直接将商品push到数组里面
      if(!findResult){
        state.cart.push(goods)
      }else{
        // 如果有这个商品,则只用更新数量
        findResult.goods_count++
      }
      // 修改购物车数据后：通过 commit 方法，调用 m_cart 命名空间下的 saveToStorage 方法
      this.commit('m_cart/saveToStorage')
    },
    
    // 本地持久化存储购物车数据
    saveToStorage(state){
      // uniapp的api：将购物车中的数据持久化存储到本地(需要将数组转换为字符串)
      uni.setStorageSync('cart',JSON.stringify(state.cart))
    },
    
    // 更新购物车商品的勾选状态，tate是模块数据,goods是添加商品信息对象(外界传的)
    UpdateGoodsState(state,goods){
      // 通过find方法循环数组每一项，根据 goods_id 查询购物车中对应商品的信息对象
      // 如果不存在，则 findResult 为 undefined；否则，为查找到的商品信息对象  
      const findResult = state.cart.find(item => item.goods_id === goods.goods_id)
      // 如果商品存在,则将状态更新为传过来的最新状态
      if(findResult){
        findResult.goods_state = goods.goods_state
        // 持久化存储本地
        this.commit('m_cart/saveToStorage')
      }
    },
    
    // 更新购物车商品的数量
    UpdateGoodsCount(state,goods){
      // 通过find方法循环数组每一项，根据 goods_id 查询购物车中对应商品的信息对象
      const findResult = state.cart.find(item => item.goods_id === goods.goods_id)
      // 找到该商品,更新商品数量
      if(findResult){
        findResult.goods_count = goods.goods_count
        // 持久化存储本地
        this.commit('m_cart/saveToStorage')
      }
    },
    
    // 根据ID从购物车中删除对应的商品信息
    removeGoodsById(state,goods_id){
      // filter过滤:返回符合条件组成的新数组
      state.cart = state.cart.filter(item => item.goods_id !== goods_id)
      // 持久化存储本地
      this.commit('m_cart/saveToStorage')
    },
    
    // 更新所有商品的勾选状态
    updateAllGoodsState(state,newState){
      // 循环更新购物车中每件商品的勾选状态
      state.cart.forEach(item => item.goods_state = newState)
      // 持久化存储状态
      this.commit('m_cart/saveToStorage')
    },
    
    
  },
  
  getters:{
    // info数量的方法（购物车所有商品总数量ß）
    total(state){
      // let c = 0
      // 循环购物车数组商品的数量并累加
      // state.cart.forEach(item => c += item.goods_count)
      //   return c
      return state.cart.reduce((total,item) => total += item.goods_count,0)
    },
    
    // 勾选商品的总数量
    checkCount(state){
      // 先使用 filter 方法，从购物车中过滤器已勾选的商品
      // 再使用 reduce(回调，起始值) 方法，将已勾选的商品总数量进行累加
      // reduce() 的返回值就是已勾选的商品的总数量
      return state.cart.filter(item => item.goods_state).reduce((total,item) => total += item.goods_count,0)
    },
    
    // 已勾选商品的总价格
    checkedGoodsAmount(state){
      // 先使用 filter 方法，从购物车中过滤器已勾选的商品
      // 再使用 reduce 方法，将已勾选的商品数量 * 单价之后，进行累加
      // reduce() 的返回值就是已勾选的商品的总价
      // 最后调用 toFixed(2) 方法，保留两位小数
      return state.cart.filter(item => item.goods_state).reduce((total,item) => total += item.goods_count * item.goods_price,0).toFixed(2)
    },
  }
}