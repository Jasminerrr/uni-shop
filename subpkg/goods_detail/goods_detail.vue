<template>
  <!-- 解决商品价格闪烁的问题：判断 goods_info.goods_name 属性的值是否存在，从而使用 v-if 指令控制页面的显示与隐藏-->
  <view v-if="goods_info.goods_name" class="goods-detail-container ">
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item,i) in goods_info.pics" :key="i">
          <!-- 把当前点击的图片的索引，传递到 preview() 处理函数中 -->
        <image :src="item.pics_big" @click="preview(i)"></image>
      </swiper-item>
    </swiper>
    
    <!-- 商品信息区域 -->
    <view class="goods-info-box">
      <view class="goods-price">¥ {{goods_info.goods_price}}</view>
      <view class="goods-info-body">
        <view class="goods-name">{{goods_info.goods_name}}</view>
        <view class="favi">
          <uni-icons type="star" size="22" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <view class="yf">快递：免运费</view>
    </view>
    
    <!-- 详情图片:使用 rich-text 组件的nodes属性，将带有 HTML 标签的内容，渲染为小程序的页面结构 -->
    <rich-text :nodes="goods_info.goods_introduce"></rich-text>
    
    <!-- 商品导航区 -->
    <view class="goods_nav">
      <!-- fill 控制右侧按钮的样式 -->
      <!-- options 左侧按钮的配置项 -->
      <!-- buttonGroup 右侧按钮的配置项 -->
      <!-- click 左侧按钮的点击事件处理函数 -->
      <!-- buttonClick 右侧按钮的点击事件处理函数 -->
      <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick" @buttonClick="buttonClick" />
    </view>
  </view>
</template>

<script>
  // 按需导入 mapMutations 这个辅助方法
  import { mapState,mapMutations,mapGetters } from 'vuex'
  export default {
    data() {
      return {
        goods_info:{}, // 商品详情对象
        // 左侧按钮组的配置对象
        options: [
          {
          icon: 'shop',
          text: '店铺'
          },
          {
          icon: 'cart',
          text: '购物车',
          info: 0 // 右上角数字图标
          },
        ],
        // 右侧按钮组的配置对象
        buttonGroup: [
          {
            text: '加入购物车',
            backgroundColor: '#ff0000',
            color: '#fff'
          },
          {
            text: '立即购买',
            backgroundColor: '#ffa200',
            color: '#fff'
          }
        ],
        
      };
    },
    
    onLoad(options) {
      // 获取商品 Id
      const goods_id = options.goods_id
      // 获取商品详情
      this.getGoodsDetail(goods_id)
      
    },
    
    methods:{
      // 把 m_cart 模块中的 addToCart 方法映射到当前页面使用
      // ...mapMutations('模块的名称', ['要映射的数据名称1', '要映射的数据名称2'])
      ...mapMutations('m_cart',['addToCart']),

      // 获取商品详情
      async getGoodsDetail(goods_id){
        const {data:res} = await uni.$http.get('/api/public/v1/goods/detail',{ goods_id })
        if(res.meta.status !== 200) return uni.$showMsg()
          // 使用字符串的 replace() 方法，为 img 标签添加行内的 style 样式，从而解决图片底部空白间隙的问题
          res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g,'<img style="display:block;"').replace(/webp/g,'jpg')
        this.goods_info = res.message
      },
      
      // 点击图片放大预览：调用 uni.previewImage() 方法
      preview(i){
        uni.previewImage({
          // 预览默认显示图片的索引
          current:i, 
          // 用map将图片遍历,返回新数组放入urls:存放所有图片url地址的数组
          urls:this.goods_info.pics.map((item)=>{
            return item.pics_big
          })
        })
      },
      
      // 导航栏左侧按钮的点击事件处理函数
      // 事件对象e中包含当前点击按钮的相关信息
      onClick(e){
        // 判断是否是购物车,是的话跳转购物车页面
        if(e.content.text === '购物车'){
          uni.switchTab({
            url:'/pages/cart/cart'
          })
        }
      },
      
      // 右侧按钮的点击事件处理函数
      buttonClick(e){
        console.log(e);
        // 1. 判断是否点击了 加入购物车 按钮
        if(e.content.text === '加入购物车'){
          // 2.定义一个商品对象goods，并整理商品的信息
          const goods = {
            goods_id :this.goods_info.goods_id,
            goods_name :this.goods_info.goods_name,
            goods_price :this.goods_info.goods_price,
            goods_count:1, // 商品数量，默认为1
            goods_small_logo :this.goods_info.goods_small_logo,
            goods_state :true, // 商品的勾选状态
          }
          // 3. 调用vuex中映射的加入购物车方法，将商品对象传过去
          this.addToCart(goods)
        }
      },
      
      
    },
    
    // 计算属性
    computed:{
      ...mapState('m_cart',['cart']),
      ...mapGetters('m_cart',['total']),
    },
    
    // 监听器
    watch: {
      //  定义 total 侦听器，指向一个配置对象
      total:{
        // 1. handler 属性用来定义侦听器的 function 处理函数,通过第一个形参得到变化后的新值
        handler(newValue) {
          // 2. 通过数组的 find() 方法，找到购物车按钮的配置对象，并返回当前这项
          const findResult = this.options.find( item => item.text === '购物车')
          // 3. 如果有的话,则将新值赋值给info（findResult为当前购物车的配置对象）
          if(findResult){
            findResult.info = newValue
          }
        },
        // immediate 属性用来声明此侦听器，是否在页面初次加载完毕后立即调用
        immediate:true
      },
    },
    
    
  }
</script>

<style lang="scss">
  swiper{
    height: 700rpx;
    image{
      width: 100%;
      height: 100%;
    }
  }
  .goods-info-box{
    padding: 32rpx 18rpx;
    .goods-price{
      color: #C00000;
      font-size:20px;
      padding: 10rpx 0;
    }
    .goods-info-body{
      display: flex;
      justify-content: space-between;
      .goods-name{
        margin-right: 16rpx;
      }
      .favi{
        width: 280rpx;
        border-left: 1px solid #efefef;
        color: gray;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    }
    .yf{
      color: gray;
      margin: 18rpx 0 ;
    }
  }
  .goods_nav{
      // 为商品导航组件添加固定定位
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }
  .goods-detail-container{
    // 给页面外层的容器，添加 50px 的内padding，
    // 防止页面内容被底部的商品导航组件遮盖
    padding-bottom: 100rpx;
  }
</style>
