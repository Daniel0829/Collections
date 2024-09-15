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
  'VDIT': { cm: 'timea', hx: 'hxpda', id: "me.imgbase.videoday.profeaturesYearly", latest: "Daniel" }, //VDIT-视频转换
  'FastPlayer': { cm: 'timea', hx: 'hxpda', id: "VideoPlayer_ProVersion", latest: "Daniel" }, //万能播放器
  'SimpleNotation': { cm: 'timeb', hx: 'hxpda', id: "com.xinlin.notation.once", latest: "Daniel" }, //简谱大师
  'Xfuse': { cm: 'timeb', hx: 'hxpda', id: "com.xfuse.ProVision", latest: "Daniel" }, //磁力宅播放器
  'com.BertonYc.ScannerOCR': { cm: 'timeb', hx: 'hxpda', id: "Scanner_Subscibe_Permanent", latest: "Daniel" }, //万能扫描王
  'Rookie': { cm: 'timea', hx: 'hxpda', id: "com.jellybus.Rookie.IAP.PRO5999", latest: "Daniel" },//RKCAM
  'MoneyWiz': { cm: 'timea', hx: 'hxpda', id: "com.moneywiz.personalfinance.1year", latest: "Daniel" }, //MoneyWiz-个人财务
  'Overdrop': { cm: 'timeb', hx: 'hxpda', id: "com.weather.overdrop.forever", latest: "Daniel" }, //Overdrop-天气预报
  'PDFReaderPro%20Free': { cm: 'timeb', hx: 'hxpda', id: "com.pdfreaderpro.free.member.all_access_pack_permanent_license.001", latest: "Daniel" }, //PDFReaderProFree
  'OneExtractor': { cm: 'timeb', hx: 'hxpda', id: "com.OneExtractor.Video.Forever", latest: "Daniel" }, //视频提取器
  'com.Colin.Colors': { cm: 'timea', hx: 'hxpda', id: "com.colin.colors.annualVIP", latest: "Daniel" }, //搜图
  'PhotosSorter': { cm: 'timeb', hx: 'hxpda', id: "sorter.pro.ipa", latest: "Daniel" }, //Sorter-相册整理
  'intolive': { cm: 'timea', hx: 'hxpda', id: "me.imgbase.intolive.proSubYearly", latest: "Daniel" }, //intolive-实况壁纸制作器
  'MyAlbum': { cm: 'timeb', hx: 'hxpda', id: "com.colin.myalbum.isUpgradeVip", latest: "Daniel" }, //Cleaner-照片管理
  'VideoEditor': { cm: 'timeb', hx: 'hxpda', id: "com.god.videohand.alwaysowner", latest: "Daniel" }, //VideoShot
  'PhotoMovie': { cm: 'timea', hx: 'hxpda', id: "com.mediaeditor.photomovie.year", latest: "Daniel" }, //PhotoMovie-照片视频
  'GreetingScanner': { cm: 'timea', hx: 'hxpda', id: "com.alphaplus.greetingscaner.w.b", latest: "Daniel" },  //扫描识别王
  'Again': { cm: 'timeb', hx: 'hxpda', id: "com.owen.again.profession", latest: "Daniel" },  //Again-稍后阅读器
  'remotelg': { cm: 'timeb', hx: 'hxpda', id: "com.gqp.remotelg.lifetime", latest: "Daniel" },  //UniversalRemoteTV+ 遥控器
  'Notebook': { cm: 'timea', hx: 'hxpda', id: "com.zoho.notebook.ios.personal.yearly", latest: "Daniel" },  //Notebook
  'com.damon.dubbing': { cm: 'timea', hx: 'hxpda', id: "com.damon.dubbing.vip12", latest: "Daniel" },  //有声英语绘本
  'ZHUBEN': { cm: 'timea', hx: 'hxpda', id: "com.xiaoyu.yue", latest: "Daniel" },  //有声英语绘本
  'XIAOTangHomeParadise': { cm: 'timea', hx: 'hxpda', id: "com.yuee.mo2", latest: "Daniel" },  //鸿海幼儿启蒙
  'habitdot': { cm: 'timeb', hx: 'hxpda', id: "habitdots_pro_forever", latest: "Daniel" },  //习惯点点
  'com.eleven.chatgpt': { cm: 'timea', hx: 'hxpda', id: "com.eleven.chatgpt.yearly", latest: "Daniel" },  //ChatAI
  'MWeb%20iOS': { cm: 'timeb', hx: 'hxpda', id: "10001", latest: "Daniel" },  //MWeb-编辑器/笔记/发布
  'com.traveltao.ExchangeAssistant': { cm: 'timea', hx: 'hxpda', id: "lxbyplus", latest: "Daniel" },  //极简汇率(需试用)
  'Mindkit': { cm: 'timeb', hx: 'hxpda', id: "mindkit_permanently", latest: "Daniel" },  //Mindkit
  'DailySpending': { cm: 'timea', hx: 'hxpda', id: "com.xxtstudio.dailyspending.year", latest: "Daniel" },  //Daily记账
  'Reader': { cm: 'timeb', hx: 'hxpda', id: "com.xiaoqi.reader.forever", latest: "Daniel" },  //爱阅读-TXT阅读器
  'com.photoslab.ai.writerassistant': { cm: 'timea', hx: 'hxpda', id: "com.photoslab.ai.writerassistant.year", latest: "Daniel" },  //Smart AI
  'WaterMaskCamera': { cm: 'timea', hx: 'hxpda', id: "com.camera.watermark.yearly.3dayfree", latest: "Daniel" },  //徕卡水印相机
  'SymbolKeyboard': { cm: 'timeb', hx: 'hxpda', id: "fronts.keyboard.singingfish.one", latest: "Daniel" },  //Fonts花样字体
  'com.kuaijiezhilingdashi.appname': { cm: 'timea', hx: 'hxpda', id: "com.othermaster.yearlyvip", latest: "Daniel" },  //快捷指令库
  'LogInput': { cm: 'timea', hx: 'hxpda', id: "com.logcg.loginput", latest: "Daniel" },  //落格输入法
  'LifeTracker': { cm: 'timea', hx: 'hxpda', id: "com.dk.lifetracker.yearplan", latest: "Daniel" },  //Becord生活记录
  'com.chenxi.shanniankapian': { cm: 'timea', hx: 'hxpda', id: "com.chenxi.shannian.superNian", latest: "Daniel" },  //闪念
  '%E5%BD%95%E9%9F%B3%E4%B8%93%E4%B8%9A%E7%89%88': { cm: 'timea', hx: 'hxpda', id: "com.winat.recording.pro.yearly", latest: "Daniel" },  //录音专业版
  'com.readdle.CalendarsLite': { cm: 'timea', hx: 'hxpda', id: "com.readdle.CalendarsLite.subscription.year20trial7", latest: "Daniel" },  //Calendars-日历/计划
  'com.readdle.ReaddleDocsIPad': { cm: 'timea', hx: 'hxpda', id: "com.readdle.ReaddleDocsIPad.subscription.month10_allusers", latest: "Daniel" },  //Documents
  'com.zijayrate.analogcam': { cm: 'timea', hx: 'hxpda', id: "com.zijayrate.analogcam.vipforever10", latest: "Daniel" },  //oldroll复古相机
  'DoMemo': { cm: 'timea', hx: 'hxpda', id: "org.zrey.fastnote.yearly", latest: "Daniel" },  //DoMemo
  'com.yengshine.proccd': { cm: 'timea', hx: 'hxpda', id: "com.yengshine.proccd.yearly", latest: "Daniel" },  //ProCCD相机
  'com.palmmob.pdfios': { cm: 'timea', hx: 'hxpda', id: "com.palmmob.pdfios.168", latest: "Daniel" },  //图片PDF转换器
  'Habbit': { cm: 'timea', hx: 'hxpda', id: "HabitUpYearly", latest: "Daniel" },  //习惯清单
  'vpn': { cm: 'timea', hx: 'hxpda', id: "yearautorenew", latest: "Daniel" },  //VPN-unlimited
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
