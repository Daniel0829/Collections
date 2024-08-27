/*************************************

项目名称：OtterLife
更新日期：2024-08-06

**************************************

[rewrite_local]
^https?:\/\/otter-api\.codefuture\.top\/v\d\/user\/current url script-response-body https://raw.githubusercontent.com/Daniel0829/Collections/Scripts/OtterLife.js

[mitm]
hostname = otter-api.codefuture.top

*************************************/


var Daniel0829 = JSON.parse($response.body);

Daniel0829.data = {
  ...Daniel0829.data,
  "vipType" : "lifetime",
  "vipDeadline" : "2099-09-09T09:09:09.000Z",
  "isVip" : true
};

$done({body : JSON.stringify(Daniel0829)});
