toGraphScreen = function () {
  //(UPDATE) 最新の記録レコードを終了するSQL
  if (prevSelectedButton !== null) {

  }
  location.href = './graph.html';

}
toEditScreen = function () {
  //(UPDATE) 最新の記録レコードを終了するSQL
  if (prevSelectedButton !== null) {

  }
  location.href = './edit.html';
}
toHomeScreen = function () {
  location.href = './index.html';
}

// ホーム画面ロード時
document.addEventListener('DOMContentLoaded', function () {
  resetTimer();
});

// ボタンを表示
printButton = function (categories) {
  const cnt = categories.rows.length; // カテゴリー数
  let id, name;
  for (let i = 0; i < cnt; i++) {
    id = categories.rows[i].id;
    name = categories.rows[i].name;
    createButton(id, name);
  }
}
// ボタンを作成
createButton = function (id, name) {
  const buttonObj = `
      <li class="adjust-box box-1x2" id="button_${id}" ontouchstart="" onclick="selectedButton(${id})">
        <div class="inner">
          <p>${name}</p>
        </div>
      </li>`
  let todoParentObj = document.querySelector('.todo_category ul');
  todoParentObj.innerHTML += buttonObj;
}
// ボタン選択
prevSelectedButton = null;
selectedButton = function (id) {
  getAllWorkRecords();
  if (prevSelectedButton === null) {
    // (INSERT) 選択したボタンをレコードとして登録するSQL
    startRecordWork(id);
    // 選択したボタンに色クラスを加える
    document.getElementById(`button_${id}`).classList.add('slect_category');
    prevSelectedButton = id;
  } else if (prevSelectedButton === id) { // 同じボタンをクリックした場合は終了
    //(UPDATE) 最新の記録レコードを終了するSQL
    finishRecordWork();
    // 選択していたボタンから色クラスを外す
    document.getElementById(`button_${prevSelectedButton}`).classList.remove('slect_category');
    prevSelectedButton = null;
  } else {
    //(UPDATE) 最新の記録レコードを終了するSQL
    finishRecordWork();
    // (INSERT) 選択したボタンをレコードとして登録するSQL
    startRecordWork(id);
    // 選択していたボタンから色クラスを外す
    document.getElementById(`button_${prevSelectedButton}`).classList.remove('slect_category');
    // 選択したボタンに色クラスを加える
    document.getElementById(`button_${id}`).classList.add('slect_category');
    prevSelectedButton = id;
  }
  // 表示しているタイマーを ０ にする
  resetTimer();
}
// タイマー初期化
resetTimer = function () {
  clearInterval(timer);
  let timeObj = document.getElementById('elapsed_time');
  timeObj.textContent = "00:00:00";
  if (prevSelectedButton !== null) {
    startTimer();
  }
}
// タイマー起動
let timer;
startTimer = function () {
  const DAYSTART = new Date();
  const DAYEND = new Date();
  const INTERVAL = 1000;
  let calc = new Date(+DAYEND - DAYSTART - INTERVAL);
  function counUpTimer() {
    const addZero = function (n) { return ('0' + n).slice(-2); }
    calc = new Date(+new Date(calc) + INTERVAL);
    let date = calc.getUTCDate() + 1 ? calc.getUTCDate() + 1 : '';
    let dateToHours = date * 24; // 日付を時間に変換
    let hours = calc.getUTCHours() ? calc.getUTCHours() + dateToHours + ':' : '00:';
    let minutes = addZero(calc.getUTCMinutes()) + ':';
    let seconds = addZero(calc.getUTCSeconds());
    document.getElementById('elapsed_time').textContent = hours + minutes + seconds;
  }
  counUpTimer();
  timer = setInterval(function () { counUpTimer() }, INTERVAL);
}

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
