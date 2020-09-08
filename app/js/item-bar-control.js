$('#cpu-control').click(() => {
    $('#setting-tab').hide();
    $('#system-tab').hide();
    $('#network-tab').hide();
    $('#cpu-tab').show();
})
$('#system-control').click(() => {
    $('#setting-tab').hide();
    $('#cpu-tab').hide();
    $('#network-tab').hide();
    $('#system-tab').show();
})
$('#setting-control').click(() => {
    $('#system-tab').hide();
    $('#cpu-tab').hide();
    $('#network-tab').hide();
    $('#setting-tab').show();
})
$('#network-control').click(() => {
    $('#system-tab').hide();
    $('#cpu-tab').hide();
    $('#setting-tab').hide();
    $('#network-tab').show();
})