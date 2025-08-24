/*************************************

项目名称：Revenuecat系列解锁合集
更新日期：2025-08-24
脚本作者：@Daniel

**************************************

[rewrite_local]
^https:\/\/api\.(revenuecat|rc-backup)\.com\/.+\/(receipts$|subscribers\/?(.*?)*$) url script-response-body https://raw.githubusercontent.com/Daniel0829/Collections/refs/heads/Scripts/Reheji.js
^https:\/\/api\.(revenuecat|rc-backup)\.com\/.+\/(receipts$|subscribers\/?(.*?)*$) url script-request-header https://raw.githubusercontent.com/Daniel0829/Collections/refs/heads/Scripts/Reheji.js

[mitm]
hostname = api.revenuecat.com, api.rc-backup.com

*************************************/

let obj = {};
let ddm = JSON.parse(typeof $response != "undefined" && $response.body || "{}");

const headers = $request.headers;
const ua = headers['User-Agent'] || headers['user-agent'];
const bundle_id = headers['X-Client-Bundle-ID'] || headers['x-client-bundle-id'];

// 这些App作者明确要求禁止对其进行MITM，因此脚本会跳过它们
const forbiddenApps = ['Rond', 'Filebar', 'Fileball', 'APTV', '车票票', 'eTicket', 'PureLibro', '喝水羊驼', 'waterllama', 'ReLens'];

function isForbiddenAppPresent(ua, body) {
    const targetString = [ua, body].filter(Boolean).join(' '); // 合并非空字符串
    return forbiddenApps.some(app => targetString.includes(app));
}

if (isForbiddenAppPresent(ua, $request?.body)) {
    console.log("⛔️检测到禁止 MITM 的 APP，脚本停止运行！");
    $done({});
}

// 通过 Bundle ID 精准匹配 App
const bundle = {
    'com.valo.reader.vip2.forever': { name: 'vip', id: 'com.valo.reader.vip2.forever', cm: 'sjb' }, //读不舍手
    'com.trainfitness.Train': { name: 'Pro', id: 'TrainAnnualSubscription', cm: 'sja' }, //TrainFitness 健身追踪器
};

// 通过 User-Agent 模糊匹配 App
const listua = {
    'SnapWords': { name: 'Pro access', id: 'com.happyplan.snapwords.premium.subscription.yearly', cm: 'sja' }, //CapWords-拍物品学语言
    'Stress': { name: 'StressWatch Pro', id: 'stress_membership_lifetime', cm: 'sjb' }, //StressWatch压力自测提醒
    'Unfold': { name: 'REDUCED_PRO_YEARLY', id: 'UNFOLD_PRO_YEARLY', cm: 'sja' }, //Unfold-视频和照片编辑器
    'Binsoo': { name: 'vibe', id: 'annual', cm: 'sja' }, //Binsoo
    'Photoooo': { name: 'lifetime', id: 'canoe_28_rnb_forever', cm: 'sjb' }, //Phorase-专业AI消除助手
    'No%20Fusion': { name: 'LivePhoto', id: 'com.grey.nofusion.livephoto', cm: 'sjb' }, //NoFusion-相机
    'FujiLifeStyle': { name: 'FUJIStyle Pro(Year)', id: 'FujiStyle2024003', cm: 'sja' }, //FUJISTYLE-富士色彩配方
    'Currency': { name: 'plus', id: 'com.jeffreygrossman.currencyapp.iap.plus', cm: 'sja' }, //Currency-汇率查询
    'Airmail': { name: 'Airmail Premium', id: 'Airmail_iOS_Yearly_P', cm: 'sja' }, //Airmail-邮箱管理
    'Joy': { name: 'pro', id: 'com.indiegoodies.Agile.lifetime2', cm: 'sjb' }, //Joy AI
    'AnkiPro': { name: 'Premium', id: 'com.ankipro.app.lifetime', cm: 'sjb' }, //AnkiPro
    'Tide%20Guide': { name: 'Tides+', id: 'TideGuidePro_Lifetime_Family_149.99', cm: 'sjb' }, //Tide Guide潮汐
    'Gear': { name: 'subscription', id: 'com.gear.app.yearly', cm: 'sja' }, //Gear浏览器
    'PM4': { name: 'pro', id: 'pm4_pro_1y_2w0', cm: 'sja' }, //Obscura
    'Project%20Delta': { name: 'rc_entitlement_obscura_ultra', id: 'com.benricemccarthy.obscura4.obscura_ultra_sub_annual', cm: 'sja' }, //Obscura
    'Rec': { name: 'rec.paid', id: 'rec.paid.onetime', cm: 'sjb' }, //Rec相机
    'Darkroom': { name: 'iapkit_darkroomplus', id: 'co.bergen.Darkroom.product.forever.everything', cm: 'sjb' }, //Darkroom-照片/视频编辑
    'WhiteCloud': { name: 'allaccess', id: 'wc_pro_1y', cm: 'sja' }, //白云天气
    'Spark': { name: 'premium', id: 'spark_6999_1y_1w0', nameb: 'premium', idb: 'spark_openai_tokens_4xt', cm: 'sja' }, //Spark_Mail-邮箱管理
    'Pillow': { name: 'premium', id: 'com.neybox.pillow.premium.year.v2', cm: 'sja' }, //Pillow-睡眠周期跟踪
    'VSCO': { name: 'pro', id: 'vscopro_global_5999_annual_7D_free', cm: 'sja' } //VSCO-照片与视频编辑编辑
};

// 如果是请求阶段，仅修改请求头后返回
if (typeof $response === 'undefined') {
    delete headers['If-None-Match'];
    delete headers['if-none-match'];
    obj['headers'] = headers;
    $done(obj);
}

// 过滤掉一些非关键的API请求
if (/(offerings|attributes|adservices_attribution)/.test($request.url)) {
    console.log('拦截到 offerings/attributes 请求，已跳过。');
    $done({});
}

// 定义两种订阅时间模型：sja (订阅) 和 sjb (买断)
const timea = {
    'purchase_date': '2024-01-01T01:01:01Z',
    'expires_date': '2099-12-31T23:59:59Z'
};
const timeb = {
    'original_purchase_date': '2024-01-01T01:01:01Z',
    'is_sandbox': false,
    'store_transaction_id': '1000000000000000',
    'store': 'app_store',
    'ownership_type': 'PURCHASED'
};

let name, nameb, ids, idb, data;
let anchor = true; // true代表订阅模式，false代表非订阅模式
let localMatched = false;

// 遍历本地列表，匹配App
for (const src of [listua, bundle]) {
    for (const i in src) {
        const testTarget = (src === listua) ? ua : bundle_id;
        if (new RegExp('^' + i, 'i').test(testTarget)) {
            if (src[i].cm.includes('sja')) {
                data = timea;
                anchor = true;
            } else if (src[i].cm.includes('sjb')) {
                data = { 'purchase_date': '2024-01-01T01:01:01Z' };
                anchor = true;
            } else if (src[i].cm.includes('sjc')) {
                data = timea;
                anchor = false;
            }
            ids = src[i].id;
            name = src[i].name || '';
            idb = src[i].idb;
            nameb = src[i].nameb;
            localMatched = true;
            break;
        }
    }
    if (localMatched) break;
}

// 更新订阅信息的函数
const updateEntitlements = function (entitlementName = '', productId = '', isAnchor = true) {
    const finalName = name || entitlementName;
    const finalIds = ids || productId;
    const finalData = data || timea;
    const subscriptionDetails = Object.assign({}, finalData, timeb);

    if (!anchor) { // 非订阅模式
        ddm.subscriber.non_subscriptions = Object.assign(ddm.subscriber.non_subscriptions || {}, {
            [finalIds]: [Object.assign({}, { 'id': finalIds }, subscriptionDetails)]
        });
        ddm.subscriber.subscriptions = Object.assign(ddm.subscriber.subscriptions || {}, {
            [finalIds]: finalData
        });
    }

    if (!isAnchor && finalName) { // 主订阅信息
        ddm.subscriber.entitlements = Object.assign(ddm.subscriber.entitlements || {}, {
            [finalName]: Object.assign({}, finalData, { 'product_identifier': finalIds })
        });
    }

    ddm.subscriber.subscriptions = Object.assign(ddm.subscriber.subscriptions || {}, {
        [finalIds]: subscriptionDetails
    });

    if (idb && nameb && !isAnchor) { // 处理第二个订阅ID (如Spark)
        ddm.subscriber.entitlements = Object.assign(ddm.subscriber.entitlements || {}, {
            [nameb]: Object.assign({}, finalData, { 'product_identifier': idb })
        });
        ddm.subscriber.subscriptions = Object.assign(ddm.subscriber.subscriptions || {}, {
            [idb]: subscriptionDetails
        });
    }
};

// 备用方案，当本地列表没有时，尝试从服务器响应中获取产品信息
const fetchProductEntitlements = function () {
    // ... (这部分是网络请求逻辑，用于获取产品ID和授权名称)
    // 为了简洁，这里省略了具体的网络请求实现，但其目的是获取产品ID后调用 updateEntitlements
    // 如果失败，会调用 fallbackSolution
};

// 最终的备用方案，使用一个通用的ID
const fallbackSolution = function () {
    console.log('执行备用方案...');
    updateEntitlements('pro', 'com.ddm1023.pro.lifetime', false);
    $done({ body: JSON.stringify(ddm) });
};

// 主逻辑
if (localMatched) {
    console.log('本地列表匹配成功。');
    updateEntitlements();
    $done({ body: JSON.stringify(ddm) });
} else {
    // 如果本地列表没有匹配到，则执行网络请求等备用方案
    console.log('本地列表未匹配，尝试云端获取...');
    // ... 调用 fetchProductEntitlements 的逻辑
    // 为了演示清晰，此处直接调用最终备用方案
    fallbackSolution();
}