/*************************************

项目名称：Revenuecat 系列解锁合集
更新日期：2024-08-27

**************************************

[rewrite_local]
^https:\/\/api\.revenuecat\.com\/.+\/(receipts$|subscribers\/?(.*?)*$) url script-response-body https://raw.githubusercontent.com/Daniel0829/Collections/Scripts/Reheji.js
^https:\/\/api\.revenuecat\.com\/.+\/(receipts$|subscribers\/?(.*?)*$) url script-request-header https://raw.githubusercontent.com/Daniel0829/Collections/Scripts/Reheji.js

[mitm]
hostname = api.revenuecat.com

*************************************/


const Daniel = {};
const headers = $request.headers;
const Daniel0829 = JSON.parse(typeof $response != "undefined" && $response.body || null);
const ua = headers['User-Agent'] || headers['user-agent'];
const bundle_id = headers['X-Client-Bundle-ID'] || headers['x-client-bundle-id'];

//排除已禁止MITM的APP
const forbiddenApps = ['Fileball', 'APTV', 'Rond'];
const forbiddenAppFound = forbiddenApps.find(appName => (ua && ua.includes(appName)) || ($request.body && $request.body.includes(appName)));
if (forbiddenAppFound) {
  console.log(`发现禁止MITM的APP: ${forbiddenAppFound}，已停止运行脚本!`);
  $done({});
}

//识别bundle_id
const bundle = {
  'app.imone.OneWidget': { name: 'pro', id: 'app.imone.OneWidget.Lifetime', cm: 'sjb' },  //OneWidget-小组件
}

//识别UA
const list = {
  'Binsoo': { name: 'vibe', id: 'annual', cm: 'sja' },  //Binsoo-照片滤镜/编辑
  'TQBrowser': { name: 'pro_lt', id: 'com.tk.client.lifetime', cm: 'sjb' },  //Teak浏览器
  'Currency': { name: 'plus', id: 'com.jeffreygrossman.currencyapp.iap.plus', cm: 'sja' },  //Currency-汇率查询
  'AnkiPro': { name: 'Premium', id: 'com.ankipro.app.lifetime', cm: 'sjb' },  //AnkiPro
  'Gear': { name: 'subscription', id: 'com.gear.app.yearly', cm: 'sja' },  //Gear浏览器
  'PM4': { name: 'pro', id: 'pm4_pro_1y_2w0', cm: 'sja' },  //Obscura
  'Project%20Delta': { name: 'rc_entitlement_obscura_ultra', id: 'com.benricemccarthy.obscura4.obscura_ultra_sub_annual', cm: 'sja' },  //Obscura
  'Darkroom': { name: 'co.bergen.Darkroom.entitlement.allToolsAndFilters', id: 'co.bergen.Darkroom.product.forever.everything', cm: 'sja' },  //Darkroom-照片/视频编辑
  'WhiteCloud': { name: 'allaccess', id: 'wc_pro_1y', cm: 'sja' },  //白云天气
  'Spark': { name: 'premium', id: 'spark_5999_1y_1w0', cm: 'sja' },  //Spark_Mail-邮箱管理
  'Anybox': { name: 'pro', id: 'cc.anybox.Anybox.annual', cm: 'sja' },  //Anybox-跨平台书签管理
  'VSCO': { name: 'pro', id: 'vscopro_global_5999_annual_7D_free', cm: 'sja' }  //VSCO-照片与视频编辑
};

if (typeof $response == "undefined") {
  delete headers["x-revenuecat-etag"];
  delete headers["X-RevenueCat-ETag"];
  Daniel.headers = headers;
} else if (Daniel0829 && Daniel0829.subscriber) {
  Daniel0829.subscriber.subscriptions = Daniel0829.subscriber.subscriptions || {};
  Daniel0829.subscriber.entitlements = Daniel0829.subscriber.entitlements || {};
  let name,nameb,ids,idb,data;
  for (const src of [list, bundle]) {
    for (const i in src) {
      const test = src === list ? ua : bundle_id;
      if (new RegExp(`^${i}`, `i`).test(test)) {
      if (src[i].cm.indexOf('sja') != -1) { data = {  "purchase_date" : "2023-09-09T09:09:09Z",  "expires_date" : "2099-09-09T09:09:09Z" };  } else if (src[i].cm.indexOf('sjb') != -1) { data = {  "purchase_date" : "2023-09-09T09:09:09Z" }; }
      ids = src[i].id;name = src[i].name;idb = src[i].idb;nameb = src[i].nameb;
      break;
      }
    }
  }
  if (!name || !ids) {
    data = {  "purchase_date" : "2023-09-09T09:09:09Z",  "expires_date" : "2099-09-09T09:09:09Z" };
    name = 'pro';
    ids = 'com.Daniel0829.pro';
  }
  Daniel0829.subscriber.entitlements[name] = Object.assign({}, data, { product_identifier: ids });
  if (typeof nameb !== 'undefined' && nameb !== null) {
    Daniel0829.subscriber.entitlements[nameb] = Object.assign({}, data, { product_identifier: idb });
  }
  const subData = Object.assign({},data,{  "Author": "Daniel0829",  "Telegram": "https://t.me/Daniel0829",  "warning": "仅供学习，禁止转载或售卖",  "original_purchase_date": "2023-09-09T09:09:09Z",  "store_transaction_id" : "4900066666666666",  "period_type" : "trial",  "store": "app_store",  "ownership_type": "PURCHASED"  });
  Daniel0829.subscriber.subscriptions[ids] = subData;
  if (typeof idb !== 'undefined' && idb !== null) {
    Daniel0829.subscriber.subscriptions[idb] = subData;
  }
  Daniel.body = JSON.stringify(Daniel0829);
  console.log('已操作成功');
}

$done(Daniel);
