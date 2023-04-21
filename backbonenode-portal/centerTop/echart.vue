<template>
    <div style="width: 100%; height: 100%;" ref="hygrometer" class="echartPotison">


    </div>
</template>
<script>
import guangxiJson from './guangxi.json'
import shandongJson from './shandong.json'
import { autoHover } from './tooltip'
export default {
    data() {
        return {

        }
    },
    watch: {
        echartData: {
            handler(val) {
                if (val) {
                    //坐标信息
                    let LGinfo = {}
                    //数据信息
                    let dataInfo = []
                    //中心点信息
                    let centerlg = []
                    val.map(item => {
                        this.$set(LGinfo, item.name, [item.longitude, item.latitude])
                        let arr = []
                        let dataObj = {
                            name: item.name,
                            value: item.blockHeight,
                            blockHeight: item.blockHeight,
                            flag: item.flag == 1 ? '骨干链' : '子链',
                            org: item.org,
                            type: item.type,
                            txNum: item.txNum,
                            runStatus: item.runStatus
                        }
                        arr.push(dataObj)
                        dataInfo.push(arr)
                        if (item.flag == 1) {
                            centerlg.push(item.longitude)
                            centerlg.push(item.latitude)
                        }
                        let chainIndex = 0
                        dataInfo.map((item, index) => {
                            if (item[0].flag == '骨干链') {
                                chainIndex = index
                            }
                        })
                        let obj = dataInfo[chainIndex]
                        let obj1 = dataInfo[0]
                        dataInfo[0] = obj
                        dataInfo[chainIndex] = obj1
                    })
                    this.$nextTick(() => {
                        this.drawLiquidfill(LGinfo, dataInfo, centerlg)
                    })

                }
            },
            deep: true,
            immediate: true,
            tootipTimer: null
        }
    },
    props: {
        echartData: {
            type: Array,
            default: () => null
        }
    },
    mounted() {
        // this.drawLiquidfill()
    },
    methods: {
        drawLiquidfill(e, e1, e2) {
            //    e个点坐标，e1个点数据，e2中心点数据
            let formatterTip = function (data) {
                return `<div class='noticeBg' style="width: 207Px;height: 207Px;background-image: url(${require('@/assets/images/noticeBg.png')});opacity: 0.85;;overflow: hidden;padding-left: 22px;padding-right: 10px;">
            <div style="width:100%;margin-top:31px">
                <div style="display:inline-block;height: 20px;
                font-size: 16px;line-height:20px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #C9EFF2;
                overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
   ">${data.name}</div>
                <div
                    style="overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;display:inline-block;width: 50px;height: 16px;background: #3EBDCD;border-radius: 8px;line-height:16px;font-size: 12px;color: #040F2D;text-align: center;margin-left:10px">
                    ${data.flag}</div>
            </div>
            <div style="width: 100%;
            height: 16px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #C9EFF2;
            line-height: 16px;
            margin-top:5px;
            overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;">${data.org}</div>
            <div style="width: 100%;
            height: 16px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #C9EFF2;
            line-height: 16px;
            margin-top:5px;
            overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;">${data.type}</div>
            <div style="width: 164px;
height: 1px;
background: #C9EFF2;
opacity: 0.2;margin-top: 10px;"></div>
<div style="margin-top:5px">
    <div style="
            display: inline-block;
            height: 13px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #C9EFF2;
            line-height: 12px;">
            区块高度：</div>
            <div style="
            display: inline-block;
            height: 13px;
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #3EBDCD;
            line-height: 12px;margin-left:15px">
            ${data.blockHeight}</div>
</div>

<div style="margin-top:5px">
    <div style="
            display: inline-block;
            height: 13px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #C9EFF2;
            line-height: 12px;">
            上链数据：</div>
            <div style="
            display: inline-block;
            height: 13px;
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #3EBDCD;
            line-height: 12px;margin-left:15px;">
            ${data.txNum}</div>
</div>
<div style="width: 164px;
height: 1px;
background: #C9EFF2;
opacity: 0.2;margin-top: 10px;"></div>
<div style="width:100%;text-align:center;margin-top:2px;font-size: 16px;
font-family: Microsoft YaHei;
font-weight: 400;
color: #C9EFF2;">
${data.runStatus}
</div>
                    </div>`
            }
            const chart = this.$refs.hygrometer
            if (chart) {
                let chinaGeoCoordMap = e
                var chinaDatas = e1
                this.$echarts.registerMap('山东', shandongJson);
                const myChart = this.$echarts.init(chart)
                var convertData = function (data) {
                    var res = [];
                    for (var i = 0; i < data.length; i++) {
                        var dataItem = data[i];
                        var fromCoord = chinaGeoCoordMap[dataItem[0].name];
                        var toCoord = e2;//中心点地理坐标
                        if (fromCoord && toCoord) {
                            res.push([{
                                coord: fromCoord,
                                value: dataItem[0].value,
                                name: dataItem[0].name,
                                blockHeight: dataItem[0].blockHeight,
                                flag: dataItem[0].flag,
                                org: dataItem[0].org,
                                type: dataItem[0].type,
                                txNum: dataItem[0].txNum,
                                runStatus: dataItem[0].runStatus
                            }, {
                                coord: toCoord,
                            }]);
                        }
                    }
                    return res;
                };
                var series = [];
                [[chinaDatas[0][0].name, chinaDatas]].forEach(function (item, i) {
                    series.push({
                        type: 'lines',
                        zlevel: 2,
                        effect: {
                            show: true,
                            period: 4, //箭头指向速度，值越小速度越快
                            trailLength: 0.02, //特效尾迹长度[0,1]值越大，尾迹越长重
                            symbol: 'arrow', //箭头图标
                            symbolSize: 5, //图标大小
                        },
                        lineStyle: {
                            normal: {
                                width: 1, //尾迹线条宽度
                                opacity: 0.1, //尾迹线条透明度
                                curveness: .3,//尾迹线条曲直度,
                                color: '#FFD74D'
                            }
                        },
                        data: convertData(item[1])
                    }, {
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        zlevel: 2,
                        rippleEffect: { //涟漪特效
                            period: 4, //动画时间，值越小速度越快
                            brushType: 'stroke', //波纹绘制方式 stroke, fill
                            scale: 4 //波纹圆环最大限制，值越大波纹越大,
                        },
                        itemStyle: {
                            color: '#FFD74D'
                        },
                        title: {

                        },
                        data: item[1].map(function (dataItem) {
                            return {
                                //在这里定义你所要展示的数据
                                name: dataItem[0].name,
                                value: chinaGeoCoordMap[dataItem[0].name].concat([dataItem[0].value]),
                                blockHeight: dataItem[0].blockHeight,
                                flag: dataItem[0].flag,
                                org: dataItem[0].org,
                                type: dataItem[0].type,
                                txNum: dataItem[0].txNum,
                                runStatus: dataItem[0].runStatus
                            };
                        }),

                    },
                        //中心点
                        {
                            type: 'scatter',
                            coordinateSystem: 'geo',
                            zlevel: 2,
                            rippleEffect: {
                                period: 4,
                                brushType: 'stroke',
                                scale: 4
                            },
                            itemStyle: {
                                color: '#EF8031'
                            },
                            data: [{
                                name: item[0],
                                value: chinaGeoCoordMap[item[0]].concat([10]),
                                blockHeight: item[1][0][0].blockHeight,
                                flag: item[1][0][0].flag,
                                org: item[1][0][0].org,
                                type: item[1][0][0].type,
                                txNum: item[1][0][0].txNum,
                                runStatus: item[1][0][0].runStatus
                            }],
                            label: {
                                show: false
                            }
                        },
                        {
                            type: 'map',
                            roam: false,
                            zoom: 1.2,
                            layoutCenter: ["50%", "45%"],
                            layoutSize: "110%",
                            label: {
                                normal: {
                                    show: true,
                                    textStyle: {
                                        color: '#fff'
                                    }
                                },
                                emphasis: {
                                    textStyle: {
                                        color: '#fff'
                                    }
                                }
                            },
                            select: false,

                            itemStyle: {
                                normal: {
                                    borderColor: "rgba(132,188, 223)",
                                    borderWidth: 0,
                                    areaColor: {
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 0,
                                            color: 'rgb(86,177,228)' // 0% 处的颜色

                                        }, {
                                            offset: 1,
                                            color: 'rgb(20,100,181)' // 100% 处的颜色
                                        }],

                                        globalCoord: true // 缺省为 false
                                    },
                                    // areaColor: "rgb(40,96,160)",
                                },
                                emphasis: {
                                    areaColor: 'rgb(20,100,181)',
                                    borderWidth: 0.3
                                }
                            },
                            //     roam: false,
                            map: '山东' //使用
                            // data: this.difficultData //热力图数据   不同区域 不同的底色
                        },
                    );
                });
                let option = {
                    legend: {
                        zlevel: 3,
                        top: 'center',
                        right: 'right',
                        textStyle: {
                            color: '#fff',
                            width: 100,
                            overflow: 'breakAll'
                        },
                        selectedMode: false
                    },
                    tooltip: {
                        trigger: 'item',
                        backgroundColor: 'rgba(166, 200, 76, 0.82)',
                        borderColor: '#FFFFCC',
                        backgroundColor: "transparent",
                        padding: 0,
                        borderColor: 'transparent',
                        showDelay: 0,
                        hideDelay: 0,
                        enterable: true,
                        transitionDuration: 0,
                        extraCssText: 'z-index:100',
                        formatter: function (params, ticket, callback) {
                            //根据业务自己拓展要显示的内容
                            var res = "";
                            res = formatterTip(params.data)
                            return res;
                        }
                    },
                    geo: {
                        map: '山东',
                        zoom: 1.2,
                        layoutCenter: ["50%", "45%"],
                        layoutSize: "110%",

                        itemStyle: {
                            normal: {
                                areaColor: 'rgba(12,55,113)', //地图背景色
                                borderColor: 'rgb(60,115,177)', //省市边界线
                                borderWidth: 1,
                                shadowColor: 'rgb(34,74,145)',
                                // shadowOffsetX:5,
                                shadowOffsetY: 10,
                            },
                            emphasis: {
                                borderWidth: 0,
                                label: {
                                    show: false
                                },
                                color: 'rgba(4,109,186)' //悬浮背景
                            }
                        },
                        label: {
                            show: false,
                            textStyle: {
                                color: '#fff'
                            }
                        }
                        // tooltip: {
                        //     trigger: 'item',
                        //     show:false
                        // }
                    },
                    series: series
                };
                myChart.setOption(option)
                this.tootipTimer && this.tootipTimer.clearLoop(); // this.tootipTimer 在data里定义
                this.tootipTimer = 0;
                this.tootipTimer = autoHover(myChart, option, e1.length, 3000);
                window.addEventListener("resize", function () {
                    myChart.resize()
                })
            }
            this.$on('hook:destroyed', () => {
                window.removeEventListener("resize", function () {
                    myChart.resize();
                });
            })
        },
    },
};
</script>
<style scoped lang="scss">
.echartPotison {
    right: 0 !important;
    top: 0 !important;
}

.noticeBg {
    width: 207Px;
    height: 207Px;
    background-image: url('../../../assets/images/noticeBg.png');
    opacity: 0.7;
}
</style>