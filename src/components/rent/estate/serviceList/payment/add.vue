<template>
  <yd-layout>
    <yd-navbar :title="title" :bgcolor='mainColor' height='.88rem' color='#fff'>
      <span slot="left" class="addClickArea" @click='$router.go(-1)'>
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
    </yd-navbar>
    <div v-show='father'>
      <div class="chooseTimer">
        <div class="item">
          <div class="label">客户名称：</div>
          <div class="input_content icon" @click="chooseDong()">
            <input type="text" placeholder="栋" readonly v-model="submitData.dong">
          </div>
          <div class="input_content icon" @click="chooseUnit()">
            <input type="text" placeholder="单元号" readonly v-model="submitData.unit">
          </div>
        </div>
        <!-- 选择时间 -->
        <div class="item">
          <div class="label">费用时间：</div>
          <div class="input_content">
            <yd-icon name='rili' style="margin-top:.05rem;margin-left:.2rem" custom color='#999' size='.45rem'></yd-icon>
            <yd-datetime type="date" style="flex:1;width:auto;text-align:left" v-model="submitData.startTime"></yd-datetime>
          </div>
          <div class="input_content">
            <yd-icon name='rili' style="margin-top:.05rem;margin-left:.2rem" color='#999' custom size='.45rem'></yd-icon>
            <yd-datetime type="date" style="flex:1;width:auto;text-align:left" v-model="submitData.endTime"></yd-datetime>
          </div>
        </div>
      </div>
      <!-- 项目单 -->
      <div class="tableBox">
        <div class="table">
          <!-- 标题 -->
          <div class="table_title">
            <span>项目名称</span>
            <span>用量计量</span>
            <span>计费单价</span>
            <span>本月费用</span>
            <span>往月欠缴</span>
            <span>滞纳金</span>
            <span>应交合计</span>
          </div>
          <div class="table_content">
            <div class="colomn" v-for='item in submitData.payProject'>
              <span></span>
            </div>
          </div>
        </div>
      </div>
      <!-- 备注 -->
      <div class="remarks mt2">
        <div class="">备注</div>
        <div>
          <yd-textarea></yd-textarea>
        </div>
      </div>


    </div>
    <div class="buttons" v-show='father' slot='bottom'>
      <yd-button type='hollow' :color='mainColor' @click.native='showEdit' class="button" style="margin:0; height:.8rem;line-height:.8rem;font-size:.32rem">编辑</yd-button>
      <yd-button type='hollow' class="button" @click.native='submit' style="margin:0; height:.8rem;line-height:.8rem;font-size:.32rem">提交</yd-button>
    </div>
  </yd-layout>
</template>
<script>
  export default {
    data() {
      console.log(this.$route.params);
      if (this.$route.params.id == 1) {
        this.title = "物业管理费";
      } else {
        this.title = "费用时间";
      }
      this.userInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("userInfo"))
      );
      this.organInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("organInfo"))
      );
      console.log(this.userInfo, "userInfo");
      this.mainColor = this.$color[this.userInfo.organType];
      console.log(this.mainColor);
      return {
        father: true,
        list: [],
        submitData: {
          acceptOrgId: "",
          buildingId: this.userInfo.buildingId,
          buildingRidId: "",
          roomNumber: "",
          startTime: this.$today(),
          endTime: this.$today(),
          type: this.$route.params.id,
          explain: "",
          payProject: [],
          accessorys: ""
        },
        obj: {
          "chargeStandard": 0,
          "chargeUnit": 0,
          "consumption": 0,
          "projectName": "string",
          "thisMonthMoney": 0,
          "lastMonthMoney": 0,
          "lateFee": 0,
          "remarks": "string",
          "totalMoney": 0
        }
      };

    },
    methods: {
      showEdit() {
        this.father = false;
      },
    }
  };
</script>
<style scoped>
  .buttons {
    display: flex;
    height: .8rem;
    justify-content: space-between;
    border-top: 1px solid #ddd;
  }

  .buttons .button {
    flex: 1;
    border: none;
  }

  .tableBox {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    white-space: nowrap;
    margin-top: .4rem;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    background: #fff;
  }

  .table {
    width: 12.6rem;
    text-align: center;
  }

  .table_title {
    height: .8rem;
    display: flex;
    align-items: center;
  }

  .table_title span {
    display: block;
    width: 1.8rem;
  }

  .table_content {}

  .chooseTimer {
    background: #fff;
    border-bottom: 1px solid #ddd;
  }

  .item {
    display: flex;
    height: 1rem;
    flex-flow: row nowrap;
    overflow: hidden;
    align-items: center;
    border-top: 1px solid #ddd;
    margin-top: -1px;
    padding: 0 0.24rem;
  }

  .item .input_content {
    height: 0.64rem;
    flex: 1;
    box-sizing: border-box;
    border: 1px solid #ddd;
    margin-right: 0.16rem;
    border-radius: 0.15rem;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: flex-start;
  }

  .item .input_content input {
    height: 100%;
    width: 100%;
    border: none;
    text-align: center;
    outline: none;
    color: #666;
    padding: 0 0.2rem;
  }

  .item .input_content.code {
    margin-right: 0.1rem;
  }

  .item .input_content.icon {
    background: url("../../../../../assets/images/register/right.png") no-repeat calc(100% - 0.2rem) center;
    background-size: 0.12rem;
    padding-right: 0.2rem;
  }
</style>
