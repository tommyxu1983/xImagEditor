
[project home page](https://tommyxu1983.github.io/xImagEditor/)

[transform example](https://tommyxu1983.github.io/xImagEditor/examples/src/Transform.html) [成千上百的图形，实现鼠标响应](https://tommyxu1983.github.io/xImagEditor/examples/thounsands.html)

# XIE -- eXpress Image Editor

## 项目由来

公司潜在的一个项目，需要使用图片处理库，试用了几个市面上的图片处理库，基本能提供项目的需求。但对 10mb
以上的图片进行 位移，旋转， 放大，加入图形合成进图片，窗宽窗位等功能,不是非常满意。 再加上本人对 H5 canvas想要深入研究一下，
于是用空余时间借鉴各大H5 canvas库，写了单为图像处理的工具集，目前已经被用在一个工业检测项目上，效果还不错。



## 项目概要
XIE 命名空间，为 eXpress Image Editor 缩写。 所有东西的入口都是从这里进入。 XIE为了保持代码纯净，模块加载没有依赖第三方库. 全部使用 js
放大模式 [tight augmentation](http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html) 来完成模块之间的依赖。

多谢 [KineticJS](https://github.com/ericdrowell/KineticJS) , ECharts 的 2-d 基础库 [ZRender](https://github.com/ecomfe/zrender)
对我的启发,在这里你会看到很多他们的影子。XIE功能比较简单,大多数功能其他库基本都有实现或类似，无奈拾人牙慧，加入自己的理解，写出了XIE。
只能说XIE更专注于图像处理,解决了canvas在某些复杂应用场景下的性能问题。可以当成您的canvas项目的基础库，或可以当成一个
canvas深入了解的项目来使用，如果有兴趣的同学想要了解以下内容，我会一一分享:

    * 在一张图上有成千上百图形+图片，利用多层canvas 搭建多图层，提高性能重绘性能。
    * 利用双层buffer canvas(视图层，点击层)来快速寻找图形,提高图形搜索性能。
    * 如何让图形有事件机制，相应鼠标，键盘事件。
    * 避免 位移，旋转， 放大等重绘消耗过多资源 模拟游览器冒泡机制。

也欢迎提出意见，完善本项目.我在代码里插了很多 `//todo`待改进和将要添加的功能, 有兴趣的可以一起参与

## 如何使用 XIE

### 直接使用(游览器 <script src="..."></script> )
 1. clone 到本地 `git https://github.com/tommyxu1983/xImagEditor.git `,  或 下载 zip 并解压缩

 2. 请到 项目目录 `dist` 拷贝 __XIEGlobal.js__  或压缩版本 __XXXX.min.js__ 到你想要的路径

### npm 安装
```bash
$ npm install x_i_e --save-dev
```

```javascript
//import {Stage, Rect, Layer} from "x_i_e";
var XIE = require('x_i_e');

var Stage = XIE.Stage, Rect =XIE.Rect, Layer = XIE.Layer;

var stageWrapper = document.getElementById('XIEWrapper');
var stage = new Stage({
    wrapper: stageWrapper, // 可以ID或dom
     width: 900,
     height: 600,
}); //创建新舞台
var layer = new Layer(); //创建新图层

var rectangular = new Rect({   //创建新矩形
    x: 200,
    y: 200,
    width: 200,
    height: 100,
    stroke:'orange',
    draggable: true
});

stage.add(layer);
layer.add(rectangular);

stage.draw();
```


## 编译 测试 XIE

### 编译
1. 命令行输入：（请预先安装 node npm）

```bash
$ cd xImgEditor
$ npm install
```

2. 在 `gulpfile.js` 里有个变量 files, 在里面添加或删除你想要的模块，如果删除掉 __基础模块__ 会报错

3. 命令行输入：
```bash
$ gulp build
```


### 测试
1. 单测 （接口）
2. performance （未完成）
```bash
$ npm run test_APIs
```

## XIE 主要模块 和 模块之间的关系

### 项目结构

    |-- dist  //--> 发布版单文件，压缩版
    |-- examples  //--> 示例
    |-- src  //--> 源码
    |    |-- container   //--> Layer, group , Stage 基于Container.js
    |    |-- filters    //--> 图片处理滤镜
    |    |-- Grey16Bit  //--> 16位灰度 -- 8位灰度
    |    |-- helps      //--> 基础帮助类
    |    `-- shape      //--> 预定义图形 基于Shape.js
    |-- Animation.js    //--> 未完成
    |-- Container.js
    |-- Drag.js            //--> Drag&Drop   Drag&Enlarge
    |-- Element.js        // --> 基石模块
    |-- Shape.js          //--> 所有shape类 都基于此模块
    |-- Storage.js        //--> 全局 cache
    |-- Transformable.js  //--> 位移，旋转，放大，的矩阵运算
    |-- XCanvas.js        //--> H5 canvas 封装
    |-- XContex.js        //--> H5 canvas.getContex("2d") 封装
    |-- XIE.js            //--> XIE 全局 namespace， 测试用
    `-- XIEGlobal.js      //--> XIE 全局 namespace， 打包用





### 常用模块

* Stage（舞台）： 最高级容器，所有layer(图层)都装载在这个容器里。
* Layer（图层）： 容器，装载 shape, group。
封装canvas模块， 会在这里以实例的形式寄存. Stage,Group，Shape 的绘制( draw()接口 ). 都会通过 Layer 到达 canvas 进行绘制.
* Group (图形组)： 容器, 装载 shape`（未实现）`。 比如，你要在舞台上抓起一个人物的身体，但头,腿，手臂要一起跟着移动。
* Shape （图形，图片）：来实现具体某个图形和图片，比如，圆形，三角形，矩形，图片。

### XIE的模块大致可以分为下面几种：
* 通用模块 `./helpers` 图像处理无太大的关系：
    * Utils.js: 各种 isXX系列判断, extend, inherit prototype, hex & rgb 转换, 游览器坐标与stage坐标转换。
    * Guid.js: 产生 global uid
    * EventProxy.js: 事件代理机制
    * Matrix.js:  矩阵运算
    * Keycode.js: 键盘键的代码。

* 基础模块
    * XIE.js:  XIE命名空间,是库的global，XIE的所有全局变量在这里，其他所有类都在XIE命名空间上扩展。
    * Transform.js: 记录元素在位置改变的状态。位移，中心改变，放大，旋转，都会在这里被记录。 主要提供 canvas.context.transform 所需要的数据
    * Element.js: 基石模块，Container(layer, stage), Shape(Circle, Rect, Image) 都会基础于此模块。Element 类继承于 Transform & EventProxy
    * Shape.js: 是所有图形（包括image)的基础类。Shape类继承了 Element, 有了如何画绘制图形抽象方法，具体实现在子类里。这下面这些都基于 Shape，
        - Rect.js
        - Circle.js
        - Image.js
        - CustomShape.js

    * Container.js: 容器模块,继承于 Element. 这下面这些都基于 Container模块
        - Layer.js 基于 container
        - Stage.js 基于 container
    * Filter: 给图片处理的一些 滤镜: 通过 Element 里 addFilters 方法 加入滤镜。
        - Brighten.js
        - ContrastTo.js
        - Convert16To8.js (游览器显示不了8bit图像。用来转换16bit -> 8bit, 医学光片里的窗宽窗位会用到此类。）

## 原理讲解 （稍后承上）

 1. 在一张图上有成千上百图形+图片，利用多层canvas 搭建多图层，提高性能重绘性能。

 2. 利用双层buffer canvas(视图层，点击层)来快速寻找图形,提高图形搜索性能。

 3. 如何让图形有事件机制，相应鼠标，键盘事件。

 4. 避免 位移，旋转， 放大等重绘消耗过多资源 模拟游览器冒泡机制。

## 给几个 canvas 教程的传送门
有可能被墙， 请自行架梯。

[Improving HTML5 Canvas Performance](https://www.html5rocks.com/en/tutorials/canvas/performance/)

[HTML5 Canvas Tutorials by Patrick Horgan](http://www.dbp-consulting.com/tutorials/canvas/index.html)

[Implementing Layers in HTML5 Canvas](http://stackoverflow.com/questions/4422907/implementing-layers-in-html5-canvas)

[A Gentle Introduction to Making HTML5 Canvas Interactive](https://simonsarris.com/making-html5-canvas-useful/)

[Canvas Hit Detection](http://tschaub.net/blog/2011/03/31/canvas-hit-detection.html)

[几种常见计算机图像处理操作的原理及canvas实现](http://xsk.tehon.org/den/index.php/category/tech/image-process-using-canvas.html)

[HTML5 canvas transform与矩阵](http://www.cnblogs.com/hemei/p/4252817.html)

在用 imageData 接口请小心，这可能造成性能问题，注意使用
[Pixel manipulation with canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas)