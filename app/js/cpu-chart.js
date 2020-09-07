    let dps = []; // dataPoints
    let width = $('#chartCpuContainer').width();
    let height = $('#chartCpuContainer').height();
    let chart = new CanvasJS.Chart("chartCpuContainer", {
        width: width,
        height: height,
        title: {
            text: "CPU realtime monitor",
        },
        data: [
            {
                color: "LightSeaGreen",
                type: "spline",
                dataPoints: dps,
            },
        ],
        axisY: {
            maximum: 100,
            minimum: 0,
            title: "CPU Usage",
            suffix: "%",
        },
        axisX: {
            title: "Monitor Timer",
            suffix: "s",
        },
        backgroundColor: '#F5DEB3',
    });

    let xVal = -59;
    let yVal = 0;
    let updateInterval = 1000;
    let dataLength = 60; // number of dataPoints visible at any point
    let dg = 0;
    let updateChart = function (count) {
        if (dg === 0) {
            cpu.usage().then((cpuPercentage) => {
                count = count || 1;

                for (let j = 0; j < count; j++) {
                    yVal = Math.round(cpuPercentage);
                    dps.push({
                        x: xVal,
                        y: yVal,
                    });
                    xVal++;
                }

                if (dps.length > dataLength) {
                    dps.shift();
                }
                dg = 1
                // chart.render();
            });
        } else {
            cpu.usage().then((cpuPercentage) => {
                yVal = Math.round(cpuPercentage);
                dps.push({
                    x: xVal,
                    y: yVal,
                });
                xVal++;
                dps.shift();

                chart.render();
            });
        }
    };

    updateChart(dataLength);
    setInterval(function () {
        updateChart();
    }, updateInterval);
