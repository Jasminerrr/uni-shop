<template>
  <view class="my-settle-container">
    <!-- 全选 -->
    <label class="radio">
      <radio color="#C00000" :checked="isFullCheck" @click="changeAllState"/><text>全选</text>
    </label>
    
    <!-- 合计 -->
    <view class="amount-box">
      合计：<text class="amount">¥{{checkedGoodsAmount}}</text>
    </view>
    
    <!-- 结算 -->
    <view class="btn-settle" @click="settlement">结算({{checkCount}})</view>
  </view>
</template>

<script>
  import { mapGetters,mapMutations,mapState } from 'vuex'
  export default {
    name:"my-settle",
    data() {
      return {
        second:3, // 倒计时的秒数
        timer:null, // 定时器的 Id
      };
    },
    
    methods:{
      ...mapMutations('m_cart',['updateAllGoodsState']),
      ...mapMutations('m_user',['updateRedirectInfo']),
      // 修改购物车中所有商品的选中状态
      changeAllState(){
        // !this.isFullCheck：当前全选按钮的状态取反之后，就是最新的勾选状态
        this.updateAllGoodsState(!this.isFullCheck)
      },
      
      // 结算按钮事件
      settlement(){
        // 1.判断是否勾选了结算商品
        if(!this.checkCount) return uni.$showMsg('请选择要结算的商品!')
        // 2.判断是否有收货地址
        if(!this.addstr) return uni.$showMsg('请选择收货地址！')
        // 3. 最后判断用户是否登录了，如果没有登录，则调用 delayNavigate() 进行倒计时的导航跳转
        // if(!this.token) return uni.$showMsg('请先登录！')
        if(!this.token) return this.delayNavigate()
        // 4。实现微信支付功能
        this.payOrder()
      },
      
      // 展示登录倒计时的提示信息(n是外界传过来的秒数，初始值为3)，
      showTips(n){
        // 调用 uni.showToast() 方法，展示提示消息
        uni.showToast({
          icon:'none',
          title:'请登录后再结算！' + n + '秒后自动跳转到登录页',
          // 为页面添加透明遮罩，防止点击穿透
          mask:true,
          // 1.5 秒后自动消失
          duration:1500
        })
      },
      
      // 延迟导航到 my 页面,初步实现倒计时的提示功能
      delayNavigate(){
        // 把 data 中的秒数重置成 3 秒
        this.second = 3
        // 1. 展示提示消息，此时 seconds 的值等于 3
        this.showTips(this.second)
        // 2. 创建定时器，每隔 1 秒执行一次
        this.timer = setInterval(() => {
          // 2.1 先让秒数自减 1
          this.second--
          // 2.2 判断定时器是否<=0
          if(this.second <= 0){
            // 时间到0清除定时器
            clearInterval(this.timer)
            // 并且跳转到my登录页
            uni.switchTab({
              url:'/pages/my/my',
              // 页面跳转成功之后的回调函数
              // 返回页面的信息对象，主要包含 { openType, from } 两个属性，openType:以哪种方式导航回之前的页面；from:之前页面的 url 地址；
              success:() => {
                // 调用 vuex 的 updateRedirectInfo 方法，把跳转信息存储到 Store 中
                this.updateRedirectInfo({                 
                  openType: 'switchTab', // 跳转的方式                 
                  from: '/pages/cart/cart'  // 从哪个页面跳转过去的
                })
              }
            })
            // 2.3 终止后续代码的运行（当秒数为 0 时，不再展示 toast 提示消息）
            return
          }
          // 2.2 再根据最新的秒数，进行消息提示
          this.showTips(this.second)
        },1000)
      },
      
      // 微信支付回调
      async payOrder(){
        // 1.创建订单
        // 1.1 整理订单的信息对象
        const orderInfo = {
          // 开发期间，注释掉真实的订单价格，
          // order_price: this.checkedGoodsAmount,
          order_price : 0.01, // 写死订单总价为 1 分钱
          consignee_addr:this.addstr,
          goods:this.cart.filter( item => item.goods_state).map(item => ({
            goods_id:item.goods_id,
            goods_number:item.goods_count,
            goods_price:item.goods_price
          }))
        }
        // 1.2 发请求创建订单
        const {data:res} = await uni.$http.post('/api/public/v1/my/orders/create',orderInfo)
        if(res.meta.status !== 200) return uni.$showMsg('创建订单失败！')
        // 1.3 得到服务器响应的“订单编号”
        const orderNumber = res.message.orderNumber
        console.log(orderNumber);
      },
    },
    
    computed:{
      ...mapGetters('m_cart',['checkCount','total','checkedGoodsAmount']),
      // addstr 是详细的收货地址
      ...mapGetters('m_user', ['addstr']),
      ...mapState('m_user', ['token',]),
      ...mapState('m_cart', ['cart',]),
      // 动态渲染是否全选
      isFullCheck(){
        return this.total === this.checkCount
      },
    },
  }
</script>

<style lang="scss">
  .my-settle-container{
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100rpx;
    margin-left: 10rpx;
    background-color: #fff;
    .radio{
      display: flex;
      align-items: center;
    }
    .amount{
      color: #C00000;
    }
    .btn-settle{
      background-color: #C00000;
      height: 100rpx;
      color: #fff;
      line-height: 100rpx;
      padding: 0 20rpx;
      min-width: 200rpx;
      text-align: center;
    }
  }
</style>