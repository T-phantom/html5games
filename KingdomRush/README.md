### 皇家保卫战（塔防游戏）  
#### 问题汇总：
1. 事件监听的时候并不能准确的辨别出是哪个位置出发了事件。只能根据坐标判断是否在矩形内。
如果需要按钮一类的准确事件，请使用`cc.Menu`来指定按钮才可以。仅仅监听图片做按钮是不能做到的。  
2. clippingNode 该方法暂时没有弄明白，进度条实用的是  cc.Sprite 下的 setTextureRect(cc.rect(x, y, width, height)) 来创造裁剪后的区域。通过每次修改`setTextureRect`来初步切割，这样感觉不好，希望能有改进方案。
3. Asyncload.js 需要重构，根据2做修改，代码耦合度太高。
4. MonsterBase.js 基类是小怪们的父类, 这里有个问题就是，怪物的状态机要引入，不能就这么放着。独立完成一个状态机后期，重构这部分代码。  