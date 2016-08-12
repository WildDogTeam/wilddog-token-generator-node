# wilddog-token-generator-node
Json Web Token generator for Wilddog

## 关于安全

token generator 需要你的Wilddog超级密钥(secret)，所以你需要在收信人的服务器上生成token。安全起见，不要在任何客户端生成token。

## 安装
```
npm install wilddog-token-generator
```


## 使用

```js
var WilddogTokenGenerator = require("wilddog-token-generator");
var tokenGenerator = new WilddogTokenGenerator("<YOUR-WILDDOG-SECRET>");
var token = tokenGenerator.createToken({uid: "12234445",admin:true}, {expires: new Date().getTime() + 100000000});

```

你传入createToken的属性能在规则表达式的`auth`变量中访问到。其他属性可选，但必须包含一个`uid`属性。

## 认证

Token在服务器生成后需要通知给客户端，由客户端通过Wilddog SDK中的API来执行认证操作。

* JavaScript: `authWithCustomToken()`
* Objective-C / Swift: `authWithCustomToken:withCompletionBlock:`
* Java: `authWithCustomToken()`
* REST: `auth`
