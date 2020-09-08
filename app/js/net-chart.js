let dpsNetDown = []; // dataPoints
let dpsNetUp = []; // dataPoints
// let heightNet = $('#chartNetworkContainer').height();
let chartNet = new CanvasJS.Chart("chartNetworkContainer", {
    // width: width,
    // height: heightNet,
    title: {
        text: "Network realtime monitor",
    },
    data: [
        {
            color: "Green",
            type: "spline",
            name: "Download Speed",
            showInLegend: true,
            dataPoints: dpsNetDown,
        },
        {
            color: "Red",
            type: "spline",
            name: "Upload Speed",
            showInLegend: true,
            dataPoints: dpsNetUp,
        },
    ],
    axisY: {
        title: "Speed",
        suffix: "Kb/s",
    },
    axisX: {
        title: "Monitor Timer",
        suffix: "s",
    },
    backgroundColor: '#F5DEB3',
});

let xValNetDown = -199;
let yValNetDown = 0;
let xValNetUp = -199;
let yValNetUp = 0;
let updateIntervalNet = 1000;
let dataLengthNet = 200; // number of dataPoints visible at any point
let dgNet = 0;
let updateChartNet = function (count) {
    if (dgNet === 0) {
        netstat.inOut()
            .then(info => {
                count = count || 1;
                for (let j = 0; j < count; j++) {
                    yValNetDown = info.total.inputMb * 1000;
                    dpsNetDown.push({
                        x: xValNetDown,
                        y: yValNetDown,
                    });
                    xValNetDown++;

                    yValNetUp = info.total.outputMb * 1000;
                    dpsNetUp.push({
                        x: xValNetUp,
                        y: yValNetUp,
                    });
                    xValNetUp++;
                }
                dgNet = 1;
            })
    } else {
        netstat.inOut()
            .then(info => {
                yValNetDown = info.total.inputMb * 1000;
                dpsNetDown.push({
                    x: xValNetDown,
                    y: yValNetDown,
                });
                xValNetDown++;
                dpsNetDown.shift();

                yValNetUp = info.total.outputMb * 1000;
                dpsNetUp.push({
                    x: xValNetUp,
                    y: yValNetUp,
                });
                xValNetUp++;
                dpsNetUp.shift();

                chartNet.render();
            })
    }
};

updateChartNet(dataLengthNet);
setInterval(function () {
    updateChartNet();
}, updateIntervalNet);
