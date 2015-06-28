
var MainLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {

        this._super();


        var size = cc.winSize;

        //设置游戏背景
        var background  = new cc.Sprite(res.scene_jpg);
        background.setPosition(size.width/2,size.height/2);


        //创建一个开始按钮
        var startBtn = new ccui.Button(res.start_png);
          startBtn.setPosition(size.width/2,size.height/2);

        //点击进入游戏场景
        startBtn.addClickEventListener(function(){
                cc.director.pushScene(new GameScene());

        });

       //添加到屏幕上
       this.addChild(background);
       this.addChild(startBtn);


       return true;
    }
});

var MainScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MainLayer();
        this.addChild(layer);
    }
});

