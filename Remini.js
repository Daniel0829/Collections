[rewrite_local]
^https?:\/\/.*\.oracle\.bendingspoonsapps\.com\/v\d\/(users\/.+|purchases\/verify) url script-response-body https://raw.githubusercontent.com/chxm1023/Rewrite/main/bending.js

[mitm]
hostname = *.oracle.bendingspoonsapps.com

*************************************/


var chxm1023 = JSON.parse($response.body);
const headers = $request.headers;
const ua = headers['User-Agent'] || headers['user-agent'];

const list = {
  'remini': { id: "com.bigwinepot.nwdn.international.1y_p99_99_ft_pro" },  //Remini-人工智能修图
};

for (const key in list) {
  if (new RegExp(`^${key}`, `i`).test(ua)) {
    chxm1023["me"]["active_subscriptions_ids"] = [list[key].id];
    chxm1023["me"]["active_bundle_subscriptions"] = [{
      "expiry": "2099-09-09T09:09:09+00:00",
      "product_id": list[key].id,
      "features": ["unlock"]
    }];
    chxm1023["settings"]["__identity__"]["expiration"] = "2099-09-09T09:09:09+00:00";
    break;
  }
}

$done({body: JSON.stringify(chxm1023)});
