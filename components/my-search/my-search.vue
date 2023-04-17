<template>
  <view class="search-container" :style="{'background-color':bgcolor}" @click="searchBoxHandler">
    <view class="search-box" :style="{'border-radius':radius + 'px'}">
      <!-- 使用uni-ui提供的ui组件 -->
      <uni-icons type="search" size="17"></uni-icons>
      <text class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script>
  export default {
    name:"my-search",
    props:{
      // 背景颜色
      bgcolor:{
        type:String,
        default:'#C00000'
      },
      // 圆角尺寸
      radius:{
        type:Number,
        default:18 // 单位是px
      },
    },
    data() {
      return {
        
      };
    },
    methods:{
      searchBoxHandler(){
        // $emit('事件名')触发父组件里面的自定义事件（父子通信）
        this.$emit('click')
      },
    },
  }
</script>

<style lang="scss">
  .search-container{
    height: 50px;
    display: flex;
    // 让里面的子盒子垂直居中
    align-items: center;
    .search-box{
      width: 100%;
      height: 36px;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0px 10px;
    }
    .placeholder{
      font-size: 15px;
      margin-left: 5px;
    }
  }
</style>