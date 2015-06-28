
var OverLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {

        this._super();

        var size = cc.winSize;

        //设置游戏背景
        var background  = new cc.Sprite(res.scene_jpg);
        background.setPosition(size.width/2,size.height/2);
        this.addChild(background);

        //创建一个继续按钮
        var conBtn = new ccui.Button(res.continue_png);
          conBtn.setPosition(size.width/2,size.height/2);
              this.addChild(conBtn);

        //创建一个分数lable
        this._score = new cc.LabelTTF("0","",50);
        this._score.setPosition(size.width/2,size.height/2-100);


        //添加继续事件
       conBtn.addClickEventListener(function(){
                cc.director.popScene();
       });
        this.addChild(this._score);

        return true;
    },
    setScore : function(value){
        this._score.setString(value);
    }
});

var OverScene = cc.Scene.extend({
    _layer : null,
    ctor : function(){
            this._super();
        this._layer = new OverLayer();
             this.addChild(this._layer);
    },
    onEnter:function () {
        this._super();
    },
      setScore : function(value){
            this._layer.setScore(value);
        }
});

