<template>
  <view>
    <!-- 顶部搜索区域 -->
    <view class="search-box">
      <my-search @click="gotoSearch"></my-search>
    </view>
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular="true">
      <swiper-item v-for="(item,i) in swiperList" :key="i">
        <!-- navigator导航组件，配置url跳转地址 -->
        <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 分类导航区域 -->
    <view class="nav-list">
      <view class="nav-item" v-for="(item,i) in navList" :key="i" @click="navHandler(item)">
        <image :src="item.image_src" class="nav-img"></image>
      </view>
    </view>
    <!-- 楼层区域 -->
    <!-- 楼层容器 -->
    <view class="floor-list">
      <!-- 楼层每一个item项 -->
      <view class="floor-item" v-for="(item,i) in floorList" :key="i">
        <!-- 楼层标题 -->
        <image :src="item.floor_title.image_src" class="floor-title"></image>
        <!-- 楼层图片 -->
        <view class="floor-img-box">
          <!-- 左侧盒子 -->
          <navigator class="left-img-box" :url="item.product_list[0].url">
            <image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
          </navigator>
          <!-- 右侧盒子 -->
          <view class="right-img-box">
            <navigator class="right-img-item" v-for="(item2,i) in item.product_list" :key="i" v-if="i !== 0" :url="item2.url">
              <image :src="item2.image_src" :style="{width: item2.image_width + 'rpx'}" mode="widthFix"></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  // 导入自己封装的 mixin 模块
  import badgeMix from '@/mixins/tabbar-badge.js'
  
  export default {
    // 将 badgeMix 混入到当前的页面中进行使用
    mixins:[badgeMix],
    
    data() {
      return {
        swiperList: [], // 轮播图的数据列表
        navList:[], // 分类导航的数据列表
        floorList:[], // 楼层数据列表
      };
    },
    onLoad() {
      // 页面加载时,获取轮播图数据
      this.getSwiperList()
      // 获取分类导航的数据列表
      this.getNavList()
      // 获取楼层数据列表
      this.getFloorList()
    },
    methods: {
      // 获取轮播图数据
      async getSwiperList() {
        // 将res里面的data解构出来并赋值为res（此时res就是data里面的数据）
        const { data: res } = await uni.$http.get('/api/public/v1/home/swiperdata')
        // 请求失败则返回 并调用提示框
        if (res.meta.status !== 200) return uni.$showMsg()
        // 请求成功
        this.swiperList = res.message
      },
      
      // 获取分类导航的数据列表
      async getNavList(){
        const { data: res } = await uni.$http.get('/api/public/v1/home/catitems')
        // 请求失败则返回 并调用提示框
        if (res.meta.status !== 200) return uni.$showMsg()
        // 请求成功
        this.navList = res.message
      },
      
      // 点击分类导航跳转路由
      navHandler(item){
        // 判断如果点击nav是分类，则切换tabbar
        if(item.name === '分类'){
          uni.switchTab({
            url:'/pages/cate/cate'
          })
        }
      },
      
      // 获取楼层数据列表
      async getFloorList(){
        const { data: res } = await uni.$http.get('/api/public/v1/home/floordata')
        // 请求失败则返回 并调用提示框
        if (res.meta.status !== 200) return uni.$showMsg()
        // 请求成功先处理数据,自定义一个url的属性
        res.message.forEach( floor => {
          floor.product_list.forEach( prod => {
            prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
          })
        })
        // 请求成功赋值数据
        this.floorList = res.message
      },
      
      // 点击顶部搜索事件
      gotoSearch(){
        // 导航到分包搜索页面
        uni.navigateTo({
          url:'/subpkg/search/search'
        })
      },
    }
  }
</script>

<style lang="scss">
  // 轮播图
  swiper {
    height: 330rpx;

    .swiper-item,
    image {
      width: 100%;
      height: 100%;
    }
  }
  // 楼层图
  .nav-list{
    display: flex;
    justify-content: space-around;
    margin: 15rpx 0;
    .nav-img{
      width: 128rpx;
      height: 140rpx;
    }
  }
  .floor-title{
    width: 100%;
    height: 60rpx;
  }
  .right-img-box{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  .floor-img-box{
    display: flex;
    padding-left: 10rpx;
  }
  
  // 顶部搜索
  .search-box{
    // 设置定位效果为“吸顶”
    position: sticky;
    // 吸顶的位置
    top: 0;
    z-index: 999;
  }
  
</style>