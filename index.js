var TOKEN_VERSION = 0;
var jws = require('jws');
var WilddogTokenGenerator = function (secret) {
    this.secret = secret;

}
module.exports = WilddogTokenGenerator;
WilddogTokenGenerator.prototype.createToken = function (data, opts) {
    var claims = {}
    claims['iat'] =  Math.round(new Date().getTime() / 1000);
    var options = opts || {};
    for (var o in options) {
        switch (o) {
            case 'expires':
            case 'notBefore':
                var code = (o === 'notBefore' ? 'nbf' : 'exp');
                if (opts[o] instanceof Date) {
                    claims[code] = Math.round(opts[o].getTime() / 1000);
                } else {
                    claims[code] = opts[o];
                }
                break;
            case 'admin':
                claims['admin'] = opts[o];
                break;
            case 'debug':
                claims['debug'] = opts[o];
                break;
            case 'simulate':
                claims['simulate'] = opts[o];
                break;
            case 'iat':
                claims['iat'] = opts[o];
                break;
            default: {
                throw new Error('createToken: unrecognized \"' + o + '\" option');
            }
        }
    }
    claims['v'] = TOKEN_VERSION;
    claims['d'] = data;
    return jws.sign({
        header:{
            typ:'JWT',
            alg:'HS256'
        },
        payload:claims,
        secret:this.secret
    })
}
