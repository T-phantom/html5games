/**
 * 用于异步加载页面资源的单例类
 * initWidthResources 用于设置请求资源。参数：
 *          res ： Array
 * _cb为请求资源完毕后的回调函数
 */
var AsyncLayer = cc.Layer.extend({
    _loadbgl : null,
    _loadbgr : null,
    _loadl : null,
    _loadr : null,
    _loadbartop : null,
    _loadbarbg : null,
    _cb : null,               //回调函数
    _res : [],
    _loadLength : 0,
    _loadHeight : 0,
    ctor : function() {
        this._super();
        this._loadbgl = new cc.Sprite(res.loadbg);
        this._loadbgr = new cc.Sprite(res.loadbg);    //右侧图片
        this._loadl = new cc.Sprite(res.loadl);
        this._loadr = new cc.Sprite(res.loadr);
        this._loadbartop = new cc.Sprite(res.loadbartop);
        this._loadbarbg = new cc.Sprite(res.loadbarbg);        //加载loading场景所需全部资源
        this._loadLength = this._loadbartop.width;            //进度条长度
        this._loadHeight = this._loadbartop.height;
        this.init();
    },
    init : function() {
        var centerX = cc.winSize.width / 2,
            centerY = cc.winSize.height / 2,
            bgWidth = this._loadbgl.width,
            bgHeight = this._loadbgl.height;

        this._loadbgl.setAnchorPoint(1, 0.5);
        this._loadbgl.attr({
            "x" : 0,
            "y" : centerY
        });

        this._loadbgr.setAnchorPoint(1, 0.5);
        this._loadbgr.attr({
            "scaleX" : -1,
            "x" : cc.winSize.width,
            "y" : centerY
        });

        this._loadl.attr({
            "x" : bgWidth / 2,
            "y" : bgHeight / 2
        });
        this._loadr.attr({
            "x" : bgWidth / 2,
            "y" : bgHeight / 2,
            "scaleX" : -1                                        //轴对称
        });

        var bglAction = cc.moveTo(0.6, cc.p(centerX, centerY)).easing(cc.easeInOut(2)),
            bgrAction = cc.moveTo(0.6, cc.p(centerX, centerY)).easing(cc.easeInOut(2));


        this._loadbgl.addChild(this._loadl);
        this._loadbgr.addChild(this._loadr);

        this._loadbgr.runAction(bgrAction);
        this._loadbgl.runAction(bglAction);

        this.addChild(this._loadbgr);
        this.addChild(this._loadbgl);
    },
    initWithResources : function(res) {
        var centerX = cc.winSize.width / 2,
            self = this,
            loadPosY = 100,
            loadBarBorder = 8,                                //8像素边框
            loadBarHeight = this._loadbarbg.height;
        self._res = res;                                      //设置资源数组

        this._loadbarbg.attr({
            "x" : centerX,
            "y" : loadPosY,
            "opacity" : 0
        });

        this._loadbartop.setAnchorPoint(0, 0.5);

        this._loadbartop.attr({
            "x" : loadBarBorder,
            "y" : loadBarHeight / 2,                       //loading最上边
            "opacity" : 0
        });


        this._loadbartop.setTextureRect(cc.rect(0, 0, 0, this._loadHeight));

        this._loadbarbg.addChild(this._loadbartop);

        this._loadbartop.runAction(cc.sequence(
            cc.delayTime(0.8),
            cc.fadeIn(0.1, 255)
        ));

        var barfadeIn = cc.sequence(
            cc.delayTime(0.8),
            cc.fadeIn(0.1, 255),
            cc.callFunc(self._startLoading, self)         //调用加载函数
        ).easing(cc.easeInOut(2));

        this._loadbarbg.runAction(barfadeIn);
        this.addChild(this._loadbarbg);
    },
    _startLoading : function() {
        console.log("数据开始加载");
        var self = this,
            res = self._res;
        cc.loader.load(res,
            function (result, count, loadedCount) {
                var percent = (loadedCount / count * 100) | 0;
                percent = Math.min(percent, 100) / 100;
                self._loadbartop.setTextureRect(cc.rect(0, 0, self._loadLength * percent, self._loadHeight));
                console.log(self._loadLength * percent);

            }, function () {
                self._loadbartop.setTextureRect(cc.rect(0, 0, self._loadLength, self._loadHeight));
                console.log("数据加载完毕,开始调用回调函数");
                if (self._cb) {
                    self._cb.call();
                }
            });
    },
    showLoadBar : function() {

    },
    hideLoadBar : function() {

    }
});

//单例模式,用于加载某些资源
var loadAsync = (function() {
    var asyncLayer = null;
    return function(res) {
        if(asyncLayer === null) {
            asyncLayer = new AsyncLayer();   //创建单例
        }
        return asyncLayer;                   //返回该单例
    }
})();