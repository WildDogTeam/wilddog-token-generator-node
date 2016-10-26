var jws = require('jws'),
    UID_REGEXP = /$[A-Za-z0-9:\\-]{1,64}^/;

var createTokenV0 = function (data, opts, secret) {
    var claims = {};
    claims['iat'] = Math.round(new Date().getTime() / 1000);
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
    claims['v'] = WilddogTokenGenerator.VERSION_V0;
    claims['d'] = data;
    return jws.sign({
        header: {
            typ: 'JWT',
            alg: 'HS256'
        },
        payload: claims,
        secret: secret
    });
};

var createTokenV1 = function (data, opts, secret) {
    if (!(typeof data.uid === 'string') || UID_REGEXP.test(data.uid)) {
        throw new Error('Param data must have a \'uid\' property which can only contain letters, numbers or \'-\'. Uid\'s length should between 1 and 64.');
    }

    var payload = {
        v: WilddogTokenGenerator.VERSION_V1,
        iat: Math.round(new Date().getTime() / 1000),
        uid: ''
    };

    var options = opts || {};

    for (var o in options) {
        switch (o) {
            case 'expires':
            case 'notBefore':
                var code = (o === 'notBefore' ? 'nbf' : 'exp');
                if (opts[o] instanceof Date) {
                    payload[code] = Math.round(opts[o].getTime() / 1000);
                } else {
                    payload[code] = opts[o];
                }
                break;
            case 'admin':
                payload['admin'] = opts[o];
                break;
            case 'debug':
                payload['debug'] = opts[o];
                break;
            case 'iat':
                payload['iat'] = opts[o];
                break;
            default: {
                throw new Error('createToken: unrecognized \"' + o + '\" option');
            }
        }
    }

    if (!payload.admin) {
        payload.uid = data.uid;
        payload.claims = data;
        delete payload.claims.uid;
    }

    return jws.sign({
        header: {
            typ: 'JWT',
            alg: 'HS256'
        },
        payload: payload,
        secret: secret
    });

};

var WilddogTokenGenerator = function (secret) {
    this.secret = secret;
};

WilddogTokenGenerator.VERSION_V0 = 0;
WilddogTokenGenerator.VERSION_V1 = 1;

WilddogTokenGenerator.prototype.createToken = function (data, opts, ver) {

    var version = ver == undefined ? 1 : parseInt(ver);

    if (isNaN(version) || version < 0 || version > 1) {
        throw new Error('Invalid token version, only 0 and 1 are accept. ');
    }
    switch (version) {
        case WilddogTokenGenerator.VERSION_V0:
            return createTokenV0(data, opts, this.secret);
        case WilddogTokenGenerator.VERSION_V1:
        default:
            return createTokenV1(data, opts, this.secret);

    }
};

module.exports = WilddogTokenGenerator;
