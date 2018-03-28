window.onload = function () {
    var xhr = new XMLHttpRequest();

    function insertPie(data) {
        // console.log('pie data\n', data);
        var chart = echarts.init(document.querySelector('#id-year-range'));
        var option = {
            title: {
                text: '年代分布',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                // orient: 'vertical',
                // top: 'middle',
                bottom: 10,
                left: 'center',
                data: []
            },
            series: [{
                type: 'pie',
                radius: '65%',
                center: ['50%', '50%'],
                selectedMode: 'single',
                data: [],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                color: ['#dd6b66','#759aa0','#e69d87','#8dc1a9','#ea7e53','#eedd78','#73a373','#73b9bc','#7289ab']
            }]
        };

        var random = [7, 6, 1, 5, 3, 2, 5, 4, 0, 8];
        var arr = [];
        var i = 0;
        for (key in data) {
            arr.push({ key: key, value: data[key]});
            i++;
        }

        console.log(arr);
        
        for (var i = 0, len = arr.length; i < len; i++) {
            var name = arr[random[i]].key;
            var value = arr[random[i]].value;
            option.legend.data.push(arr[random[i]].key);
            option.series[0].data.push({ value: value, name: name });
        }
        // console.log(option);

        chart.setOption(option);
    }

    function insertBar(data) {
        // console.log('data country\n', data);
        var chart = echarts.init(document.querySelector('#id-country'));
        var xAxis = {
            type: 'category',
            axisLabel: {
                fontSize: '11',
                fontWeight: 'bold'
            },
            data: []
        };
        var series = [{
            // name: '占比',
            label: {
                normal: {
                    show: true,
                    position: 'inside'
                }
            },
            // color: ['#dd6b66','#759aa0','#e69d87','#8dc1a9','#ea7e53','#eedd78','#73a373','#73b9bc','#7289ab', '#91ca8c','#f49f42'],
            type: 'bar',
            data: [],
            itemStyle: {
                normal: {
                    color: function (params){
                        var colorList = ['#dd6b66','#759aa0','#e69d87','#8dc1a9','#ea7e53','#eedd78','#73a373','#73b9bc','#7289ab'];
                        return colorList[params.dataIndex];
                    }
                }
            }
        }];
        var random = [0, 4, 3, 2, 1, 5, 6, 7, 8];
        // 取前 9
        for (var i = 0; i < 9; i++) {
            xAxis.data.push(data[random[i]].country);
            series[0].data.push(data[random[i]].times);
        }

        // console.log(xAxis);
        // console.log(series);
        var option = {
            title: {
                text: '豆瓣 top250 电影的国家分布'
            },
            tooltip: {},
/*             legend: {
                data: ['所占数目']
            }, */
            xAxis: xAxis,
            yAxis: {},
            series: series
        }
        // console.log(option);
        chart.setOption(option);
    }

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                var r = JSON.parse(this.responseText);
                // console.log(xhr.responseText);
                // console.log(Array.isArray(r));
                insertPie(r[1]);
                insertBar(r[0]);
            } else {
                console.log(`Request was unsuccessful: ${xhr.status}`);
            }
        }
    }

    xhr.open('GET', '/get', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
}