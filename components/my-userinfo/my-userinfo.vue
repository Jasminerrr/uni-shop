<template>
  <view class="my-userinfo-container">
    <!-- 头像昵称区域 -->
    <view class="top-box">
      <image :src="userinfo.avatarUrl" class="avatar"></image>
      <view class="nickname">{{userinfo.nickName}}</view>
    </view>
    
    <!-- 面板区区域 -->
    <view class="panel-list">
      <!-- 第一个面板 -->
      <view class="panel">
        <!-- 主体区域 -->
        <view class="panel-body">
          <view class="panel-item">
            <text>6</text>
            <text>收藏的店铺</text>
          </view>
          <view class="panel-item">
            <text>14</text>
            <text>收藏的商品</text>
          </view>
          <view class="panel-item">
            <text>16</text>
            <text>关注的商品</text>
          </view>
          <view class="panel-item">
            <text>63</text>
            <text>足迹</text>
          </view>
        </view>
      </view>
      
      <!-- 第二个面板 -->
      <view class="panel">
        <view class="panel-title">
          我的订单
        </view>
        <view class="panel-body">
          <view class="panel-item">
            <image src="/static/my-icons/icon1.png" class="icon"></image>
            <text>待付款</text>
          </view>
          <view class="panel-item">
            <image src="/static/my-icons/icon2.png" class="icon"></image>
            <text>待收货</text>
          </view>
          <view class="panel-item">
            <image src="/static/my-icons/icon3.png" class="icon"></image>
            <text>退款/退货</text>
          </view>
          <view class="panel-item">
            <image src="/static/my-icons/icon4.png" class="icon"></image>
            <text>全部订单</text>
          </view>
        </view>
      </view>
      
      <!-- 第三个面板 -->
      <view class="panel">
        <view class="panel-list-item">
          <text>收货地址</text>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
        <view class="panel-list-item">
          <text>联系客服</text>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
        <view class="panel-list-item" @click="logout">
          <text>退出登录</text>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import { mapState,mapMutations } from 'vuex'
  export default {
    name:"my-userinfo",
    data() {
      return {
        
      };
    },
    
    methods:{
      ...mapMutations('m_user', ['updateAddress','updateUserInfo','updateToken']),
      // 点击退出登录事件
      async logout(){
        // 先弹框询问用户是否退出登录
        const res = await uni.showModal({
          title:'提示',
          content:'确认退出登录吗？'
        }).catch(err => err)
        console.log(res);
        
        // 满足条件：判断用户点击了确认退出登录的操作
        if(res && res.confirm){
          // 需要清空 vuex 中的 userinfo、token 和 address
          this.updateAddress({})
          this.updateUserInfo({})
          this.updateToken('')  
        }
      },
    },
    
    computed:{
      ...mapState('m_user', ['userinfo']),
      
    },
  }
</script>

<style lang="scss">
  // 头像昵称样式
  .my-userinfo-container{
    height: 100%;
    background-color: #f4f4f4;
    .top-box{
      height: 400rpx;
      background-color: #c00000;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .avatar{
        border-radius: 45px;
        height: 180rpx;
        width: 180rpx;
        border: 2px solid #fff;
        box-shadow: 0 1px 5px black;
      }
      .nickname{
        font-size: 32rpx;
        margin-top: 12rpx;
        color: white;
        font-weight: bold;
      }
    }
  }
  
  // 面板区域样式
  .panel-list{
    padding: 0 10px;
    // 利用相对定位向上移
    position: relative;
    top: -10px;
    
    .panel{
      background-color: #fff;
      border-radius: 4px;
      margin-bottom: 8px;
      
      .panel-title{
        line-height: 45px;
        padding-left: 10px;
        font-size: 30rpx;
        border-bottom: 1px solid #f4f4f4;
      }
      
      .panel-body{
        display: flex;
        justify-content: space-around;
        padding: 10px 0;
        
        .panel-item{
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-size: 26rpx;
          
          .icon{
            width: 35px;
            height: 35px;
          }
        }
      }
    }
  }
  
  .panel-list-item{
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 30rpx;
    padding: 0 10px;
    line-height: 45px;
  }
</style>