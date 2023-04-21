<template>
  <view>
    <view class="goods-item">
      <!-- 左侧图片 -->
      <view class="goods-item-left">
        <!-- 如果商品图片不存在，默认用default图片 -->
        <image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
      </view>
      <!-- 右侧文字 -->
      <view class="goods-item-right">
        <view class="goods-name">{{goods.goods_name}}</view>
        <view class="goods-info-box">
          <!-- 在渲染商品价格的时候，通过管道符 | 调用过滤器 -->
          <view class="goods-price">¥ {{goods.goods_price | tofixed}}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name:"my-goods",
    // 父组件传递goods商品信息过来
    props:{
      goods:{
        type:Object,
        default:{}
      }
    },
    data() {
      return {
        defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png', // 默认的空图片
        
      };
    },
    filters:{
      tofixed(num){
        return Number(num).toFixed(2)
      },
    },
  }
</script>

<style lang="scss">
  .goods-item{
    display: flex;
    padding: 10px 5px;
    border: 1px solid #efefef;
    .goods-item-left{
      margin-right: 10px;
      .goods-pic{
        width: 100px;
        height: 100px;
        // 防止图片下面有空白信息
        display: block;
      }
    }
    .goods-item-right{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .goods-name{
        font-size: 14px;
      }
      .goods-price{
        color: #C00000;
        font-size: 16px;
      }
    }
  }
</style>