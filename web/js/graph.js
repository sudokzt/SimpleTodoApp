// ホーム画面へ
toHomeScreen = function () {
  location.href = './index.html';
}

// ホーム画面ロード時
document.addEventListener('DOMContentLoaded', function () {
});

// 期間選択
[DAYLY, WEEKLY, MONTHLY] = [1, 2, 3];
selectedTerm = function (term = DAYLY) {
  alert("click");
  switch (term) {
    case DAYLY:
      console.log("day");
      break;
    case WEEKLY:
      console.log("week");
      break;
    case MONTHLY:
      console.log("month");
      break;
    default:
      alert("error!");
      break;
  }
}

printGraph = function (result) {
  const ctx = document.getElementById("graph_area").getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ["M", "T", "W", "T", "F", "S", "S"],
      datasets: [{
        backgroundColor: [
          "#2ecc71",
          "#95a5a6",
          "#9b59b6",
          "#f1c40f",
          "#3498db",
          "#e74c3c",
          "#34495e"
        ],
        data: [12, 19, 3, 17, 28, 24, 7]
      }]
    }
  });
}

/* イベント着火 */
document.addEventListener("deviceready", function () {
  connectDatabase2();
}, false);
