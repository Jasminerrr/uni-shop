<template>
  <view>
    <!-- 使用自定义的搜索组件 -->
    <!-- <my-search :bgcolor="'pink'" :radius="5"></my-search> -->
    <my-search @click="gotoSearch"></my-search>
    <view class="scroll-container">
      <!-- 左侧滑动区 -->
      <scroll-view class="left-scroll" scroll-y="true" style="{height: wh + 'px'}">
        <block v-for="(item,i) in cateList" :key="i">
          <view :class="['left-scroll-item',i === active ? 'active' : '']" @click="activeChanged(i)">
          {{item.cat_name}}
          </view>
        </block>
      </scroll-view>
      <!-- 右侧滑动区 -->
      <scroll-view class="right-scroll" scroll-y="true" :style="{height: wh + 'px'}" :scroll-top="scrollTop">
        <view class="cate-lv2" v-for="(item2,i2) in cateLever2" :key="i2">
          <!-- 二级分类标题 -->
          <view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
          <!-- 三级分类下的列表 -->
          <view class="cate-lv3-list">
            <view class="cate-lv2-item" v-for="(item3,i3) in item2.children" :key="i3" @click="gotoGoodsList(item3)">
              <image :src="item3.cat_icon.replace('dev','web')"></image>
              <text>{{item3.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        wh:0, // 窗口的可用高度 = 屏幕高度 - navigationBar高度 - tabBar 高度
        cateList:[], // 分类列表数据
        active:0, // 默认激活高亮索引为0
        cateLever2:[], // 二级分类列表
        scrollTop:0, // 默认滚动条距顶部距离为0
      };
    },
    onLoad(){
      // 获取当前系统的信息
      const sysInfo = uni.getSystemInfoSync()
      // 将窗口可用高度赋值给wh，还要减去搜索区域50的高度
      this.wh = sysInfo.windowHeight -50
      // 获取分类列表数据
      this.getCateList()
    }, 
    methods:{
      // 获取分类列表数据
      async getCateList(){
        const {data:res} = await uni.$http.get('/api/public/v1/categories')
        if(res.meta.status !== 200) return uni.$showMsg()
        this.cateList = res.message
        // 让二级分类赋值给默认索引为0的这一项
        this.cateLever2 = res.message[0].children
      },
      
      // 点击高亮改变(一级分类)时
      activeChanged(i){
        // 让高亮为当前索引
        this.active = i
        // 给二级分类重新赋值
        this.cateLever2 = this.cateList[i].children
        // 切换一级分类时,让滚动条距顶部距离为1(不能重复赋值为0)
        this.scrollTop = this.scrollTop === 0 ? 1 : 0
      },
      
      // 点击三级分类去往商品列表页
      gotoGoodsList(item3){
        uni.navigateTo({
          url:'/subpkg/goods_list/goods_list?cid=' + item3.cat_id 
        })
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
  .scroll-container{
    display: flex;
    .left-scroll{
      width: 120px;
      .left-scroll-item{
        background-color: #f7f7f7;
        text-align: center;
        line-height: 60px;
        font-size: 12px;
         // 激活项的样式
        &.active{
          position: relative;
          background-color: #fff;
          // 渲染激活项左侧的红色指示边线
          &::before{
            content: ' ';
            display: block;
            width: 3px;
            height: 30px;
            background-color: #c00000;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
    }
  }
  .cate-lv2-title{
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    padding: 15px 0;
  }
  .cate-lv3-list{
    display: flex;
    flex-wrap: wrap;
    .cate-lv2-item{
      width: 33.3%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;
      image{
        width: 60px;
        height: 60px;
      }
      text{
        font-size: 12px;
      }
    }
  }
</style>
