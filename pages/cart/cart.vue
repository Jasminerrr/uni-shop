<template>
  <view class="cart-container" v-if="cart.length !== 0">
    <!-- 收货地址组件 -->
    <my-address></my-address>
    
    <!-- 购物车商品列表的标题区域 -->
    <view class="cart-title">
      <uni-icons type="shop" size="24"></uni-icons>
      <text class="cart-title-text">购物车</text>
    </view>
    
    <!-- uni-swipe-action 是外层包裹性质的容器 -->
    <uni-swipe-action>
      <!-- 循环渲染购物车中商品列表区域 -->
      <block v-for="(goods,i) in cart" :key="i">
        <!-- uni-swipe-action-item是为子节点提供滑动操作效果，需要通过right-options来指定操作按钮的配置信息 -->
        <uni-swipe-action-item :right-options="options" @click="swipeActionClickHandler(goods)">
          <!-- 渲染自定义组件,给子组件传递属性和事件-->
          <my-goods :goods="goods" :show-radio="true" @radio-change="radioChangeHandler" :show-num="true" @num-change="numberChangeHandler"></my-goods>
        </uni-swipe-action-item>
      </block>     
    </uni-swipe-action>
    
    <!-- 结算区域 -->
    <my-settle></my-settle>
  </view>
  
  <!-- 空白购物车区域 -->
  <view class="empty-cart" v-else>
    <image src="/static/cart_empty@2x.png" class="empty-img"></image>
    <text class="tip-text">空空如也～</text>
  </view>
</template>

<script>
  // 导入自己封装的 mixin 模块
  import badgeMix from '@/mixins/tabbar-badge.js'
  import { mapState,mapMutations } from 'vuex'
  export default {
    // 将 badgeMix 混入到当前的页面中进行使用
    mixins:[badgeMix],
    
    // 计算属性
    computed:{
      // 将 m_cart 模块中的 cart 数组映射到当前页面中使用
      ...mapState('m_cart',['cart']),
      // ...mapGetters('m_cart',['total']),
    },
    
    data() {
      return {
        // 删除按钮的配置信息
        options:[
          {
            text:'删除',// 显示文本
            style:{ // 显示样式
              backgroundColor:'#C00000' 
            }
          },
        ],
      };
    },
    
    methods:{
      // 调用mapMutations辅助函数,结果通过展开运算符转交给methods节点
      ...mapMutations('m_cart',['UpdateGoodsState','UpdateGoodsCount','removeGoodsById']),
      
      // 自定义事件，goods为子组件传过来的商品对象（包含id和state）
      radioChangeHandler(goods){
       // 商品的勾选状态发生变化,调用仓库的方法，用来更新勾选框状态
       this.UpdateGoodsState(goods)
      },
      
      // 给my-goods组件绑定自定义事件，goods为子组件传过来的商品对象（包含id和val(商品最新数量值)）
      numberChangeHandler(goods){
        this.UpdateGoodsCount(goods)
      },
      
      // 滑动删除按钮
      swipeActionClickHandler(goods){
        this.removeGoodsById(goods.goods_id)
      },
    },
    

  }
</script>

<style lang="scss">
  .cart-container{
    padding-bottom: 100rpx;
  }
  .cart-title{
    height: 80rpx;
    display: flex;
    align-items: center;
    font-size: 28rpx;
    padding-left: 10rpx;
    border-bottom: 1px solid #efefef;
    .cart-title-text{
      margin-left: 20rpx;
    }
  }
  .empty-cart{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 300rpx;
    .empty-img{
      width: 180rpx;
      height: 180rpx;
    }
    .tip-text{
      font-size: 24rpx;
      color: gray;
      margin-top: 30rpx;
    }
  }
</style>
