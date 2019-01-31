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
  let timeObj = document.getElementById('elapsed_time');
  timeObj.textContent = "00:00:00";
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
      <li class="adjust-box box-1x2" id="button_${id}" ontouchstart="">
        <div class="inner">
          <p>${name}</p>
        </div>
      </li>`
  let todoParentObj = document.querySelector('.todo_category ul');
  todoParentObj.innerHTML += buttonObj;
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
