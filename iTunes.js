/*************************************

项目名称：iTunes-系列解锁合集
更新日期：2024-08-27

**************************************

[rewrite_local]
^https?:\/\/buy\.itunes\.apple\.com\/verifyReceipt$ url script-response-body https://raw.githubusercontent.com/Daniel0829/Collections/Scripts/iTunes.js

[mitm]
hostname = buy.itunes.apple.com

*************************************/


var Daniel = JSON.parse($response.body);
const ua = $request.headers['User-Agent'] || $request.headers['user-agent'];
const bundle_id = Daniel.receipt["bundle_id"] || Daniel.receipt["Bundle_Id"];
const yearid = `${bundle_id}.year`;
const yearlyid = `${bundle_id}.yearly`;
const yearlysubscription = `${bundle_id}.yearlysubscription`;

const list = {
  'Overdrop': { cm: 'timeb', hx: 'hxpda', id: "com.weather.overdrop.forever", latest: "Daniel" }, //Overdrop-天气预报
  'habitdot': { cm: 'timeb', hx: 'hxpda', id: "habitdots_pro_forever", latest: "Daniel" },  //习惯点点
  'com.traveltao.ExchangeAssistant': { cm: 'timea', hx: 'hxpda', id: "lxbyplus", latest: "Daniel" },  //极简汇率(需试用)
  'WaterMaskCamera': { cm: 'timea', hx: 'hxpda', id: "com.camera.watermark.yearly.3dayfree", latest: "Daniel" },  //徕卡水印相机
  'LogInput': { cm: 'timea', hx: 'hxpda', id: "com.logcg.loginput", latest: "Daniel" },  //落格输入法
  'com.teadoku.flashnote': { cm: 'timea', hx: 'hxpda', id: "pro_ios_ipad_mac", latest: "Daniel" },  //AnkiNote
  'com.tapuniverse.texteditor': { cm: 'timea', hx: 'hxpda', id: "com.tapuniverse.texteditor.w", latest: "Daniel" }  //TextEditor
  'com.risingcabbage.pro.camera': { cm: 'timea', hx: 'hxpda', id: "com.risingcabbage.pro.camera.yearlysubscription", latest: "Daniel" },  //ReLens相机
};

//内购数据变量
const receipt = { "quantity": "1", "purchase_date_ms": "1694250549000", "is_in_intro_offer_period": "false", "transaction_id": "490001314520000", "is_trial_period": "false", "original_transaction_id": "490001314520000", "purchase_date": "2023-09-09 09:09:09 Etc/GMT", "product_id": yearlyid, "original_purchase_date_pst": "2023-09-09 02:09:10 America/Los_Angeles", "in_app_ownership_type": "PURCHASED", "original_purchase_date_ms": "1694250550000", "web_order_line_item_id": "490000123456789", "purchase_date_pst": "2023-09-09 02:09:09 America/Los_Angeles", "original_purchase_date": "2023-09-09 09:09:10 Etc/GMT" };
const expirestime = { "expires_date": "2099-09-09 09:09:09 Etc/GMT", "expires_date_pst": "2099-09-09 06:06:06 America/Los_Angeles", "expires_date_ms": "4092599349000", };
let anchor = false;
let data;

// 核心内容处理
for (const i in list) {
  const regex = new RegExp(`^${i}`, `i`);
  if (regex.test(ua) || regex.test(bundle_id)) {
    const { cm, hx, id, ids, latest, version } = list[i];
    const receiptdata = Object.assign({}, receipt, { "product_id": id });
    //处理数据
    switch (cm) {
      case 'timea':
        data = [ Object.assign({}, receiptdata, expirestime)];
        break;
      case 'timeb':
        data = [receiptdata];
        break;
      case 'timec':
        data = [];
        break;
      case 'timed':
        data = [
          Object.assign({}, receiptdata, { "product_id": ids }),
          Object.assign({}, receiptdata, expirestime, { "product_id": id })
        ];
        break;
    }
    //处理核心收尾
    if (hx.includes('hxpda')) {
      Daniel["receipt"]["in_app"] = data;
      Daniel["latest_receipt_info"] = data;
      Daniel["pending_renewal_info"] = [{ "product_id": id, "original_transaction_id": "490001314520000", "auto_renew_product_id": id, "auto_renew_status": "1" }];
      Daniel["latest_receipt"] = latest;
    }
    else if (hx.includes('hxpdb')) {
      Daniel["receipt"]["in_app"] = data;
    }
    else if (hx.includes('hxpdc')) {
      const xreceipt = { "expires_date_formatted" : "2099-09-09 09:09:09 Etc/GMT", "expires_date" : "4092599349000", "expires_date_formatted_pst" : "2099-09-09 06:06:06 America/Los_Angeles", "product_id" : id, };
      Daniel["receipt"] = Object.assign({}, Daniel["receipt"], xreceipt);
      Daniel["latest_receipt_info"] = Object.assign({}, Daniel["receipt"], xreceipt);
      Daniel["status"] = 0;
      Daniel["auto_renew_status"] = 1;
      Daniel["auto_renew_product_id"] = id;
      delete Daniel["latest_expired_receipt_info"];
      delete Daniel["expiration_intent"];
    }
    // 判断是否需要加入版本号
    if (version && version.trim() !== '') { Daniel["receipt"]["original_application_version"] = version; }
    anchor = true;
    console.log('恭喜您，已操作成功');
    break;
  }
}

// 如果没有匹配到 UA 或 bundle_id 使用备用方案
if (!anchor) {
  data = [ Object.assign({}, receipt, expirestime)];
  Daniel["receipt"]["in_app"] = data;
  Daniel["latest_receipt_info"] = data;
  Daniel["pending_renewal_info"] = [{ "product_id": yearlyid, "original_transaction_id": "490001314520000", "auto_renew_product_id": yearlyid, "auto_renew_status": "1" }];
  Daniel["latest_receipt"] = "Daniel";
  console.log('很遗憾未能识别出UA或bundle_id\n但已使用备用方案操作成功');
}

$done({ body: JSON.stringify(Daniel) });
