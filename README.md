### Echo-music

> Vue2.0移动端音乐App练习，音乐数据来自QQ音乐

**感谢慕课网的vue学习练习，让自己从头到尾对vue的使用有了更深的了解和使用**

#### 效果截图

![](C:\Users\zal\Documents\Tencent Files\541904577\FileRecv\MobileFile\Screenshot_20171008-174101.png)

![Screenshot_20171008-174116](C:\Users\zal\Documents\Tencent Files\541904577\FileRecv\MobileFile\Screenshot_20171008-174116.png)

![Screenshot_20171008-174121](C:\Users\zal\Documents\Tencent Files\541904577\FileRecv\MobileFile\Screenshot_20171008-174121.png)

![Screenshot_20171008-174125](C:\Users\zal\Documents\Tencent Files\541904577\FileRecv\MobileFile\Screenshot_20171008-174125.png)

![Screenshot_20171008-174138](C:\Users\zal\Documents\Tencent Files\541904577\FileRecv\MobileFile\Screenshot_20171008-174138.png)

![Screenshot_20171008-174204](C:\Users\zal\Documents\Tencent Files\541904577\FileRecv\MobileFile\Screenshot_20171008-174204.png)

![Screenshot_20171008-174222](C:\Users\zal\Documents\Tencent Files\541904577\FileRecv\MobileFile\Screenshot_20171008-174222.png)

#### 技术栈

* 使用了rem来进行各个屏幕的适配，图标使用了css Sprite方式减少请求次数，以及部分地方用到flex布局


* 使用Vue全家桶，vue-cli构建项目结构，路由和状态管理
* 数据获取通过QQ音乐官网查找后，使用jsonp 部分数据要使用axios进行跨域来访问得到数据
* vux，vue-lazyload，better-scroll等第3方库

安装与运行

````
git clone https://github.com/supercat55/Echo-music.git

cd Echo-music

# install dependencies 安装依赖
npm install && yarn install

# serve with hot reload at localhost:7777 
npm run dev

# build for production with minification
npm run build

````

#### 后续想法和需要注意的地方

* 最近播放列表
* 使用网易云api来搭建，获取方法比较简单，推荐一个apihttps://binaryify.github.io/NeteaseCloudMusicApi/#/ 不需要后端跨域就可以直接获取
* 因为使用了rem 在Pc端通过手机模式访问，会有部分图标错位，打包后dist下直接打开index.html 使用了后端axios跨域访问数据会显示不出来
* 需要需要安装依赖，建议使用yarn或者淘宝镜像，速度会比较快

**有问题欢迎交流**

