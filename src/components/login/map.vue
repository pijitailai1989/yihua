<template>
  <div class="hangye">
    <yd-navbar height=".88rem" v-show="!userAgent.isWX" v-title="'选择位置'" title="选择位置" bgcolor="#0093d2" color="#fff">
      <div slot="left" @click="cancel()" :to="url">
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </div>
      <span slot="right" @click="chooseSuccess()" color="#fff;padding-right:.2rem" style="color: #fff;">确定</span>
    </yd-navbar>
    <div class="my_map" ref="my_map">
      <div class="amap-page-container">
        <el-amap-search-box class="search-box" :search-option="searchOption"
                            :on-search-result="onSearchResult"></el-amap-search-box>
        <el-amap vid="amapDemo" :plugin="plugins" :events="events" :center="mapCenter" :zoom="16" class="amap-demo">
          <el-amap-marker v-for="(marker,key) in markers" :key="key" :position="marker"></el-amap-marker>
        </el-amap>
      </div>
      <div class="toolbar">
        <div>地址:</div>
        <b>{{address}}</b>
      </div>
    </div>

  </div>
</template>
<script>
  import Vue from 'vue';
  import {Accordion, AccordionItem} from 'vue-ydui/dist/lib.rem/accordion';
  import VueAMap from 'vue-amap';

  Vue.use(VueAMap);
  VueAMap.initAMapApiLoader({
    key: '8a460d7bfd797e46302bd627782d7f2e',
    plugin: ['Autocomplete', 'PlaceSearch', 'Scale', 'Geocoder', 'OverView', 'ToolBar', 'MapType', 'PolyEditor', 'Geolocation']
  });
  Vue.component(Accordion.name, Accordion);
  Vue.component(AccordionItem.name, AccordionItem);
  import {Confirm, Alert, Toast, Notify, Loading} from 'vue-ydui/dist/lib.rem/dialog';

  Vue.prototype.$dialog = {
    confirm: Confirm,
    alert: Alert,
    toast: Toast,
    notify: Notify,
    loading: Loading,
  };
  export default {
    name: '',
    props: ["url"],
    data: function () {
      var that = this;
      return {
        loaded: false,
        address: '定位中',
        markers: [
          [121.59996, 31.197646],
          [121.40018, 31.197622],
          [121.69991, 31.207649]
        ],
        plugins: [{
          pName: 'Geolocation',
          events: {
            init(o) {
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                if (result && result.position) {
                  that.address = result.formattedAddress;
                  that.location = {
                    lat: result.position.lat,
                    lng: result.position.lng
                  };
                  that.addMarker([that.location.lat, that.location.lng]);
                  self.lng = result.position.lng;
                  self.lat = result.position.lat;
                  self.center = [self.lng, self.lat];
                  self.loaded = true;
                }
              });
            }
          }
        }],
        events: {
          click(e) {
            var currentlnglat = [e.lnglat.lng, e.lnglat.lat];
            that.mapCenter = currentlnglat;
            that.addMarker(currentlnglat);

            var geocoder = new AMap.Geocoder({
              radius: 1000,
              extensions: "all"
            });
            geocoder.getAddress(currentlnglat, function (status, result) {
              console.log("点击的地图信息", result);
              if (status === 'complete' && result.info === 'OK') {
                if (result && result.regeocode) {
                  console.log(result.regeocode.addressComponent);
                  var info = result.regeocode.addressComponent;
                  console.log(info)
                  console.log("省：", info.province, "市:", info.city, "区县:", info.district);
                  that.address = result.regeocode.formattedAddress;
                  that.province = info.province;
                  that.city = info.city;
                  that.district = info.district;
                  that.location = {
                    lng: currentlnglat[0],
                    lat: currentlnglat[1],
                  };
                  console.log(that)
                }
              }
            });
          }
        },
        searchOption: {
          city: '全国',
          citylimit: false
        },
        mapCenter: [113.95128, 22.55565]
      };
    },
    methods: {
      chooseSuccess() {
        var obj = {};
        obj.address = this.address;
        obj.location = this.location;
        obj.province = this.province;
        obj.city = this.city;
        obj.district = this.district;
        this.$emit('chooseSuccess', obj);
      },
      cancel() {
        this.$emit('cancel');
        return false;
      },
      addMarker: function (arr) {
        let lng = arr[0];
        let lat = arr[1];
        this.markers = [];
        this.markers.push([lng, lat]);
      },
      onSearchResult(pois) {
        let latSum = 0;
        let lngSum = 0;
        if (pois.length > 0) {
          pois.forEach(poi => {
            let {lng, lat} = poi;
            lngSum += lng;
            latSum += lat;
            this.markers.push([poi.lng, poi.lat]);
          });
          let center = {
            lng: lngSum / pois.length,
            lat: latSum / pois.length
          };
          this.mapCenter = [center.lng, center.lat];
        }
      }
    },
    mounted() {

    }
  }
</script>
<style scoped>
  .my_map {
    position: absolute;
    left: 0;
    right: 0;
    top: 1rem;
    bottom: 0;
  }

  .amap-demo {
    position: absolute;
    top: 0;
    height: 100%;
    bottom: 0;
    left: 0;
    right: 0;
    height: 10rem;
  }

  .search-box {
    position: absolute;
    left: .32rem;
    right: .32rem;
    width: auto;
    top: .3rem;
  }

  .amap-page-container {
    position: relative;
  }

  .toolbar {
    position: absolute;
    width: 100%;
    bottom: 0;
    height: 1rem;
    background: #fff;
    align-items: center;
    padding: 0 .3rem;
    display: flex;
    border-bottom: 1px solid #ddd;
    border-top: 1px solid #ddd;
    z-index: 3000000000000;
  }

  .toolbar > b {
    flex: 1;
    padding-left: .2rem;
  }
</style>
