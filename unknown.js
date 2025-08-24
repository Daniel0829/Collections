/*************************************

项目名称：Revenuecat系列解锁合集
更新日期：2025-08-24
脚本作者：@Daniel
优化版本：基于v2优化修复

**************************************

[rewrite_local]
^https:\/\/api\.(revenuecat|rc-backup)\.com\/.+\/(receipts$|subscribers\/?(.*?)*$) url script-response-body https://raw.githubusercontent.com/YourUsername/Collections/refs/heads/Scripts/Revenuecat-optimized.js
^https:\/\/api\.(revenuecat|rc-backup)\.com\/.+\/(receipts$|subscribers\/?(.*?)*$) url script-request-header https://raw.githubusercontent.com/YourUsername/Collections/refs/heads/Scripts/Revenuecat-optimized.js

[mitm]
hostname = api.revenuecat.com, api.rc-backup.com

*************************************/

// 工具函数：转义正则表达式特殊字符
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 这些App作者明确要求禁止对其进行MITM，因此脚本会跳过它们
const forbiddenApps = ['Rond', 'Filebar', 'Fileball', 'APTV', '车票票', 'eTicket', 'PureLibro', '喝水羊驼', 'waterllama', 'ReLens'];

/**
 * 检查用户代理或请求体中是否包含禁止MITM的应用程序标识
 * @param {string} ua - User Agent字符串
 * @param {string} body - 请求体字符串
 * @returns {boolean} 如果检测到禁止的App则返回true
 */
function isForbiddenAppPresent(ua, body) {
    const targetString = `${ua || ''} ${body || ''}`;
    return forbiddenApps.some(app => targetString.includes(app));
}

// 定义两种订阅时间模型：订阅模式 (sja) 和买断模式 (sjb)
const subscriptionModels = {
    sja: {
        purchase_date: '2024-01-01T01:01:01Z',
        expires_date: '2099-12-31T23:59:59Z',
        original_purchase_date: '2024-01-01T01:01:01Z',
        is_sandbox: false,
        store_transaction_id: '1000000000000000',
        store: 'app_store',
        ownership_type: 'PURCHASED'
    },
    sjb: {
        purchase_date: '2024-01-01T01:01:01Z',
        original_purchase_date: '2024-01-01T01:01:01Z',
        is_sandbox: false,
        store_transaction_id: '1000000000000000',
        store: 'app_store',
        ownership_type: 'PURCHASED'
    }
};

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

// 使用更有意义的变量名
const response = $response; // 原始响应对象
let responseObject = {};   // 准备返回的对象，初始为空

// 1. 处理请求阶段：如果 $response 不存在，说明是请求阶段
if (typeof response === "undefined") {
    // 删除 ETag，防止服务器返回 304 Not Modified，确保每次都能获取到完整的响应体
    delete $request.headers["x-revenuecat-etag"];
    delete $request.headers["X-RevenueCat-ETag"];
    responseObject.headers = $request.headers;
    $done(responseObject);
    return;
}

// 检查是否包含禁止的APP
if (isForbiddenAppPresent($request.headers['User-Agent'] || $request.headers['user-agent'], $request.body)) {
    console.log("⛔️检测到禁止 MITM 的 APP，脚本停止运行！");
    $done({});
}

// 2. 处理响应阶段：如果 $response 存在
responseObject.headers = response.headers;
let responseBody = JSON.parse(response.body);

if (responseBody && responseBody.subscriber) {
    // 使用 ?? 运算符确保对象存在，比 || 更严谨
    responseBody.subscriber.subscriptions = responseBody.subscriber.subscriptions ?? {};
    responseBody.subscriber.entitlements = responseBody.subscriber.entitlements ?? {};

    // --- 配置查找逻辑 ---
    let subscriptionConfig = null;

    // 将查找逻辑封装成函数
    function findConfig() {
        const sources = [
            { config: listua, identifier: $request.headers['User-Agent'] || $request.headers['user-agent'] },
            { config: bundle, identifier: $request.headers['X-Client-Bundle-ID'] || $request.headers['x-client-bundle-id'] }
        ];

        for (const source of sources) {
            for (const key in source.config) {
                if (new RegExp(`^${key}`, `i`).test(source.identifier)) {
                    return source.config[key]; // 找到配置后立即返回
                }
            }
        }
        return null; // 未找到任何配置
    }

    subscriptionConfig = findConfig();

    // --- 数据准备 ---
    let entitlementData;
    let entitlementId = 'pro'; // 默认 entitlement 名称
    let productId = 'com.chxm1023.pro'; // 默认产品 ID

    const permanentSubscription = {
        "purchase_date": "2023-09-09T09:09:09Z",
        "expires_date": "2099-09-09T09:09:09Z"
    };
    const lifetimeSubscription = {
        "purchase_date": "2023-09-09T09:09:09Z"
    };

    if (subscriptionConfig) {
        // 如果找到了配置，则使用配置中的值
        entitlementId = subscriptionConfig.name;
        productId = subscriptionConfig.id;
        // 使用 includes() 判断，更清晰
        if (subscriptionConfig.cm.includes('sja')) {
            entitlementData = permanentSubscription;
        } else if (subscriptionConfig.cm.includes('sjb')) {
            entitlementData = lifetimeSubscription;
        }
    } else {
        // 未找到配置，使用默认的永久订阅
        entitlementData = permanentSubscription;
        console.log('未找到特定应用配置，已应用通用解锁规则。');
    }

    // --- 创建订阅信息 ---
    const subscriptionDetails = {
        ...entitlementData, // 包含 purchase_date 和 expires_date (如果存在)
        "Author": "chxm1023",
        "original_purchase_date": "2023-09-09T09:09:09Z",
        "store_transaction_id": "4900066666666666",
        "period_type": "trial",
        "store": "app_store",
        "ownership_type": "PURCHASED"
    };

    // --- 应用修改 ---
    // 封装一个函数来添加订阅和权益，避免代码重复
    function applySubscription(entId, prodId) {
        if (!entId || !prodId || !entitlementData) return;

        // 添加权益 (Entitlement)
        responseBody.subscriber.entitlements[entId] = {
            ...entitlementData,
            product_identifier: prodId
        };

        // 添加订阅 (Subscription)
        responseBody.subscriber.subscriptions[prodId] = subscriptionDetails;
    }

    // 应用主订阅
    applySubscription(entitlementId, productId);

    // 如果配置中存在备用订阅信息，也一并应用
    if (subscriptionConfig && subscriptionConfig.nameb && subscriptionConfig.idb) {
        applySubscription(subscriptionConfig.nameb, subscriptionConfig.idb);
    }
    
    responseObject.body = JSON.stringify(responseBody);
    console.log('已成功修改订阅信息！');
} else {
    console.log('响应体中未找到subscriber数据，保持原样返回');
    responseObject.body = response.body;
}

$done(responseObject);