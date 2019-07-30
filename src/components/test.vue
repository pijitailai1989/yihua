<template>
	<yd-layout>
    <yd-navbar height=".88rem" :bgcolor="mainColor" slot="navbar" :title="'111'">
      <router-link :to="''" slot="left">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </router-link>
      <yd-icon slot="right" name="share1" size=".48rem" color="#fff"></yd-icon>
    </yd-navbar>
		<yd-infinitescroll :callback="loadList" ref="infinitescrollDemo">
			<yd-list theme="1" slot="list">
				<yd-list-item v-for="(item, key) in list" :key="key">
					<img slot="img" :src="item.img">
					<span slot="title">{{item.title}}</span>
					<yd-list-other slot="other">
						<div>
							<span class="list-price"><em>¥</em>{{item.marketprice}}</span>
							<span class="list-del-price">¥{{item.productprice}}</span>
						</div>
						<div>content</div>
					</yd-list-other>
				</yd-list-item>
			</yd-list>

			<!-- 数据全部加载完毕显示 -->

		</yd-infinitescroll>
	</yd-layout>
</template>

<script>
	import Vue from 'vue';
	import { ListTheme, ListItem, ListOther } from 'vue-ydui/dist/lib.rem/list';
	/* 使用px：import {ListTheme, ListItem, ListOther} from 'vue-ydui/dist/lib.px/list'; */
	import { InfiniteScroll } from 'vue-ydui/dist/lib.rem/infinitescroll';
	Vue.component(InfiniteScroll.name, InfiniteScroll);
	Vue.component(ListTheme.name, ListTheme);
	Vue.component(ListItem.name, ListItem);
	Vue.component(ListOther.name, ListOther);
	import { Layout } from 'vue-ydui/dist/lib.rem/layout';
	Vue.component(Layout.name, Layout);
	export default {
		data() {
			return {
				page: 1,
				pageSize: 10,
				list: [{
					img: "http://img1.shikee.com/try/2016/06/23/14381920926024616259.jpg",
					title: "标题标题标题标题标题",
					marketprice: 56.23,
					productprice: 89.36
				}, {
					img: "http://img1.shikee.com/try/2016/06/21/10172020923917672923.jpg",
					title: "骆驼男装2016夏装男士短袖T恤 圆领衣服 印花男装体恤 半袖打底衫",
					marketprice: 56.23,
					productprice: 89.36
				}, {
					img: "http://img1.shikee.com/try/2016/06/23/15395220917905380014.jpg",
					title: "条纹短袖T恤男士韩版衣服大码潮流男装夏季圆领体恤2016新款半袖",
					marketprice: 56.23,
					productprice: 89.36
				}, {
					img: "http://img1.shikee.com/try/2016/06/25/14244120933639105658.jpg",
					title: "夏季青少年衣服男生潮牌t恤 男士 夏秋学生 日系棉短袖半袖男小衫",
					marketprice: 56.23,
					productprice: 89.36
				}, {
					img: "http://img1.shikee.com/try/2016/06/26/12365720933909085511.jpg",
					title: "2016夏装新款时尚潮流短袖T恤男纯棉V领日系青少年韩版夏季上衣服",
					marketprice: 56.23,
					productprice: 89.36
				}, {
					img: "http://img1.shikee.com/try/2016/06/19/09430120929215230041.jpg",
					title: "男装衣服男夏t恤 男士短袖t恤圆领夏季潮牌宽松原宿风半截袖男",
					marketprice: 56.23,
					productprice: 89.36
				}]
			}
		},
		methods: {
			loadList() {
				const _list = this.list;
				if(this.page == 3) { /* 所有数据加载完毕 */
					this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
					return;
				} /* 单次请求数据完毕 */
				setTimeout(() => {
					this.list = [...this.list, ..._list];
					this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad');
					this.page++;
				},2000)
			}
		}
	}
</script>
