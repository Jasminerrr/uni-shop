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
    <view class="btn-settle">结算({{checkCount}})</view>
  </view>
</template>

<script>
  import { mapGetters,mapMutations } from 'vuex'
  export default {
    name:"my-settle",
    data() {
      return {
        
      };
    },
    
    methods:{
      ...mapMutations('m_cart',['updateAllGoodsState']),
      // 修改购物车中所有商品的选中状态
      changeAllState(){
        // !this.isFullCheck：当前全选按钮的状态取反之后，就是最新的勾选状态
        this.updateAllGoodsState(!this.isFullCheck)
      },
    },
    
    computed:{
      ...mapGetters('m_cart',['checkCount','total','checkedGoodsAmount']),
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