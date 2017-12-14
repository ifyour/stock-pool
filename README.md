# 移动端h5推广活动

涉及的技术点有: 

- META 标签的设置
- 移动端响应适配
- 微信分享 SDK 相关配置
- APP内调用第三方方法

### META 标签的设置
具体参考 `index.html` 内的代码.


### 移动端响应式布局
采用了两种方案进行渐进增强: rem 和媒体查询, 优先使用 rem.

1. rem , 相关代码如下:

```css
html {
    font-size: calc(100vw / 37.5 * 2) !important;
}
```

简单解析: 

- 以 750px 设计稿作为基准，根节点设置 `font-size` 为 20px ,只考虑 DPR 为 2 的情况. 为了计算简便, 可以使用 Sass 的 mixin 自动求出 rem 单位, 看下面代码: 

```scss
@mixin rem($property, $values, $support-ie: false, $base: 40px) {
  // some code...
}
```

`$base` 是我们的基准字体大小, 可以看到, 之前在自己定义 html 的 `font-size` 的时候, 计算的结果是 `20px`, 由于是以 iPhone6 的设计稿宽度 750px 作为尺寸参照, 测量尺寸实际是实际需求的 2 倍, 所以这里需要除掉.

像这样用:

```scss
// common.scss
@import "../../node_modules/mixins-sass/src/mixins";

// 设置 margin-top, 60px 即设计稿上的实际尺寸, 会自动转成 60/40 = 1.5rem
.box {
    @include rem(margin-top, 60px);
}
```

- 37.5 是 iPhone6 默认宽度375像素的1/10, 这是自己定义的, 主要用于计算 rem, 可以使用 [mixin](https://github.com/huanz/mixins/#rem) 方便计算出对应的 Rem .


2. 媒体查询. 使用 [scss](https://gist.github.com/ifyour/bf60c8f66d8816d84c9226a1c00788fe) 的一个循环, 匹配出市面上常见手机屏幕的尺寸, 并计算好 html 的字体大小. 再使用 rem 进行计算宽高等.

相关代码如下: 

```scss
$baseWidth: 375px;
$baseFont: 20px;
html {
  font-size: $baseFont;
  outline: 0;
  font-family: sans-serif;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-text-size-adjust: 100%;
  -o-text-size-adjust: 100%;
}
$bps: 320px, 335px, 345px, 360px, 375px, 400px, 414px, 430px, 454px, 460px, 480px, 500px, 520px, 540px, 560px, 580px, 600px, 620px, 640px, 680px, 700px, 720px, 735px, 750px, 780px,800px, 840px, 900px, 960px;
@each $i in $bps {
    $font: $i  /  $baseWidth  *  $baseFont;
    @media only screen and (min-width: $i){
        html {
          font-size: $font !important;
        }
      }
}
```

### 微信分享 SDK 相关配置
具体参考 `active.js` 内的代码.