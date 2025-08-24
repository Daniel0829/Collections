/*************************************

项目名称：Revenuecat系列解锁合集
更新日期：2025-08-24
脚本作者：@Daniel

**************************************

[rewrite_local]
^https:\/\/api\.(revenuecat|rc-backup)\.com\/.+\/(receipts$|subscribers\/?(.*?)*$) url script-response-body https://raw.githubusercontent.com/Daniel0829/Collections/refs/heads/Scripts/Revenuecat-deepseek.js
^https:\/\/api\.(revenuecat|rc-backup)\.com\/.+\/(receipts$|subscribers\/?(.*?)*$) url script-request-header https://raw.githubusercontent.com/Daniel0829/Collections/refs/heads/Scripts/Revenuecat-deepseek.js

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
const bundleApps = {
    'com.valo.reader.vip2.forever': { name: 'vip', id: 'com.valo.reader.vip2.forever', model: 'sjb' }, //读不舍手
    'com.trainfitness.Train': { name: 'Pro', id: 'TrainAnnualSubscription', model: 'sja' }, //TrainFitness 健身追踪器
};

// 通过 User-Agent 模糊匹配 App
const uaApps = {
    'SnapWords': { name: 'Pro access', id: 'com.happyplan.snapwords.premium.subscription.yearly', model: 'sja' }, //CapWords-拍物品学语言
    'Stress': { name: 'StressWatch Pro', id: 'stress_membership_lifetime', model: 'sjb' }, //StressWatch压力自测提醒
    'Unfold': { name: 'REDUCED_PRO_YEARLY', id: 'UNFOLD_PRO_YEARLY', model: 'sja' }, //Unfold-视频和照片编辑器
    'Binsoo': { name: 'vibe', id: 'annual', model: 'sja' }, //Binsoo
    'Photoooo': { name: 'lifetime', id: 'canoe_28_rnb_forever', model: 'sjb' }, //Phorase-专业AI消除助手
    'No%20Fusion': { name: 'LivePhoto', id: 'com.grey.nofusion.livephoto', model: 'sjb' }, //NoFusion-相机
    'FujiLifeStyle': { name: 'FUJIStyle Pro(Year)', id: 'FujiStyle2024003', model: 'sja' }, //FUJISTYLE-富士色彩配方
    'Currency': { name: 'plus', id: 'com.jeffreygrossman.currencyapp.iap.plus', model: 'sja' }, //Currency-汇率查询
    'Airmail': { name: 'Airmail Premium', id: 'Airmail_iOS_Yearly_P', model: 'sja' }, //Airmail-邮箱管理
    'Joy': { name: 'pro', id: 'com.indiegoodies.Agile.lifetime2', model: 'sjb' }, //Joy AI
    'AnkiPro': { name: 'Premium', id: 'com.ankipro.app.lifetime', model: 'sjb' }, //AnkiPro
    'Tide%20Guide': { name: 'Tides+', id: 'TideGuidePro_Lifetime_Family_149.99', model: 'sjb' }, //Tide Guide潮汐
    'Gear': { name: 'subscription', id: 'com.gear.app.yearly', model: 'sja' }, //Gear浏览器
    'PM4': { name: 'pro', id: 'pm4_pro_1y_2w0', model: 'sja' }, //Obscura
    'Project%20Delta': { name: 'rc_entitlement_obscura_ultra', id: 'com.benricemccarthy.obscura4.obscura_ultra_sub_annual', model: 'sja' }, //Obscura
    'Rec': { name: 'rec.paid', id: 'rec.paid.onetime', model: 'sjb' }, //Rec相机
    'Darkroom': { name: 'iapkit_darkroomplus', id: 'co.bergen.Darkroom.product.forever.everything', model: 'sjb' }, //Darkroom-照片/视频编辑
    'WhiteCloud': { name: 'allaccess', id: 'wc_pro_1y', model: 'sja' }, //白云天气
    'Spark': { name: 'premium', id: 'spark_6999_1y_1w0', nameb: 'premium', idb: 'spark_openai_tokens_4xt', model: 'sja' }, //Spark_Mail-邮箱管理
    'Pillow': { name: 'premium', id: 'com.neybox.pillow.premium.year.v2', model: 'sja' }, //Pillow-睡眠周期跟踪
    'VSCO': { name: 'pro', id: 'vscopro_global_5999_annual_7D_free', model: 'sja' } //VSCO-照片与视频编辑编辑
};

/**
 * 在本地应用列表中查找匹配的应用配置
 * @param {string} ua - User Agent字符串
 * @param {string} bundleId - Bundle ID字符串
 * @returns {Object|null} 匹配的应用配置或null
 */
function findMatchingApp(ua, bundleId) {
    // 优先检查Bundle ID精确匹配
    if (bundleId && bundleApps[bundleId]) {
        return { ...bundleApps[bundleId], source: 'bundle' };
    }
    
    // 检查User-Agent模糊匹配
    for (const [pattern, appConfig] of Object.entries(uaApps)) {
        const escapedPattern = escapeRegExp(pattern);
        if (new RegExp(escapedPattern, 'i').test(ua)) {
            return { ...appConfig, source: 'ua' };
        }
    }
    
    return null;
}

/**
 * 更新订阅信息
 * @param {Object} dataObj - 要修改的响应数据对象
 * @param {string} entitlementName - 授权名称
 * @param {string} productId - 产品ID
 * @param {string} modelType - 订阅模型类型 ('sja' 或 'sjb')
 * @param {string} secondaryProductId - 第二个产品ID (可选)
 * @param {string} secondaryEntitlementName - 第二个授权名称 (可选)
 */
function updateEntitlements(dataObj, entitlementName, productId, modelType, secondaryProductId, secondaryEntitlementName) {
    const subscriptionData = subscriptionModels[modelType] || subscriptionModels.sja;
    
    // 确保必要的对象结构存在
    dataObj.subscriber = dataObj.subscriber || {};
    dataObj.subscriber.entitlements = dataObj.subscriber.entitlements || {};
    dataObj.subscriber.subscriptions = dataObj.subscriber.subscriptions || {};
    
    // 处理主订阅
    dataObj.subscriber.entitlements[entitlementName] = {
        ...subscriptionData,
        product_identifier: productId
    };
    
    dataObj.subscriber.subscriptions[productId] = { ...subscriptionData };
    
    // 处理第二个订阅（如Spark应用）
    if (secondaryProductId && secondaryEntitlementName) {
        dataObj.subscriber.entitlements[secondaryEntitlementName] = {
            ...subscriptionData,
            product_identifier: secondaryProductId
        };
        
        dataObj.subscriber.subscriptions[secondaryProductId] = { ...subscriptionData };
    }
}

/**
 * 最终的备用方案，使用一个通用的ID
 * @param {Object} dataObj - 要修改的响应数据对象
 */
function applyFallbackSolution(dataObj) {
    console.log('执行备用方案...');
    updateEntitlements(dataObj, 'pro', 'com.ddm1023.pro.lifetime', 'sjb');
}

// 主执行逻辑
function main() {
    const headers = $request.headers;
    const ua = headers['User-Agent'] || headers['user-agent'];
    const bundleId = headers['X-Client-Bundle-ID'] || headers['x-client-bundle-id'];
    
    // 情况1: 检查是否是不允许MITM的应用
    if (isForbiddenAppPresent(ua, $request?.body)) {
        console.log("⛔️检测到禁止 MITM 的 APP，脚本停止运行！");
        $done({});
        return;
    }
    
    // 情况2: 请求阶段处理（修改请求头）
    if (typeof $response === 'undefined') {
        const newHeaders = { ...headers };
        delete newHeaders['If-None-Match'];
        delete newHeaders['if-none-match'];
        $done({ headers: newHeaders });
        return;
    }
    
    // 情况3: 过滤掉一些非关键的API请求
    if (/(offerings|attributes|adservices_attribution)/.test($request.url)) {
        console.log('拦截到 offerings/attributes 请求，已跳过。');
        $done({});
        return;
    }
    
    // 情况4: 响应阶段，处理订阅逻辑
    try {
        // 安全地解析响应体
        let responseData = {};
        if ($response.body) {
            try {
                responseData = JSON.parse($response.body);
            } catch (e) {
                console.log("解析响应体JSON失败，使用空对象。错误: " + e);
                responseData = {};
            }
        }
        
        // 在本地列表中查找匹配的应用
        const matchedApp = findMatchingApp(ua, bundleId);
        
        if (matchedApp) {
            console.log(`本地列表匹配成功 (来源: ${matchedApp.source})。`);
            updateEntitlements(
                responseData,
                matchedApp.name,
                matchedApp.id,
                matchedApp.model,
                matchedApp.idb,
                matchedApp.nameb
            );
        } else {
            console.log('本地列表未匹配，应用备用方案...');
            applyFallbackSolution(responseData);
        }
        
        $done({ body: JSON.stringify(responseData) });
    } catch (error) {
        console.log('处理响应时发生错误: ' + error);
        $done({});
    }
}

// 启动主逻辑
main();
