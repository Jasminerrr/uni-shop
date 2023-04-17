<template>
  <view>
    <!-- 顶部搜索框 -->
    <view class="search-box">
      <!-- cancelButton:取消按钮，focus：自动获取焦点，input：绑定事件 -->
      <uni-search-bar @input="input" :radius="100" placeholder="请输入搜索内容" cancelButton="none" :focus="true"/>
    </view>
    
    <!-- 搜索建议列表 -->
    <view class="suggest-list" v-if="searchResults.length !== 0">
      <view class="suggest-item" v-for="(item,i) in searchResults" :key="i" @click="gotoDetail(item)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
    
    <!-- 搜索历史区 -->
    <view class="history-box" v-else>
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="20" @click="clearHistory"></uni-icons>
      </view>
      <view class="history-list">
        <uni-tag :text="item" v-for="(item,i) in histories" :key="i" @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>
  </view>
</template>

<script>
import { computed } from "vue";
  export default {
    data() {
      return {
        timer:null, // 定义延时器的时间
        keyword:'', // 输入的关键字
        searchResults:[], // 搜索建议列表
        historyList:[], // 搜索历史的关键字
      };
    },
    onLoad() {
      // 在页面刚加载时,获取本地的历史记录,JSON.parse():将字符串转换为数组
      this.historyList = JSON.parse(uni.getStorageSync('keyword')||'[]')
    },
    methods:{
      // input输入框事件回调
      input(e){
        // 如果用户再次触发输入事件,则清除延时器,再重新开启一个重新计时(防抖:多次触发,只取最后一次)
        clearTimeout(this.timer)
        // 通过延时器实现搜索框防抖处理
        this.timer = setTimeout(()=>{
          // 如果500毫秒内没有再次触发,则将输入值赋值给关键字
          this.keyword = e
          // 调用搜索列表方法,获取建议列表
          this.getsearchResults()
        },500)
      },
      
      // 获取建议列表方法
      async getsearchResults(){
        // 判断输入框是否为空
        if(this.keyword == 0){
          // 让搜索建议列表置空
          this.searchResults = []
          return
        }
        const {data:res} = await uni.$http.get('/api/public/v1/goods/qsearch',{ query : this.keyword })
        if(res.meta.status !== 200) return uni.$showMsg()
        this.searchResults = res.message
        // 返回列表数据时调用方法将关键字存进历史列表
        this.saveSearchHistory()
      },
      
      // 点击跳转商品详情页
      gotoDetail(item){
        // 指定详情页面的 URL 地址，并传递 goods_id 参数
        uni.navigateTo({
          url:'/subpkg/goods_detail/goods_detail?goods_id=' + item.good_id
        })
      },
      
      // 将关键字存入历史列表
      saveSearchHistory(){
        // set集合具有唯一性，会自动去除数组的重复成员；
        const set = new Set(this.historyList)
        // 先删除历史列表中当前的关键字
        set.delete(this.keyword)
        // 再将关键字添加进去,这样就可以去掉重复值
        set.add(this.keyword)
        // 再将set对象转换为数组,重新赋值给历史列表
        this.historyList = Array.from(set)
        // 历史记录持久化存储到本地,
        // 调用uni.setStorsgeSync(key,value)方法，将需要将数组转换成json字符串形式
        uni.setStorageSync('keyword',JSON.stringify(this.historyList))
      },
      
      // 清空历史记录
      clearHistory(){
        this.historyList = []
        // 清空本地存储中记录的搜索历史
        uni.setStorageSync('keyword','[]')
      },
      
      // 点击tag图标跳转到商品列表页
      gotoGoodsList(keyword){
        uni.navigateTo({
          url:'/subpkg/goods_list/goods_list?query=' + keyword
        })
      },
    },
    
    // 计算属性
    computed:{
      histories(){
        // 先将搜索历史数组进行翻转(不能直接修改原数组，[...arr]是浅拷贝)
        return [...this.historyList].reverse()
      },
      
      
    }
  }
</script>

<style lang="scss">
  .search-box{
    background-color: #C00000;
    position: sticky;
    top: 0;
    z-index: 999;
  }
  
  .suggest-list{
    padding: 0 5px;
    .suggest-item{
      font-size: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #efefef;
      display: flex;
      // 两端对齐
      justify-content: space-between;
      align-items: center;
      .goods-name{
        // 文字不允许换行(单行文本)
        white-space: nowrap;
        overflow: hidden;
        // 文本溢出用...代替
        text-overflow: ellipsis;
        margin-right: 4px;
      }
    }
  }
  
  // 搜索历史
  .history-box{
    padding: 0 5px;
    .history-title{
      height: 40px;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #efefef;
    }
    .history-list{
      display: flex;
      flex-wrap: wrap;
      uni-tag{
        margin-top: 5px;
        margin-right: 5px;
      }
    }
  }
</style>
