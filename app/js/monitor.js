const osu = require('node-os-utils');
const { options } = require('node-os-utils');
const path = require('path');
const { memory } = require('console');

const cpu = osu.cpu;
const os = osu.os;
const mem = osu.mem;
const netstat = osu.netstat;
let cpuOverload = 80;
let memOverload = 80;
let alertFrequenceSeconds = 5;
let totalReceived = 0;
let totalSended = 0;

// set thresh to warning cpu or memory
if (!localStorage.getItem('user-setting')) {
    localStorage.setItem('user-setting', JSON.stringify({
        cpuOverload,
        memOverload,
        alertFrequenceSeconds
    }))
    $('#cpu-warning-thresh').val(cpuOverload)
    $('#mem-warning-thresh').val(memOverload)
    $('#frequency-warning-time').val(alertFrequenceSeconds)
} else {
    const userSetting = JSON.parse(localStorage.getItem('user-setting'))
    cpuOverload = userSetting.cpuOverload;
    memOverload = userSetting.memOverload;
    alertFrequenceSeconds = userSetting.alertFrequenceSeconds;
    $('#cpu-warning-thresh').val(cpuOverload)
    $('#mem-warning-thresh').val(memOverload)
    $('#frequency-warning-time').val(alertFrequenceSeconds)
}

$('#save-setting').click((e) => {
    e.preventDefault()
    cpuOverload = $('#cpu-warning-thresh').val();
    memOverload = $('#mem-warning-thresh').val();
    alertFrequenceSeconds = $('#frequency-warning-time').val();
    localStorage.setItem('user-setting', JSON.stringify({
        cpuOverload,
        memOverload,
        alertFrequenceSeconds
    }))
})


$('#cpu-model').text(cpu.model());
$('#computer-name').text(os.hostname());
$('#os').text(`${os.platform()} ${os.arch()}`);
$('#sys-uptime').text(os.uptime());
mem.info().then(info => {
    $('#sys-mem').text(`${info.totalMemMb} Mb`);
})

setInterval(() => {
    //CPU
    $('#sys-uptime').text(convertToDhms(os.uptime()))
    cpu.usage().then(cpuPercentage => {
        $('#cpu-usage').text(`${cpuPercentage.toFixed(2)}%`)
        $('#progress-cpu-percent').text(`${cpuPercentage.toFixed(2)}%`)
        $('#progress-cpu-bar').css('width', `${cpuPercentage}%`)
        if (cpuPercentage >= cpuOverload) {
            $('#progress-cpu-bar').css('backgroundColor', `red`)
        } else {
            $('#progress-cpu-bar').css('backgroundColor', `rgba(6,83,20,0.99)`)
        }
        if (cpuPercentage >= cpuOverload && runCpuNotify()) {
            new Notification('CPU overload', {
                title: 'CPU overload',
                body: "Running out of CPU!!",
                icon: path.join(__dirname, 'images', 'cpu.png')
            })
            localStorage.setItem('lastCpuNotify', +new Date())
        }

    })
    cpu.free().then(cpuFree => {
        $('#cpu-free').text(`${cpuFree.toFixed(2)}%`)
    })
    //Mem
    mem.info().then(info => {
        $('#used-mem').text(`${info.usedMemMb} Mb`)
        $('#progress-mem-percent').text(`${(100 - info.freeMemPercentage).toFixed(2)}%`)
        $('#progress-mem-bar').css('width', `${(100 - info.freeMemPercentage).toFixed(2)}%`)
        if (info.freeMemPercentage <= (100 - memOverload)) {
            $('#progress-mem-bar').css('backgroundColor', 'red')
            if (runMemNotify()) {
                new Notification('Memory overload', {
                    title: 'Memory overload',
                    body: "Running out of memory!!",
                    icon: path.join(__dirname, 'images', 'cpu.png')
                })
                localStorage.setItem('lastMemNotify', +new Date())
            }
        }
        else {
            $('#progress-mem-bar').css('backgroundColor', `rgba(6,83,20,0.99)`)
        }
    })
    //Network
    netstat.inOut()
        .then(info => {
            totalReceived += info.total.inputMb*1000;
            totalSended += info.total.outputMb*1000;
            $('#receiving').text(`${info.total.inputMb*1000} KiB/s`);
            $('#sending').text(`${info.total.outputMb*1000} KiB/s`);
            $('#received').text(`${totalReceived} KiB`);
            $('#sended').text(`${totalSended} Kib`);
        })

}, 1000)


function convertToDhms(seconds) {
    seconds = +seconds
    const day = Math.floor(seconds / (3600 * 24));
    const hour = Math.floor((seconds % 3600 * 24) / 3600);
    const minute = Math.floor((seconds % 3600) / 60)
    const second = seconds % 60;
    return `${day}d ${hour}h ${minute}m ${second}s`
}

function runCpuNotify() {
    if (localStorage.getItem('lastCpuNotify') === null) {
        localStorage.setItem('lastCpuNotify', +new Date())
        return true
    }
    const lastCpuNotifycationTime = new Date(+localStorage.getItem('lastCpuNotify'));
    const diffTime = new Date() - lastCpuNotifycationTime;
    if (diffTime >= 1000 * alertFrequenceSeconds) {
        return true
    }
    return false
}

function runMemNotify() {
    if (localStorage.getItem('lastMemNotify') === null) {
        localStorage.setItem('lastMemNotify', +new Date())
        return true
    }
    const lastMemNotifycationTime = new Date(+localStorage.getItem('lastMemNotify'));
    const diffTime = new Date() - lastMemNotifycationTime;
    if (diffTime >= 1000 * alertFrequenceSeconds) {
        return true
    }
    return false
}