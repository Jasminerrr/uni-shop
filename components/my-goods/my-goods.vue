<template>
  <view>
    <view class="goods-item">
      <!-- 左侧图片 -->
      <view class="goods-item-left">
        <!-- 勾选框组件，状态是checked -->
        <radio :checked="goods.goods_state" color="#C00000" v-if="showRadio" @click="radioClickHandler"></radio>
        <!-- 如果商品图片不存在，默认用default图片 -->
        <image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
      </view>
      <!-- 右侧文字 -->
      <view class="goods-item-right">
        <view class="goods-name">{{goods.goods_name}}</view>
        <view class="goods-info-box">
          <!-- 在渲染商品价格的时候，通过管道符 | 调用过滤器 -->
          <view class="goods-price">¥ {{goods.goods_price | tofixed}}</view>
          <!-- number-box:数字输入框，min：指定最小值，value：指定数量 -->
          <uni-number-box :min="1" :value="goods.goods_count" v-if="showNum" @change="numChangeHandler"></uni-number-box>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name:"my-goods",
    // 接收其他组件传递的信息
    props:{
      // 父组件传的goods商品信息
      goods:{
        type:Object,
        default:{}
      },
      // 购物车勾选框
      showRadio:{
        type:Boolean,
        default:false // 默认不会展示勾选框组件
      },
      // 是否展示购物车数量框的number-box组件
      showNum:{
        type:Boolean,
        default:false // 默认不会展示数量组件
      },
    },
    data() {
      return {
        defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png', // 默认的空图片
        
      };
    },
    
    filters:{
      tofixed(num){
        // 保留两位小数
        return Number(num).toFixed(2)
      },
    },
    
    methods:{
      // 这是radio点击处理函数
      radioClickHandler(){
        // 在此组件触发父组件传过来的自定义事件，并传参过去
        this.$emit('radio-change',{
          goods_id : this.goods.goods_id,
          // 需要最新点击的状态(取反)
          goods_state : !this.goods.goods_state
        })
      },
      
      // 监听 numberBox 数量变化的事件(val为变化的新值，uniapp封装的)
      numChangeHandler(val){
        // 触发父组件的自定义事件，并传参
        this.$emit('num-change',{
          goods_id : this.goods.goods_id,
          goods_count : +val // 因为无法保证val永远都是个数值，+是可以转换为一个真正的数字
        })
      },
      
      
    },
  }
</script>

<style lang="scss">
  .goods-item{
    width: 750rpx;
    box-sizing: border-box;
    display: flex;
    padding: 10px 5px;
    border: 1px solid #efefef;
    .goods-item-left{
      display: flex;
      justify-content: space-between;
      align-items: center;
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
      // 让右边的盒子占满整个区域
      flex: 1;
      flex-direction: column;
      justify-content: space-between;
      margin-right: 10rpx;
      .goods-name{
        font-size: 14px;
      }
      .goods-info-box{
        display: flex;
        // 两边贴边对齐
        justify-content: space-between;
        align-items: center;
        .goods-price{
          color: #C00000;
          font-size: 16px;
        }
      }
      
    }
  }
</style>