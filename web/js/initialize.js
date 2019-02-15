//データベース接続
db = null; // dbオブジェクト
DB_NAME = 'selfManagement'; // DB名

connectDatabase = function () {
  applican.database.open(DB_NAME, openDb_success, openDb_error);
}
connectDatabase2 = function () {
  applican.database.open(DB_NAME, openDbOnGraph_success, openDb_error);
}
openDb_success = function (db_obj) {
  db = db_obj;
  is_CreatedTable();
}
openDbOnGraph_success = function (db_obj) {
  db = db_obj;
  getAllWorkRecords();
}
openDb_error = function (error) {
  alert(
    `Open Error!
    ${error}`
  )
}

// テーブルがあるかのチェック (=アプリ初期起動時かどうか)
is_CreatedTable = function () {
  if (!is_OpenedDB()) return;
  const sql = "select count(*) AS cnt from sqlite_master where type='table' and name='categories'";
  db.query(sql, isExistedTableSuccess, isExistedTableError);
}
isExistedTableSuccess = function (result) {
  initialOpen = result.rows[0].cnt;
  if (initialOpen === 0) {
    // テーブルがない場合 初期カテゴリーを作成して表示
    initializeCreateTable();
  } else {
    // テーブルがある場合
    getAllCategories("home");
  }
}
isExistedTableError = function (error) {
  alert('ERROR!');
  alert(error.message);
}

// データベースを開いているかのチェック
is_OpenedDB = function () {
  if (db === null) {
    alert("データベースを開いてください。");
    return 0;
  } else {
    return 1;
  }
}

// テーブルを作成 -> 初回起動時
initializeCreateTable = function () {
  if (!is_OpenedDB()) return;
  //SQL配列の例 初期化
  const sqls = [
    // categories テーブル
    // "DROP TABLE IF EXISTS categories",
    "CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY, name letCHAR(50) NOT NULL, created_at DATETIME NOT NULL DEFAULT (DATETIME('now','localtime')), validated INT(1) NOT NULL DEFAULT '1')",
    "INSERT INTO categories (name) VALUES ('睡眠')",
    "INSERT INTO categories (name) VALUES ('勉強')",
    "INSERT INTO categories (name) VALUES ('読書')",
    "INSERT INTO categories (name) VALUES ('移動')",
    "INSERT INTO categories (name) VALUES ('食事')",
    "INSERT INTO categories (name) VALUES ('風呂')",
    "INSERT INTO categories (name) VALUES ('遊び')",
    "INSERT INTO categories (name) VALUES ('仕事')",

    // workd_recordsテーブル
    "CREATE TABLE IF NOT EXISTS works_records (id INTEGER PRIMARY KEY, categories_id int(11) NOT NULL, started_at DATETIME NOT NULL DEFAULT (DATETIME('now','localtime')), finished_at DATETIME DEFAULT NULL, edited int(1) DEFAULT '0', validated INT(1) NOT NULL DEFAULT '1',FOREIGN KEY(categories_id) REFERENCES categories(id))"
  ];
  db.execTransaction(sqls, execTransactionSuccess, execTransactionError);
}
/*
 * 一括処理実行成功時のcallback処理
 * 	insertId					データベースに挿入された行の行番号
 * 	rowsAffected : Number		データ操作件数（INSERT,UPDATE,DELETE時）
 */
execTransactionSuccess = function (result) {
  getAllCategories("home");
}
/*
 * 一括処理実行失敗時のcallback処理
 */
execTransactionError = function (error) {
  const dump = `SQL一括実行に失敗しました。
  ${error.message}`
  alert(dump);
}

/* カテゴリー検索 */
// 全カテゴリーデータ
getAllCategories = function (tag) {
  if (!is_OpenedDB()) return;
  const sql = "SELECT * FROM categories WHERE validated = 1";
  if (tag === "home") db.query(sql, searchDataSuccess, searchDataError); // 遷移元がホーム時はボタンを出力
}

/* カテゴリー検索 */
searchDataSuccess = function (result) {
  let dump = "データ検索成功しました。\n";
  let cnt = result.rows.length;
  dump += "行数:" + cnt + "\n";
  for (let i = 0; i < cnt; i++) {
    dump += "id:" + result.rows[i].id + ", data:" + result.rows[i].name + ", data2:" + result.rows[i].created_at + ", data3:" + result.rows[i].validated + "\n";
  }
  printButton(result);
}
/* 作業レコード検索 */
// term は 今日から何日前までかの期間
getAllWorkRecords = function (term = DAYLY) {
  if (!is_OpenedDB()) return;
  let sql;
  switch (term) {
    case DAYLY:
      sql = `SELECT WR.categories_id, C.id, C.name AS name, C.validated AS v1, WR.validated AS v2, SUM(strftime('%s', WR.finished_at) - strftime('%s', WR.started_at)) AS elapsed_time FROM works_records AS WR INNER JOIN categories AS C ON WR.categories_id = C.id WHERE v1 = 1 AND v2 = 1 GROUP BY WR.categories_id`;
      break;
    case WEEKLY:
      sql = "SELECT * FROM works_records WHERE validated = 1";
      break;
    case MONTHLY:
      sql = "SELECT * FROM works_records WHERE validated = 1";
      break;
    default:
      alert("error!");
      break;
  }
  // alert(sql);
  db.query(sql, searchDataSuccess2, searchDataError);
}
searchDataSuccess2 = function (result) {
  printGraph(result);
}
/* データ検索失敗時のcallback処理 */
searchDataError = function (error) {
  let dump = "データ検索に失敗しました。\n";
  dump += error.message + "\n";
}


/* 作業レコード記録 */
startRecordWork = function (id) {
  const sql = `INSERT INTO works_records (categories_id) VALUES(${id})`;
  db.query(sql, RecordWorkSuccess, RecordWorkError);
}
finishRecordWork = function (type = "click") {
  const sql = `UPDATE works_records SET finished_at = (DATETIME('now','localtime')) ORDER BY id DESC LIMIT 1`;
  switch (type) {
    case "graph":
      db.query(sql, RecordWorkMoveGraphSuccess, RecordWorkError);
      break;
    case "edit":
      db.query(sql, RecordWorkMoveEditSuccess, RecordWorkError);
      break;
    default:
      db.query(sql, RecordWorkSuccess, RecordWorkError);
      break;
  }
}
RecordWorkMoveGraphSuccess = function () {
  location.href = './graph.html';
}
RecordWorkMoveEditSuccess = function () {
  resetTimer();
}
RecordWorkSuccess = function (result) {
  resetTimer();
}
RecordWorkError = function (error) {
}

/* 最新のレコードを取得 */
getLatestRecord = function () {
  const sql = `SELECT * FROM works_records ORDER BY id DESC LIMIT 1`;
  db.query(sql, getLatestRecordSuccess, getLatestRecordError);
}
getLatestRecordSuccess = function (result) {
  if (result.rows[0].finished_at === null) {
    let date = result.rows[0].started_at.replace(/-/g, '/');
    let recordTime = new Date(date);
    let currentTime = new Date();
    let calc = new Date(+currentTime - recordTime);
    startTimer(calc);
  }
}
getLatestRecordError = function (error) {
  alert(error);
  alert("MISS")
}

/* カテゴリー追加 */
handleAddCategory = function (name) {
  const sql = `INSERT INTO categories (name) VALUES("${name}")`;
  db.query(sql, addCategorySuccess, addCategoryError);
}
addCategorySuccess = function (result) {
  location.reload();
}
addCategoryError = function (error) {
  alert(error);
}

/* カテゴリー削除 */
handleDeleteCategory = function (id) {
  const sql = `UPDATE categories SET validated = 0 WHERE id = ${id}`;
  db.query(sql, deleteCategorySuccess, deleteCategoryError);
}
deleteCategorySuccess = function (result) {
  location.reload();
}
deleteCategoryError = function (e) {
  alert(e);
}
