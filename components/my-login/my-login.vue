<template>
  <view class="login-container">
    <!-- 提示登录的图标 -->
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <!-- 登录按钮 -->
    <button type="primary" class="btn-login" @click="getUserProfile">一键登录</button>
    <!-- 登录提示 -->
    <view class="tips-text">登录后尽享更多权益</view>
  </view>
</template>

<script>
  import { mapMutations,mapState } from 'vuex'
  export default {
    name:"my-login",
    data() {
      return {
        
      };
    },
    
    methods:{
      ...mapMutations('m_user',['updateUserInfo','updateToken','updateRedirectInfo']),
      // 点击登录授权事件      
      getUserProfile() {
        uni.getUserProfile({
          desc: '请求授权', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写      
          success: (res) => {      
           // 这部分是更新用户信息的
            this.updateUserInfo(res.userInfo) 
            // 获取登录成功后的token，并传入用户信息
            this.getToken(res)      
          },
          fail: (res) => {
            // console.log(res);
            return uni.$showMsg("已取消登录授权") 
          }     
        })
      },
      
      // 获取登录成功后的token
      getToken(info){
        // 获取code需要调用微信登录的接口
        uni.login({
          provider: 'weixin', //使用微信登录
          success: async res => {
            // 判断是否 uni.login() 调用失败
            if(res.errMsg !== 'login:ok') return uni.$showMsg('登录失败')
            // 准备参数对象
            const query = {
              code:res.code,
              encryptedData:info.encryptedData,
              iv:info.iv,
              rawData:info.rawData,
              signature:info.signature
            }
            // 调用登录接口，换取永久的 token（接口没了）
            // const {data:loginResult} = await uni.$http.post('/api/public/v1/users/wxlogin',query)
            // if(loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
            // 更新 vuex 中的 token(自己定死的假token)
            this.updateToken('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEyLCJpYXQiOjE1MjU0MDIyMjMsImV4cCI6MTUyNTQ4ODYyM30.g-4GtEQNPwT_Xs0Pq7Lrco_9DfHQQsBiOKZerkO-O-o')            
          }
        })        
        // 当登录成功之后，预调用 this.navigateBack() 方法返回登录之前的页面
        this.navigateBack()
      },
      navigateBack(){
        // 判断redirectInfo 不为 null，并且导航方式为 switchTab，则登录成功之后，需要重新导航到对应的页面
        if(this.redirectInfo && this.redirectInfo.openType === 'switchTab' ){
          // 调用小程序提供的 uni.switchTab() API 进行页面的导航
          uni.switchTab({
            // 要导航到的页面地址
            url:this.redirectInfo.from,
            // 导航成功之后，会执行complete(不管成功失败都会调用)，把 vuex 中的 redirectInfo 对象重置为 null
            complete: () => {
              this.updateRedirectInfo(null)
            }
          })
        }
      },
      
    },   
      
      
    computed:{
      ...mapState('m_user',['redirectInfo'])
    },
  }
</script>

<style lang="scss">
.login-container{
  display: flex;
  flex-direction: column;
  height: 750rpx;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  position: relative;
  overflow: hidden;
  .contact-filled{
    
  }
  .btn-login{
    width: 90%;
    border-radius: 100px;
    margin: 15px 0;
    background-color: #C00000;
  }
  .tips-text{
    font-size: 24rpx;
    color: gray;
  }
  &::after{
    content: ' ';
    display: block;
    width: 100%;
    height: 40px;
    background-color: white;
    border-radius: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    transform: translateY(50%);
  }
}
</style>