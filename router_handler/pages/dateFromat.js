//定义格式化时间的函数
function dateFormat(dateStr) {
    const dt = new Date(dateStr);
    const y = AddZero(dt.getFullYear());
    const m = AddZero(dt.getMonth() + 1);
    const d = AddZero(dt.getDate());
    const hh = AddZero(dt.getHours());
    const mm = AddZero(dt.getMinutes());
    const ss = AddZero(dt.getSeconds());
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}
//定义补零函数
function AddZero(n) {
    return n > 9 ? n : '0' + n;
}
module.exports={
    dateFormat
}