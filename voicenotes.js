/*
gpt4o 权限

[rewrite_local]

https://api.voicenotes.com/api/auth/me url script-response-body https://raw.githubusercontent.com/Daniel0829/Collections/main/voicenotes.js

[mitm]
hostname = api.voicenotes.com
*/
var body = JSON.parse($response.body);
body.isVip = true;
$done({body: JSON.stringify(body)});
