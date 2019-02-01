//データベース接続
db = null; // dbオブジェクト
DB_NAME = 'selfManagement'; // DB名

connectDatabase = function () {
  applican.database.open(DB_NAME, openDb_success, openDb_error);
}
openDb_success = function (db_obj) {
  db = db_obj;
  is_CreatedTable();
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
    getAllCategories();
  }
}
isExistedTableError = function (result) {
  alert('ERROR!');
  alert(result.rows[0]);
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
    // categories　テーブル
    // "DROP TABLE IF EXISTS categories",
    "CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY, name letCHAR(50) NOT NULL, created_at DATETIME NOT NULL DEFAULT (DATETIME('now','localtime')), validated INT(1) NOT NULL DEFAULT '1')",
    "INSERT INTO categories (name) VALUES ('睡眠')",
    "INSERT INTO categories (name) VALUES ('勉強')",
    "INSERT INTO categories (name) VALUES ('読書')",
    "INSERT INTO categories (name) VALUES ('移動')",
    "INSERT INTO categories (name) VALUES ('食事')",
    "INSERT INTO categories (name) VALUES ('風呂')",
    "INSERT INTO categories (name) VALUES ('遊び')",

    // workd_recordsテーブル
    "CREATE TABLE IF NOT EXISTS works_records (id INTEGER PRIMARY KEY, categories_id int(11) NOT NULL, started_at DATETIME NOT NULL DEFAULT (DATETIME('now','localtime')), finished_at DATETIME, edited int(1) DEFAULT '0', validated INT(1) NOT NULL DEFAULT '1',FOREIGN KEY(categories_id) REFERENCES categories(id))"
  ];
  db.execTransaction(sqls, execTransactionSuccess, execTransactionError);
}
/*
 * 一括処理実行成功時のcallback処理
 * 	insertId					データベースに挿入された行の行番号
 * 	rowsAffected : Number		データ操作件数（INSERT,UPDATE,DELETE時）
 */
execTransactionSuccess = function (result) {
  getAllCategories();
}
/*
 * 一括処理実行失敗時のcallback処理
 */
execTransactionError = function (error) {
  const dump = `SQL一括実行に失敗しました。
  ${error.message}`
  alert(dump);
}

/* カテゴリー検索　*/
// 全カテゴリーデータ
getAllCategories = function () {
  if (!is_OpenedDB()) return;
  const sql = "SELECT * FROM categories WHERE validated = 1";
  db.query(sql, searchDataSuccess, searchDataError);
}
// 特定のカテゴリーデータ　(使用する？)
// getOneCategory = function (category_id) {
//   if (!is_OpenedDB()) return;
//   const sql = `SELECT * FROM categories WHERE id = ${category_id} validated = 1`;
//   db.query(sql, searchDataSuccess, searchDataError);
// }
/*
 * データ検索成功時のcallback処理
 * 	insertId					データベースに挿入された行の行番号
 * 	rowsAffected : Number		データ操作件数（INSERT,UPDATE,DELETE時）
 * 	rows         : DatabaseResultRow[]	データ検索結果（SELECT時）
 */
searchDataSuccess = function (result) {
  let dump = "データ検索成功しました。\n";
  let cnt = result.rows.length;
  dump += "行数:" + cnt + "\n";
  for (let i = 0; i < cnt; i++) {
    dump += "id:" + result.rows[i].id + ", data:" + result.rows[i].name + ", data2:" + result.rows[i].created_at + ", data3:" + result.rows[i].validated + "\n";
  }
  alert(dump);
  printButton(result);
}
searchDataSuccess2 = function (result) {
  let dump = "データ検索成功しました。\n";
  let cnt = result.rows.length;
  dump += "行数:" + cnt + "\n";
  for (let i = 0; i < cnt; i++) {
    dump += "id:" + result.rows[i].id + ", start:" + result.rows[i].started_at + ", finish:" + result.rows[i].finished_at + ", category:" + result.rows[i].categories_id + "\n";
  }
}
/* データ検索失敗時のcallback処理 */
searchDataError = function (error) {
  let dump = "データ検索に失敗しました。\n";
  dump += error.message + "\n";
}

/* 作業レコード検索　*/
// term は 今日から何日前までかの期間
getAllWorkRecords = function (term = 1) {
  if (!is_OpenedDB()) return;
  // const sql = "SELECT * FROM works_records WHERE validated = 1 WHEHRE started_at ......";
  const sql = "SELECT * FROM works_records WHERE validated = 1 ";
  db.query(sql, searchDataSuccess2, searchDataError);
}

/* 作業レコード記録 */
startRecordWork = function (id) {
  const sql = `INSERT INTO works_records (categories_id) VALUES(${id})`;
  db.query(sql, RecordWorkSuccess, RecordWorkError);
}
finishRecordWork = function () {
  const sql = `UPDATE works_records SET finished_at = CURRENT_TIMESTAMP ORDER BY id DESC LIMIT 1`;
  db.query(sql, RecordWorkSuccess, RecordWorkError);
}
RecordWorkSuccess = function (result) {
}
RecordWorkError = function (error) {
}
