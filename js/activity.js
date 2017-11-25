//设置分享链接
var shareUrl = '';
if (window.location.hash.indexOf('ActId') != -1) {
    shareUrl = window.location.origin + window.location.pathname;
} else {
    shareUrl = window.location.origin + window.location.pathname + '?ActId=0&rotue_mark=h5';
};

//获取member_id和key
var member_id = getString('member_id'),
    key = getString('key');

//判断是否在app内
if (checkApp()) {
    loadShare('1', shareUrl);
    $(document).on('touchend', '#todetail', function(event) {
        var teacherUrl = window.location.origin + window.location.pathname + "?ActId=63&id=89";
        if (key == undefined || key == '' || key == '(null)' || key == 'null') { //未登录
            if (window.third) {
                window.third.isLogin('0');
            }
        } else {
            resTeacher();
            count();
            window.App.actJump(teacherUrl);
        }
    });
} else {
    wechat_share();
    $(document).on('touchend', '#todetail', function(event) {
        window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.mrstock.mobile';
    });
};

/**
 * [is_weixn description]检查当前是否在微信浏览器内
 * @return {Boolean} [description]
 */
function is_weixn() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
};

/**
 * [resTeacher description]关注老师
 * @return {[type]} [description]
 */
function resTeacher() {
    $.ajax({
        url: 'https://u.api.guxiansheng.cn/index.php?c=favorites&a=post',
        data: {
            object_id: 127,
            type: 3,
            member_id: member_id,
            key: key
        },
        type: 'get',
        dataType: 'jsonp',
        success: function(data) {
            console.log(data);
        }
    })
};

/**
 * [count description]活动统计
 * @return {[type]} [description]
 */
function count() {
    $.ajax({
        url: 'https://content.api.guxiansheng.cn/index.php?c=btnclick&a=combine_act&v=2.0.1',
        data: {
            btn_id: 4,
            member_id: member_id
        },
        type: 'get',
        dataType: 'jsonp',
        success: function(data) {
            console.log(data);
        }
    })
};
/**
 * [checkApp description] 检测是否在APP环境中
 * @return {[type]} [description]
 */
function checkApp() {
    return window.App ? true : false;
};

/**
 * [loadShare description] 加载APP分享
 * @return {[type]} [description]
 */
function loadShare(code, shareUrl) {
    window.App.appShare(code, '首席投顾实盘记录大公开', '首席投顾操盘实录，翻倍牛股就要这样炒！选股、买卖点、仓位控制，股池在手，赚钱不愁。', 'https://static.guxiansheng.cn/goods_ico/logo.jpg', shareUrl, 'newStockPool', '42');
};

/**
 * 获取url当中的参数
 * @param name
 * @returns {*}
 */
function getString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return null;
};

/**
 * [wechatShare description] 微信分享配置
 * @param  {[type]} shareUrl [description]
 * @return {[type]}          [description]
 */
function wechat_share() {
    var apiUrl = 'http://content.api.guxiansheng.cn/index.php?c=jssdk&a=get_sign_package&route_mark=h5';
    if (window.location.protocol === 'https:') {
        apiUrl = 'https://content.api.guxiansheng.cn/index.php?c=jssdk&a=get_sign_package&route_mark=h5';
    }
    $.ajax({
        url: apiUrl,
        type: "get",
        data: {
            clion_url: encodeURIComponent(window.location.href.split('#')[0]) //encodeURIComponent(window.location.origin + '/' + window.location.hash)
        },
        dataType: "jsonp",
        success: function(data) {
            if (data.code == 1) {
                var config = data.data;
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: config.appId, // 必填，appID公众号的唯一标识
                    timestamp: config.timestamp, // 必填，生成签名的时间戳
                    nonceStr: config.noncestr, // 必填，生成签名的随机串
                    signature: config.signature, // 必填，签名，见附录1
                    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2，如果出现permiss deline错误，就是因为这里没有配置相关接口原因
                });
                wx.ready(function() {
                    wx.onMenuShareTimeline({ //分享到朋友圈
                        title: '首席投顾实盘记录大公开', // 分享标题
                        desc: '首席投顾操盘实录，翻倍牛股就要这样炒！选股、买卖点、仓位控制，股池在手，赚钱不愁。', // 
                        link: shareUrl,
                        imgUrl: 'https://static.guxiansheng.cn/goods_ico/logo.jpg', // 分享图标
                        success: function() {
                            // Isshow('.share_global','none')
                        },
                        cancel: function() {
                            // Isshow('.share_global','none')
                        }
                    });
                    wx.onMenuShareAppMessage({ //分享给朋友
                        title: '首席投顾实盘记录大公开', // 分享标题
                        desc: '首席投顾操盘实录，翻倍牛股就要这样炒！选股、买卖点、仓位控制，股池在手，赚钱不愁。', // 分享描述
                        link: shareUrl, //分享链接
                        imgUrl: 'https://static.guxiansheng.cn/goods_ico/logo.jpg', // 分享图标
                        success: function() {
                            // Isshow('.share_global','none')
                        },
                        cancel: function() {
                            // Isshow('.share_global','none')
                        }
                    });
                    wx.onMenuShareQQ({ //分享到QQ
                        title: '首席投顾实盘记录大公开', // 分享标题
                        desc: '首席投顾操盘实录，翻倍牛股就要这样炒！选股、买卖点、仓位控制，股池在手，赚钱不愁。', // 分享描述
                        link: shareUrl, //分享链接
                        imgUrl: 'https://static.guxiansheng.cn/goods_ico/logo.jpg', // 分享图标
                        success: function() {
                            // Isshow('.share_global','none')
                        },
                        cancel: function() {
                            // Isshow('.share_global','none')
                        }
                    });
                    wx.onMenuShareQZone({ //分享到QQ空间
                        title: '首席投顾实盘记录大公开', // 分享标题
                        desc: '首席投顾操盘实录，翻倍牛股就要这样炒！选股、买卖点、仓位控制，股池在手，赚钱不愁。', // 分享描述
                        link: shareUrl, //分享链接
                        imgUrl: 'https://static.guxiansheng.cn/goods_ico/logo.jpg', // 分享图标
                        success: function() {
                            // Isshow('.share_global','none')
                        },
                        cancel: function() {
                            // Isshow('.share_global','none')
                        }
                    });
                });
                wx.error(function(res) {

                });
            } else {
                alert(data.message);
            }
        },
        error: function(xrh) {
            alert('服务器繁忙！');
        }
    });
};
