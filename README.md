# wilddog-token-generator-node
Json Web Token generator for Wilddog

## 关于安全

token generator 需要你的 Wilddog 超级密钥（secret），所以你需要在受信任的服务器上生成 token 。安全起见，不要在任何客户端生成 token 。

## 安装
```
npm install wilddog-token-generator
```


## 使用

```js
var WilddogTokenGenerator = require("wilddog-token-generator");
var tokenGenerator = new WilddogTokenGenerator("<YOUR-WILDDOG-SECRET>");
var token = tokenGenerator.createToken({uid: "12234445", foo:"bar"}, {iat:1471347140});

```

### createToken(claims, options[, version])

#### `claims` :

customToken 的自定义数据，参考 [野狗官方文档-生成 Custom Token](https://docs.wilddog.com/guide/auth/server/server.html#生成-Custom-Token) 。


此版本生成器的 claims 参数必须包含 `uid` 属性，建议传入可以标明用户身份的唯一值。在转换为 Wilddog ID Token 后，`claims.uid` 会在 Wilddog Auth 系统中作为 Wilddog ID 。

`uid` 属性只能为包含大小写字母、数字、':'和'-'且不超过64字符的字符串（$[A-Za-z0-9:\\-]{1,64}^）;

#### `options` 可用属性:

* expires: 过期时间
* notBefore: 同上
* admin: true | false 是否管理员
* iat: token 生成时间，默认当前时间git 

#### `version`:

待生成 customToken 的版本，有 `WilddogTokenGenerator.VERSION_V0` 与 `WilddogTokenGenerator.VERSION_V1` 两个取值。默认取值为 `VERSION_V1` 。使用 `VERSION_V0` 可以生成旧版 customToken ，但会导致调用 server sdk 转换为 Wilddog ID Token 时报错。

## 认证

Token在服务器生成后需要通知给客户端，由客户端通过Wilddog SDK中的API来执行认证操作。

* JavaScript: `authWithCustomToken()`
* Objective-C / Swift: `authWithCustomToken:withCompletionBlock:`
* Java: `authWithCustomToken()`
* REST: `auth`
