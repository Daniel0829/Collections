/*************************************

项目名称：Revenuecat系列解锁合集
更新日期：2025-02-22
脚本作者：@ddm1023
电报频道：https://t.me/ddm1023
使用声明：⚠️仅供参考，🈲转载与售卖！

**************************************

[rewrite_local]
^https:\/\/api\.(revenuecat|rc-backup)\.com\/.+\/(receipts$|subscribers\/?(.*?)*$) url script-response-body https://raw.githubusercontent.com/Daniel0829/Collections/refs/heads/Scripts/Revenuecat-edit.js
^https:\/\/api\.(revenuecat|rc-backup)\.com\/.+\/(receipts$|subscribers\/?(.*?)*$) url script-request-header https://raw.githubusercontent.com/Daniel0829/Collections/refs/heads/Scripts/Revenuecat-edit.js

[mitm]
hostname = api.revenuecat.com, api.rc-backup.com

*************************************/


let obj = {}, ddm = JSON.parse(typeof $response != "undefined" && $response.body || "{}");

const headers = $request.headers, ua = headers['User-Agent'] || headers['user-agent'], bundle_id = headers['X-Client-Bundle-ID'] || headers['x-client-bundle-id'];

const forbiddenApps = ['Rond', 'Fileball', 'APTV', 'Forward'];
if (forbiddenApps.some(app => (ua && ua.includes(app)) || ($request.body && $request.body.includes(app)))) {
  console.log("⛔️检测到禁止 MITM 的 APP，脚本停止运行！");
  $done({});
}

const bundle = {
  'com.exoplanet.chatme': { name: 'premium', id: 'chatme_premium_year_trial', cm: 'sja' },  //ChatMe
  'com.reku.Counter': { name: 'plus', id: 'com.reku.counter.plus.lifetime', cm: 'sjb' },  //Counter-计步器
  'moonbox.co.il.grow': { name: 'pro', id: 'moonbox.co.il.grow.lifetime.offer', cm: 'sjb' },  //植物识别-PlantID
};

const listua = {
  'becoming': { name: 'Strength Pro', id: 'strength_membership_lifetime', cm: 'sjb' },  //练就
  'Binsoo': { name: 'vibe', id: 'annual', cm: 'sja' },  //Binsoo
  'Translate%20-%20Talk%20Translator': { name: 'Premium', id: 'premiumAnnually', cm: 'sja' },  //AITranslator-翻译器
  'Authenticator': { name: 'premium', id: '2fa_standalone_lifetime', cm: 'sja' },  //Authenticator-密码管理
  'ChatBot': { name: 'chatbot_annual', id: 'chatbot_annual', cm: 'sja' },  //ChatBot-AIChat
  'Photoooo': { name: 'lifetime', id: 'canoe_28_rnb_forever', cm: 'sjb' },  //Phorase-专业AI消除助手
  'VibeCamera': { name: 'forever', id: 'vibe_pro_forever', cm: 'sjb' },  //VIBECAM-相机
  'No%20Fusion': { name: 'LivePhoto', id: 'com.grey.nofusion.livephoto', cm: 'sjb' },  //NoFusion-相机
  'Themy': { name: 'fonts_premium', id: 'lifetime', cm: 'sjb' },  //Fonts-微信字体
  'FujiLifeStyle': { name: 'FUJIStyle Pro(Year)', id: 'FujiStyle2024003', cm: 'sja' },  //FUJISTYLE-富士色彩配方
  'CharingCrossRoad': { name: 'ready_pro', id: 'ready_pro_50_1y', cm: 'sja' },  //读否-稍后阅读
  'ig-bookmarker': { name: 'entitlement', id: 'lifetimeID', cm: 'sjb' },  //instDown-ins下载工具
  'TQBrowser': { name: 'pro_lt', id: 'com.tk.client.lifetime', cm: 'sjb' },  //Teak浏览器
  'AI%C2%A0Chat': { name: 'AI Plus', id: 'ai_plus_gpt_yearly', cm: 'sja' },  //AIChat
  'Currency': { name: 'plus', id: 'com.jeffreygrossman.currencyapp.iap.plus', cm: 'sja' },  //Currency-汇率查询
  'ShellBean': { name: 'pro', id: 'com.ningle.shellbean.iap.forever', cm: 'sjb' },  //ShellBean-SSH终端服/Linux监控
  'Airmail': { name: 'Airmail Premium', id: 'Airmail_iOS_Yearly_P', cm: 'sja' },  //Airmail-邮箱管理
  'timetrack.io': { name: 'atimelogger-premium-plus', id: 'ttio_premium_plus', cm: 'sjb' },  //aTimeloggerPro-时间记录
  'ShellBoxKit': { name: 'ssh_pro', id: 'ShellBoxKit.Year', cm: 'sja' },  //CareServer-服务器监控
  'IDM': { name: 'premium', id: 'sub_yearly_idm', cm: 'sja' },  //IDM-下载
  'Shapy': { name: 'premium', id: 'com.blake.femalefitness.subscription.yearly', cm: 'sja' },  //Shapy-健身
  'Chat%E7%BB%83%E5%8F%A3%E8%AF%AD': { name: 'Pro access', id: 'com.tech.AiSpeak.All', cm: 'sjb' },  //Chat练口语
  'Calflow': { name: 'pro', id: 'kike.calflow.pro.lifetime', cm: 'sjb' },  //Calflow
  'SmartAIChat': { name: 'Premium', id: 'sc_3999_1y', cm: 'sja' },  //SmartAI
  'AIChat': { name: 'AI Plus', id: 'ai_plus_yearly', cm: 'sja' },  //AIChat
  'AnkiPro': { name: 'Premium', id: 'com.ankipro.app.lifetime', cm: 'sjb' },  //AnkiPro
  'Gear': { name: 'subscription', id: 'com.gear.app.yearly', cm: 'sja' },  //Gear浏览器
  'server_bee': { name: 'Pro', id: 'pro_45_lifetime', cm: 'sjb' },  //serverbee终端监控管理
  'ProCam': { name: 'pro', id: 'pro_lifetime', cm: 'sjb' },  //ProCam相机
  'PM4': { name: 'pro', id: 'pm4_pro_1y_2w0', cm: 'sja' },  //Obscura
  'Project%20Delta': { name: 'rc_entitlement_obscura_ultra', id: 'com.benricemccarthy.obscura4.obscura_ultra_sub_annual', cm: 'sja' },  //Obscura
  'Context_iOS': { name: 'Context Pro', id: 'ctx_sub_1y_sspai_preorder_angel', cm: 'sja' },  //Context
  'Rec': { name: 'rec.paid', id: 'rec.paid.onetime', cm: 'sjb' },  //Rec相机
  'Photon': { name: 'photon.paid', id: 'photon.paid.onetime', cm: 'sjb' },  //Photon相机
  'Stress': { name: 'StressWatch Pro', id: 'stress_membership_lifetime', cm: 'sjb' },  //StressWatch压力自测提醒
  'Darkroom': { name: 'co.bergen.Darkroom.entitlement.allToolsAndFilters', id: 'co.bergen.Darkroom.product.forever.everything', cm: 'sja' },  //Darkroom-照片/视频编辑
  'WhiteCloud': { name: 'allaccess', id: 'wc_pro_1y', cm: 'sja' },  //白云天气
  'Spark': { name: 'premium', id: 'spark_6999_1y_1w0', nameb: 'premium', idb: 'spark_openai_tokens_4xt', cm: 'sja' },  //Spark_Mail-邮箱管理
  'NotePlan': { name: 'premium', id: 'co.noteplan.subscription.personal.annual', cm: 'sja' },  //NotePlan
  'UTC': { name: 'Entitlement.Pro', id: 'tech.miidii.MDClock.subscription.month', cm: 'sja' },  //花样文字
  'Anybox': { name: 'pro', id: 'cc.anybox.Anybox.annual', cm: 'sja' },  //Anybox-跨平台书签管理
  'ScannerPro': { name: 'plus', id: 'com.ddm1024.premium.yearly', cm: 'sja' },  //Scanner Pro-文档扫描
  'Pillow': { name: 'premium', id: 'com.neybox.pillow.premium.year.v2', cm: 'sja' },  //Pillow-睡眠周期跟踪
  '1Blocker': { name: 'premium', id: 'blocker.ios.iap.lifetime', cm: 'sjb' },  //1Blocker-广告拦截
  'VSCO': { name: 'pro', id: 'vscopro_global_5999_annual_7D_free', cm: 'sja' }  //VSCO-照片与视频编辑编辑
};

// 原始的字符串数组和偏移量 (保留，用于参考)
// var __0x122ff5 = ['\x57\x55\x33\x44\x74\x4d\x4b\x6e', ... ];

// 模拟 _0x61fc 函数 (简化版，只做解码，不做 RC4)
function decodeString(index) {
    index = index - 0x0; // 偏移量
    var encodedString = __0x122ff5[index];

    // atob 解码 (Base64)
    function atob_sim(str) {
        return Buffer.from(str, 'base64').toString('utf8');
    }
    
    // 简单的 URL 解码
      function decodeURIComponent_sim(str)
      {
        return str.replace(/%([0-9A-Fa-f]{2})/g, function(match, p1) {
                return String.fromCharCode(parseInt(p1, 16));
            });
      }

    var decodedString = atob_sim(encodedString);
      decodedString = decodeURIComponent_sim(decodedString);

    return decodedString;
}

// 替代原代码中的 _0x61fc 调用
if (typeof $rocket !== 'undefined') { // 原代码: typeof $rocket !== _0x61fc('0x0', '\x46\x72\x5e\x54')
    function getBoxJSValue(key) {
        try {
            if (typeof $persistentStore !== 'undefined' && typeof $persistentStore.read === 'function') {
                const value = $persistentStore.read(key);
                console.log('getBoxJSValue: key=' + key + ', value=' + value);
                return value;
            } else if (typeof $prefs !== 'undefined' && typeof $prefs.valueForKey === 'function') {
                const value = $prefs.valueForKey(key);
                console.log('getBoxJSValue: key=' + key + ', value=' + value);
                return value;
            } else {
                console.log('getBoxJSValue: No persistent storage available');
            }
        } catch (error) {
            console.log('getBoxJSValue: Error: ' + error.message);
        }
        return null;
    }

    const scriptSwitch = getBoxJSValue('scriptSwitch');
    const isScriptEnabled = scriptSwitch === 'on' || scriptSwitch === true;
    console.log('scriptSwitch: ' + scriptSwitch);

    if (!isScriptEnabled) {
        console.log('Script is disabled, exiting.');
        $notification.post('Script Disabled', '', 'Please enable the script in BoxJS settings.');
        $done();
    }

    const finalize = function (responseBody = null) {
        if (responseBody) {
            obj['body'] = JSON.stringify(responseBody);
            console.log("finalize: modifying response body");
        }
        $done(obj);
    };

    if (typeof $response !== 'undefined') {
        delete headers['Content-Encoding'];
        delete headers['content-encoding'];
        obj['headers'] = headers;
        finalize();
    } else {
        if (/(offerings|attributes|adservices_attribution)/.test($request.url)) {
            console.log('Matched URL pattern, stopping.');
            $done({});  // 直接结束请求
        }
		//定义时间格式的模板
        const standardTimeFormat = { 'purchase_date': '2023-09-09T09:09:09Z', 'expires_date': '9999-09-09T09:09:09Z' };
        const basicTimeFormat = { 'original_purchase_date': '2023-09-09T09:09:09Z', 'is_sandbox': false, 'store_transaction_id': '00000000000000', 'store': 'app_store', 'ownership_type': 'PURCHASED' };
        let name, nameb, ids, idb, data;
        let anchor = false, localMatched = false;


        for (const src of [listua, bundle]) {
            for (const i in src) {
                const test = src === listua ? ua : bundle_id;
                if (new RegExp('^' + i, 'i').test(test)) {
                    if (src[i]['cm'].includes('premium')) {
                        data = standardTimeFormat;
                        anchor = true;
                    } else if (src[i]['cm'].includes('pro'))
					{
						data = { 'purchase_date': '2023-09-09T09:09:09Z' };
                        anchor = true;
					}
					else if (src[i]['cm'].includes('plus'))
					{
                        data = standardTimeFormat;
                        anchor = false;
					}

                    ids = src[i]['id'];
                    name = src[i]['name'] || '';
                    idb = src[i]['idb'];
                    nameb = src[i]['nameb'];
                    localMatched = true;
                    break;
                }
            }
            if (localMatched) break;
        }

        const updateEntitlements = function (name = '', ids = '', remove = false) {
            const displayName = name || '';  // 使用传入的name，如果没有则为空字符串
			const productId = ids;
            const commonFields =  Object.assign({}, standardTimeFormat, basicTimeFormat); // 复制 timea 和 timeb
            //const commonFields = { ...standardTimeFormat, ...basicTimeFormat };

            if (!anchor) {
                ddm['entitlements']['all'] = Object.assign(ddm['entitlements']['all'] || {}, { [productId]: [Object.assign({}, { 'id': displayName }, commonFields)] });
                ddm['entitlements']['active'] = Object.assign(ddm['entitlements']['active'] || {}, { [productId]: commonFields });
            }

            if (!remove && name) { //remove不存在 或者 为false
                ddm['subscriber']['subscriptions'] = Object.assign(ddm['subscriber']['subscriptions'] || {}, { [displayName]: Object.assign({}, commonFields, { 'product_identifier': productId }) });
            }
            ddm['subscriber']['entitlements'] = Object.assign(ddm['subscriber']['entitlements'] || {}, { [productId]: commonFields });

            if (idb && nameb && !remove)
			{
                ddm['entitlements']['all'] = Object.assign(ddm['entitlements']['all'] , { [nameb]: Object.assign({}, commonFields, { 'product_identifier': idb }) });
                ddm['subscriber']['entitlements'] = Object.assign(ddm['subscriber']['entitlements'] , { [idb]: commonFields });
            }
        };


        const fetchProductEntitlements = function () {
            const requestOptions = { 'url': $request.url, 'headers': headers };
            const requestMethod = 'GET';

            const handleResponse = function (resolve, reject) {
                return function (error, response, data) {

                    if (error) {
                        reject('fetchProductEntitlements Error: ' + error);
                    } else if (response.status !== 200) {

                            reject('fetchProductEntitlements HTTP Status Code: ' + response.status);

                    } else {
                        resolve(Object.assign(response, { 'body': data }));
                    }
                };
            };


            if (typeof $task !== 'undefined') {
                $task.fetch(requestOptions).then(response => {
                    if (response.statusCode !== 200)
					{
                        console.log("fetchProductEntitlements error", err);
                        fallbackSolution();
                    }
					else
					{
                         resolve(Object.assign(response, { 'body': data }));
                    }
                }, err => {
                        console.log("fetchProductEntitlements error", err);
                        fallbackSolution();
                });
            } else if (typeof $httpClient !== 'undefined') {
                $httpClient.get(requestOptions, (error, response, data) => {
                    if (error) {
                        reject('fetchProductEntitlements $httpClient Error: ' + error);
                    } else if (response.status !== 200) {

                            resolve(Object.assign(response, { 'body': data }));

                    } else {
                        reject('fetchProductEntitlements $httpClient HTTP Status Code: ' + response.status);
                    }
                });
            } else if (typeof $http !== 'undefined') {
                $http.get(requestOptions, (error, response, data) => {
                    if (error)
					{
                        reject('fetchProductEntitlements $http Error: ' + error);
                    }
					else if (response.status === 200)
					{
						const responseBody = JSON.parse(response['body']);
                        if(responseBody && responseBody['entitlements'] && Object.keys(responseBody['entitlements']).length > 0)
						{
                            return response;
                        }
						else
						{
                            return handleResponse('GET');
                        }
                    }
					else
					{
                        reject('fetchProductEntitlements $http Status Code: ' + response.status);
                    }
                });
            } else {
                reject("fetchProductEntitlements: No HTTP client available.");
            }
        };


        const fallbackSolution = function () {
			console.log("fallbackSolution");
            updateEntitlements('','', true);
            finalize(ddm);
        };

        if (localMatched) {
             console.log("Using Local Data");
            updateEntitlements();
            finalize(ddm);
        } else {
             console.log("Using Remote Data");
            fetchProductEntitlements()
            .then(response =>
			{
                const body = JSON.parse(response['body']);
                const entitlements = body['entitlements'] || {};

                if (!entitlements || Object.keys(entitlements).length === 0)
				{
					console.log("Using fallbackSolution 1");
                    fallbackSolution();
                    return;
                }

                for (const [productId, entitlement] of Object.entries(entitlements))
				{
                    const entitlementId = entitlement['id'];
                    const features = entitlement['features'] || [];

                    if (features.length === 0) {
                        updateEntitlements('', entitlementId, true);
                    }
                    else
					{
                         for (const feature of features) {
                        	updateEntitlements(feature, entitlementId, false);
                    	}
                    }
                }
                finalize(ddm);
            })
			.catch(err => {
                console.log("fetchProductEntitlements catch error", err);
                fallbackSolution();
            });
        }
    }
}

(function (global, encode_version, useless) {  // 传入 window, encode_version，以及一个没用的变量
	useless = 'al';
    try {
		useless += 'ert';
		encode_version = "jsjiami.com.v5";
        if (!(typeof encode_version !== 'string' && encode_version === 'jsjiami.com.v5'))
		{
            global[useless](decodeString('0x162') + decodeString('0x163'));   // 原始: global[useless]("\u5220\u9664"+decodeString('0x163'));
        }
    }
	catch (error)
	{
        global[useless](decodeString('0x162')); // global['alert']("\u5220\u9664");  // 使用 atob_sim 解码
    }
}(window));
