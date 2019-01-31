toGraphScreen = function () {
  location.href = './graph.html';
}
toEditScreen = function () {
  location.href = './edit.html';
}
toHomeScreen = function () {
  location.href = './index.html';
}

// ホーム画面ロード時
document.addEventListener('DOMContentLoaded', function () {
  let time_obj = document.getElementById('elapsed_time');
  time_obj.textContent = "00:00:00";
});


// function dateToTime(date, format) {

//   format = format.replace(/YYYY/, date.getFullYear());
//   format = format.replace(/MM/, date.getMonth() + 1);
//   format = format.replace(/DD/, date.getDate());

//   return format;
// }

// console.log(sampleDate(new Date(), 'YYYY年MM月DD日'));

/* イベント着火 */
document.addEventListener("deviceready", function () {
  connectDatabase();
}, false);
