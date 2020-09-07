    let dpsMem = []; // dataPoints
    let widthMem = $('#chartMemContainer').width();
    let heightMem = $('#chartMemContainer').height();
    let chartMem = new CanvasJS.Chart("chartMemContainer", {
        width: widthMem,
        height: heightMem,
        title: {
            text: "Memory realtime monitor",
        },
        data: [
            {
                color: "LightSeaGreen",
                type: "spline",
                dataPoints: dpsMem,
            },
        ],
        axisY: {
            maximum: 100,
            minimum: 0,
            title: "Memory Usage",
            suffix: "%",
        },
        axisX: {
            title: "Monitor Timer",
            suffix: "s",
        },
        backgroundColor: '#F5DEB3',
    });

    let xValMem = -59;
    let yValMem = 0;
    let updateIntervalMem = 1000;
    let dataLengthMem = 60; // number of dataPoints visible at any point
    let dgMem = 0;
    let updateChartMem = function (count) {
        if (dgMem === 0) {
            mem.info().then(info => {
                count = count || 1;

                for (let j = 0; j < count; j++) {
                    yValMem = Math.round(100-info.freeMemPercentage);
                    dpsMem.push({
                        x: xValMem,
                        y: yValMem,
                    });
                    xValMem++;
                }

                if (dpsMem.length > dataLengthMem) {
                    dpsMem.shift();
                }
                dgMem = 1
                // chart.render();
            });
        } else {
            cpu.usage().then((cpuPercentage) => {
                yValMem = Math.round(cpuPercentage);
                dpsMem.push({
                    x: xValMem,
                    y: yValMem,
                });
                xValMem++;
                dpsMem.shift();

                chartMem.render();
            });
        }
    };

    updateChartMem(dataLengthMem);
    setInterval(function () {
        updateChartMem();
    }, updateIntervalMem);

