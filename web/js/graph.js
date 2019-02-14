// ホーム画面へ
toHomeScreen = function () {
  location.href = './index.html';
}

// ホーム画面ロード時
document.addEventListener('DOMContentLoaded', function () {
  handleTodayDate();
});

// 期間選択
[DAYLY, WEEKLY, MONTHLY] = [1, 2, 3];
selectedTerm = function (term = DAYLY) {
  alert("click");
  switch (term) {
    case DAYLY:
      getAllWorkRecords(DAYLY);
      break;
    case WEEKLY:
      getAllWorkRecords(WEEKLY);
      break;
    case MONTHLY:
      getAllWorkRecords(MONTHLY);
      break;
    default:
      alert("error!");
      break;
  }
}

var dataLabelPlugin = {
  afterDatasetsDraw: function (chart, easing) {
    // To only draw at the end of animation, check for easing === 1
    var ctx = chart.ctx;

    chart.data.datasets.forEach(function (dataset, i) {
      var dataSum = 0;
      dataset.data.forEach(function (element) {
        dataSum += element;
      });

      var meta = chart.getDatasetMeta(i);
      if (!meta.hidden) {
        meta.data.forEach(function (element, index) {
          // Draw the text in black, with the specified font
          ctx.fillStyle = 'rgb(255, 255, 255)';

          var fontSize = 12;
          var fontStyle = 'normal';
          var fontFamily = 'Helvetica Neue';
          ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

          // Just naively convert to string for now
          var labelString = chart.data.labels[index];
          var dataString = (Math.round(dataset.data[index] / dataSum * 1000) / 10).toString() + "%";

          // Make sure alignment settings are correct
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          var padding = 5;
          var position = element.tooltipPosition();
          ctx.fillText(labelString, position.x, position.y - (fontSize / 2) - padding);
          ctx.fillText(dataString, position.x, position.y + (fontSize / 2) - padding);
        });
      }
    });
  }
};

printGraph = (function (result) {

  let dump = "以下のデータをグラフ化します\n";
  // let cnt = result.rows.length;
  let cnt = 0;
  dump += "行数:" + cnt + "\n";
  let [data1, category1] = [[], []];
  for (let i = 0; i < cnt; i++) {
    dump += `elapsed_time: ${result.rows[i].elapsed_time}  \n category: ${result.rows[i].categories_id} \n name: ${result.rows[i].name}  \n `;
    data1.push(result.rows[i].elapsed_time);
    category1.push(result.rows[i].name);
  }
  data1.push(10);
  const ctx = document.getElementById("graph_area").getContext('2d');
  if (data1.length === 0) {
    ctx.font = "200 1.1em Noto Sans JP";
    ctx.textAlign = 'end';
    ctx.fillText('データがありません', 200, 100);
  } else {
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: category1,
        datasets: [{
          backgroundColor: [
            "#2ecc71",
            "#95a5a6",
            "#9b59b6",
            "#f1c40f",
            "#3498db",
            "#e74c3c",
            "#34495e",
            "#200c71",
            "#050036",
            "#9b5b00",
            "#0fc4ff",
            "#3f983b",
            "#ddff3c",
            "#0f3033",
            "#2ecc71",
            "#95a5a6",
            "#9b59b6",
            "#f1c40f",
            "#3498db",
            "#e74c3c",
            "#34495e",
            "#200c71",
            "#050036",
            "#9b5b00",
            "#0fc4ff",
            "#3f983b",
            "#ddff3c",
            "#0f3033",
          ],
          data: data1
        }]
      },
      options: {
        maintainAspectRatio: false,
      },
      plugins: [dataLabelPlugin],
    });
  }
})()

// YYYY-MM-DDの形式にDate()型から変換
convertDate = function (date, format) {
  format = format.replace(/YYYY/, date.getFullYear());
  format = format.replace(/MM/, date.getMonth() + 1);
  format = format.replace(/DD/, date.getDate());
  return format;
}
// その日の曜日を返す
const dayOfWeekStr = ["日", "月", "火", "水", "木", "金", "土"];	// 曜日(日本語表記)
getDay = function (date) {
  return dayOfWeekStr[date.getDay()]
}
// 現在表示している日付を取得
getPrintingDate = function () {
  return new Date(document.getElementById("select_date").innerHTML);
}
// ロード時の日付を表示
handleTodayDate = function () {
  const day = getDay(new Date());
  document.getElementById("select_date").innerText = convertDate(new Date(), `YYYY-MM-DD(${day})`);
}
// 1日前の日付を表示
handlePrevDate = function () {
  let printingDate = getPrintingDate();
  printingDate.setDate(printingDate.getDate() - 1); // 1日前
  const day = getDay(printingDate);
  document.getElementById("select_date").innerText = convertDate(printingDate, `YYYY-MM-DD(${day})`);
}
// 1日後の日付を表示
handleNextDate = function () {
  let printingDate = getPrintingDate();
  printingDate.setDate(printingDate.getDate() + 1); // 1日後
  const day = getDay(printingDate);
  document.getElementById("select_date").innerText = convertDate(printingDate, `YYYY-MM-DD(${day})`);
}

/* イベント着火 */
document.addEventListener("deviceready", function () {
  connectDatabase2();
}, false);
