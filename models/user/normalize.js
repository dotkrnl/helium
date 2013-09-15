
/**
 * A tool to check registration info
 */

// callback(dest, err)

String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
};

exports.normalizer = {

    fullname : function(origin, cb) {
        origin = origin.trim();
        var regNonEng = /^[^\u0000-\u007F]+$/;
        //var english= /^[A-Za-z ]+$/; 
        if (regNonEng.test(origin)) return cb(origin);
        else return cb('', '姓名格式错误');
    },

    username: function(origin, cb) {
        origin = origin.trim();    
        var regMobile = /^1[358]\d{9}$/;
        var regPhone = /^[28]\d{7}$/;
        var regArea = /^0595[28]\d{7}$/;
        if (regMobile.test(origin) ||
                regPhone.test(origin) ||
                regArea.test(origin))
            return cb(origin);
        else return cb('', '手机号码格式错误');
    },

    gender: function(origin, cb) {
        okList = {'male': true, 'female': true, 'other': true};
        if (origin in okList) return cb(origin);
        else return cb('', '乱构造 HTTP 请求是不对的，亲~');
    },

    "class": function(origin, cb) {
        origin = origin.trim();
        // 懒得检查班级信息了，先相信你们吧
        var regBegCK  = /^[ckCK]/;
        var regIncChi = /[^\u0000-\u007F]/;
        if (regBegCK.test(origin) || regIncChi.test(origin))
            return cb(origin);
        else return cb('', '班级信息格式错误');
    },

    email: function(origin, cb) {
        origin = origin.trim();
        if (!origin.length) return cb('');
        var regEmail = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
        if (regEmail.test(origin)) return cb(origin);
        else return cb('', '邮箱地址格式错误');
    },
    
    password: function(origin, cb) {
        if (!origin.length) return cb('', '请输入密码用于后续登录');
        else return cb(origin);
    },
    
    want: function(origin, cb) {
        var okList = {'none': true, 'leader': true, 'organize': true,
                  'publicize': true, 'contact': true};
        if (origin in okList) return cb(origin);
        else return cb('', '乱构造 HTTP 请求是不对的，亲~');
    },

    advice: function(origin, cb) {
        return cb(origin);
    },
}

exports.normalizeAll = function(origin, cb) {
    var errors = [];
    var result = {};
    genProcessGet = function(key) {
        return function(dest, err) {
            result[key] = dest;
            if (err) errors.push(err);
        }
    }
    Object.keys(exports.normalizer).forEach(
        function(key) {
            if (typeof(origin[key]) == 'undefined')
                origin[key] = '';
            exports.normalizer[key](origin[key], genProcessGet(key));
        }
    );
    if (errors.length)
        cb(result, errors);
    else cb(result);
}
