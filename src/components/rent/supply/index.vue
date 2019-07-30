<template>
	<div class="template">
		
	</div>
</template>
<script>
	export default {
		name: '',
		data() {
			let userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
			let mainColor = this.$color[userInfo.organType];
			// console.log(mainColor)
			return {
				userInfo,
				mainColor,
			}
		},
		methods: {

		},
		mounted(){
			this.$router.push('/supply/find')
		}
	}
</script>
<style scoped>
	.noPadding{
		padding: 0;
		margin-bottom: -1rem;
		padding-bottom: 1.2rem;
	}
</style>