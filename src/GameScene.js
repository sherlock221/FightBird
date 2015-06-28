
var GamedLayer = cc.Layer.extend({
    sprite:null,

    //当前剩余的时间
    _countdown : 0,

    //当前分数
    _scoreValue : 0,

    //剩余时间控件
    _timeSprite : null,
    //当前分数控件
    _countdownSprite : null,

    //小鸟矩形选择区
    _birdRect : [
        cc.rect(0,0,320,240),
        cc.rect(320,0,320,240),
        cc.rect(320,240,320,240),
        cc.rect(0,240,320,240),
    ],

    _birdLayer : null,
    _birdList : null,

    _touchEvent : null,

    ctor:function () {

        this._super();

        var size = cc.winSize;

        //设置游戏背景
        var background  = new cc.Sprite(res.scene_jpg);
        background.setPosition(size.width/2,size.height/2);
        this.addChild(background);

        //初始化剩余时间 和 分数
        this._countdown = 1000 * 10;
        this._scoreValue = 0;
        this._birdList = [];

        //创建一个显示分数的lable 在屏幕左上角
        this._countdownSprite = new cc.LabelTTF("0","",50);
        //设置锚点左上角
        this._countdownSprite.setAnchorPoint(0,1);
        this._countdownSprite.setPosition(10,size.height-10);
        this.addChild(this._countdownSprite);


        //创建一个显示倒计时label 在屏幕右上角
        this._timeSprite = new cc.LabelTTF(Math.floor(this._countdown/1000)+"'","",50);
        //设置锚点右上角
        this._timeSprite.setAnchorPoint(1,1);
        this._timeSprite.setPosition(size.width -10,size.height -10);
        this.addChild(this._timeSprite);



         //小鸟层
         this._birdLayer = new cc.Node();
         this.addChild(this._birdLayer);

        return true;
    },

    //进入
    onEnter : function(){
        this._super();

        this._step = 0;

        //启动update函数
        this.scheduleUpdate();

        //添加鼠标事件
        var _this = this;
        this._touchEvent = new cc.EventListener.create({
            //单点触摸
            event : cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches : true,
            onTouchBegan: function(touch,event){

                //新创建的小鸟在数组后面 屏幕上面 所以我们这里要逆向遍历
                for(var i = _this._birdList.length -1; i >=0 ; i--){
                    var bird = _this._birdList[i];
                    //获得小鸟的碰撞包围盒
                    var box =bird.getBoundingBox();

                    //检测碰撞是否生效 box 和 当前点击的位置
                    if(cc.rectContainsRect(box,touch.getLocation())){
                        //当前分数＋1
                        _this._scoreValue += 1;
                        _this._countdownSprite.setString(_this._scoreValue);

                        //移除bird bird死亡
                        _this._birdList.splice(i,1);
                         bird.removeFromParent();

                        break;

                    }
                }

                //如果为true 继续检测后面事件 进行事件传播
                return false;
            }

        });


        //加入到事件管理器中
        cc.eventManager.addListener(this._touchEvent,this);

    },

    //退出
    onExit : function(){
        this._super();

        //关闭update函数
        this.unscheduleUpdate();

        //移除事件
         cc.eventManager.removeListener(this._touchEvent);
    },

    //更新(每一帧会执行)
    update : function(dt){
        this._step++;

        var size = cc.winSize;

        //倒计时功能
        this._countdown -= dt * 1000;

        cc.log(this._countdown);
        this._timeSprite.setString(Math.floor(this._countdown/1000)+"'");

        if(this._countdown <=0){
            //结束游戏
            var gameOver = new OverScene();
            //替换成结束场景
            cc.director.replaceScene(gameOver);

            //传递分数给结束场景
            gameOver.setScore(this._scoreValue);
        }

        //每间隔20次update创建一只小鸟
        if(this._step % 20 ==0){

            //随机数生产小鸟的方向  1:右  －1:左
            var way = Math.random() > 0.5 ? 1: -1;

            var startPos = cc.p(way == 1 ?size.width:0,  Math.random() * size.height);
            var endPos  = cc.p(way == 1 ? 0 : size.width, Math.random() * size.height);

            //取得1-3的时间
            var time = Math.floor(1+Math.random()*3);

            var bird = new cc.Sprite(res.bird_png,this._birdRect[Math.floor(Math.random() * 4)]);

            //缩放下
            bird.setScale(-0.5*way,0.5);
            bird.setAnchorPoint(cc.p(0,0.5));
            bird.setPosition(startPos);

             this._birdLayer.addChild(bird);
             this._birdList.push(bird);

                      var _this = this;
                     //小鸟动起来
                     bird.runAction(new cc.Sequence(
                        new cc.MoveTo(time,endPos),
                        //结束执行
                        new cc.CallFunc(function(){

                            for(var i=0; i <_this._birdList.length;i++){
                                var b = _this._birdList[i];
                                //删除掉当前的小鸟
                                if(b == bird){
                                     //指定位置删除 删除数量
                                    _this._birdList.splice(i,1);
                                    //从layer中移除
                                    bird.removeFromParent();
                                    break;
                                }
                            }

                        })
                     ));

        }


        }
    });


var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GamedLayer();
        this.addChild(layer);
    }
});

