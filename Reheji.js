/*************************************

项目名称：Revenuecat 系列解锁合集
更新日期：2024-07-27

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
const forbiddenApps = ['Fileball', 'APTV'];
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
  'TQBrowser': { name: 'pro_lt', id: 'com.tk.client.lifetime', cm: 'sjb' },  //Teak浏览器
  'metaslip': { name: 'Pro', id: 'ms_lifetime', cm: 'sjb' },  //元思笔记
  'Currency': { name: 'plus', id: 'com.jeffreygrossman.currencyapp.iap.plus', cm: 'sja' },  //Currency-汇率查询
  'Airmail': { name: 'Airmail Premium', id: 'Airmail_iOS_Yearly_P', cm: 'sja' },  //Airmail
  'timetrack.io': { name: 'atimelogger-premium-plus', id: 'ttio_premium_plus', cm: 'sjb' },  //aTimeloggerPro-时间记录
  'ShellBoxKit': { name: 'pro', id: 'ShellBoxKit.Lifetime', cm: 'sjb' },  //CareServer-服务器监控
  'IDM': { name: 'premium', id: 'sub_yearly_idm', cm: 'sja' },  //IDM-下载
  'Calflow': { name: 'pro', id: 'kike.calflow.pro.lifetime', cm: 'sjb' },  //Calflow
  'reader': { name: 'vip2', id: 'com.valo.reader.vip2.year', cm: 'sja' },  //读不舍手
  'AIKeyboard': { name: 'plus_keyboard', id: 'aiplus_keyboard_yearly', cm: 'sja' },  //AIKeyboard键盘
  'PDF%20Viewer': { name: 'sub.pro', id: 'com.pspdfkit.viewer.sub.pro.yearly', cm: 'sja' },  //PDF Viewerr
  'AnkiPro': { name: 'Premium', id: 'com.ankipro.app.lifetime', cm: 'sjb' },  //AnkiPro
  'Gear': { name: 'subscription', id: 'com.gear.app.yearly', cm: 'sja' },  //Gear浏览器
  'server_bee': { name: 'Pro', id: 'pro_45_lifetime', cm: 'sjb' },  //serverbee终端监控管理
  'ProCam': { name: 'pro', id: 'pro_lifetime', cm: 'sjb' },  //ProCam相机
  'transmission_ui': { name: 'Premium', id: '200002', cm: 'sjb' },  //Transmission服务器
  'PM4': { name: 'pro', id: 'pm4_pro_1y_2w0', cm: 'sja' },  //Obscura
  'Project%20Delta': { name: 'rc_entitlement_obscura_ultra', id: 'com.benricemccarthy.obscura4.obscura_ultra_sub_annual', cm: 'sja' },  //Obscura
  'Vision': { name: 'promo_3.0', id: 'vis_lifetime_3.0_promo', cm: 'sja' },  //Vision
  'Context_iOS': { name: 'Context Pro', id: 'ctx_sub_1y_sspai_preorder_angel', cm: 'sja' },  //Context
  'Rec': { name: 'rec.paid', id: 'rec.paid.onetime', cm: 'sjb' },  //Rec相机
  'MOZE': { name: 'MOZE_PREMIUM_SUBSCRIPTION', id: 'MOZE_PRO_SUBSCRIPTION_YEARLY_BASIC', cm: 'sja' },  //MOZE记账
  'Darkroom': { name: 'co.bergen.Darkroom.entitlement.allToolsAndFilters', id: 'co.bergen.Darkroom.product.forever.everything', cm: 'sja' },  //Darkroom-照片/视频编辑
  'WhiteCloud': { name: 'allaccess', id: 'wc_pro_1y', cm: 'sja' },  //白云天气
  'Spark': { name: 'premium', id: 'spark_5999_1y_1w0', cm: 'sja' },  //Spark_Mail-邮箱管理
  'NotePlan': { name: 'premium', id: 'co.noteplan.subscription.personal.annual', cm: 'sja' },  //NotePlan
  'vibes': { name: 'patron', id: 'com.andyworks.vibes.yearlyPatron', cm: 'sja' },  //NotBoring-Vibes个性化音乐
  'simple-weather': { name: 'patron', id: 'com.andyworks.weather.yearlyPatron', cm: 'sja' },  //NotBoring-天气
  'streaks': { name: 'patron', id: 'com.andyworks.weather.yearlyPatron', cm: 'sja' },  //NotBoring-习惯
  'andyworks-calculator': { name: 'patron', id: 'com.andyworks.weather.yearlyPatron', cm: 'sja' },  //NotBoring-计算器
  'simple-timer': { name: 'patron', id: 'com.andyworks.weather.yearlyPatron', cm: 'sja' },  //NotBoring-时间
  'UTC': { name: 'Entitlement.Pro', id: 'tech.miidii.MDClock.subscription.month', cm: 'sja' },  //花样文字
  'Anybox': { name: 'pro', id: 'cc.anybox.Anybox.annual', cm: 'sja' },  //Anybox-跨平台书签管理
  '1Blocker': { name: 'premium', id: 'blocker.ios.iap.lifetime', cm: 'sjb' },  //1Blocker-广告拦截
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
