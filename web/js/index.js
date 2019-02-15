toGraphScreen = function () {
  //(UPDATE) 最新の記録レコードを終了するSQL
  if (prevSelectedButton !== null) {
    finishRecordWork("graph");
  } else {
    location.href = './graph.html';
  }
}
/* 編集ボタンを押した時の挙動 */
toEditScreen = function (type) {
  let allButton = document.getElementsByClassName("category_button");
  if (type === 'Edit') { // 記録画面から押した
    document.getElementsByClassName('done_edit')[0].style.display = 'inline-block';
    document.getElementsByClassName('will_edit')[0].style.display = 'none';
    for (let i = 0; i < allButton.length; i++) {
      document.getElementsByClassName('category_button')[i].classList.add('avoid-clicks'); // ボタンロック
      document.getElementsByClassName('delete_mark')[i].style.display = 'block'; // 削除ボタン表示
    }
    document.getElementById('add_mark').style.display = 'block'; // 追加ボタン表示
    //(UPDATE) 最新の記録レコードを終了するSQL
    if (prevSelectedButton !== null) {
      finishRecordWork();
      // 選択していたボタンから色クラスを外す
      document.getElementById(`button_${prevSelectedButton}`).classList.remove('slect_category');
      prevSelectedButton = null;
    }
  } else { // 編集画面から押した
    document.getElementsByClassName('done_edit')[0].style.display = 'none';
    document.getElementsByClassName('will_edit')[0].style.display = 'inline-block';
    for (let i = 0; i < allButton.length; i++) {
      document.getElementsByClassName('category_button')[i].classList.remove('avoid-clicks'); // ボタンロック解除
      document.getElementsByClassName('delete_mark')[i].style.display = 'none'; // 削除ボタン非表示
    }
    document.getElementById('add_mark').style.display = 'none'; // 追加ボタン非表示
  }
}

// ホーム画面ロード時
document.addEventListener('DOMContentLoaded', function () {
  resetTimer();
});

// アプリを再び開いた時
window.onfocus = function () {
  // (SELECT) 最新のレコードを取得
  getLatestRecord();
  // そのレコードが終了前の状態だったら
  // timerを 現在時間 - そのレコードの開始時間にして表示
}

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
      <li class="adjust-box box-1x2" id="button_${id}">
        <div class="delete_mark" style="display: none" onclick="deleteCategory(${id})"></div>
        <div class="inner category_button" ontouchstart="" onclick="selectedButton(${id})">
          <p>${name}</p>
        </div>
      </li>`;
  let todoParentObj = document.querySelector('.todo_category ul');
  todoParentObj.innerHTML += buttonObj;
}
// ボタン選択
prevSelectedButton = null;
selectedButton = function (id) {
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
startTimer = function (calc = null) {
  const INTERVAL = 1000;
  if (calc === null) {
    const DAYSTART = new Date();
    const DAYEND = new Date();
    calc = new Date(+DAYEND - DAYSTART - INTERVAL);
  } else {
    clearInterval(timer); // 再起動前に測っていた時間を初期化
  }
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

/* カテゴリの追加 */
addCategory = function () {
  let newCategory = window.prompt("カテゴリ名を入力してください", "");
  // (INSERT)カテゴリ挿入SQL
  if (newCategory !== null) {

  }
}
/* カテゴリの削除 */
deleteCategory = function (id) {
  if (window.confirm("削除します")) { //カテゴリ削除確認ダイアログ
    alert(`${id}を削除`)
    // (PUT)カテゴリ削除SQL
  }
}

/* イベント着火 */
document.addEventListener("deviceready", function () {
  connectDatabase();
}, false);
