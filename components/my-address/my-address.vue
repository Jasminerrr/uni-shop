<template>
  <view>
    <!-- 选择收货地址的按钮,如果地址为空，则显示 -->
    <view class="address-box" v-if="JSON.stringify(address) === '{}'">
      <button type="primary" size="mini" class="btnAddress" @click="chooseAddress">请选择收货地址+</button>
    </view>
    
    <!-- 渲染收货信息的盒子 -->
    <view class="address-info-box" v-else @click="chooseAddress">
      <view class="row1">
        <view class="row1-left">
          <view class="username">收货人：{{address.userName}}</view>
        </view>
        <view class="row1-right">
          <view class="phone">电话：{{address.telNumber}}</view>
          <uni-icons type="arrowright" size="16"></uni-icons>
        </view>
      </view>
      <view class="row2">
        <view class="row2-left">收货地址：</view>
        <view class="row2-right">{{addstr}}</view>
      </view>
    </view>
    
    <!-- 底部边框线 -->
    <image src="/static/cart_border@2x.png" class="address-border"></image>
  </view>
</template>

<script>
  import { mapState,mapMutations,mapGetters } from 'vuex'
  export default {
    name:"my-address",
    data() {
      return {
        // address:{}, // 地址对象
      };
    },
    
    methods:{
      // 把 m_user 模块中的 updateAddress 函数映射到当前组件
      ...mapMutations('m_user',['updateAddress']),
      // 选择收货地址事件
      async chooseAddress(){
        // 1. 调用小程序提供的 chooseAddress() 方法，即可使用选择收货地址的功能
        //  返回值res为成功之后的收货地址对象
        const res = await uni.chooseAddress()
        // 2. 用户成功的选择了收货地址
        if(res.errMsg === 'chooseAddress:ok'){
          // 为 data 里面的收货地址对象赋值
          // this.address = res
          // 将地址存在vuex,将返回的地址传过去
          this.updateAddress(res)
        }
      },
    },
    computed:{
      // 把 m_user 模块中的 address 对象映射当前组件中使用，代替 data 中 address 对象
      ...mapState('m_user',['address']),
      ...mapGetters('m_user',['addstr'])
    }
  }
</script>

<style lang="scss">
  .address-border{
    display: block;
    width: 100%;
    height: 10rpx;
  }
  .address-box{
    height: 180rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .address-info-box{
    height: 160rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 28rpx;
    padding: 0 16rpx;
    .row1{
      display: flex;
      justify-content: space-between;
      margin-bottom: 20rpx;
      .row1-right{
        display: flex;
        align-items: center;
        .phone{
          margin-right: 10rpx;
        }
      }
    }
    .row2{
      display: flex;
      align-items: center;
      .row2-left{
        white-space: nowrap;
      }
    }
  }
</style>