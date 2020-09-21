# xj-follow

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```
###scss 的一些基础用法
```
@mixin defaultBgImage{
  background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center;
    background-color:#fff;
}

@mixin font($size: 12px) {
  font-size: $size;
}
//  使用 
.class {
  @include defaultBgImage;
  @include font(16px);
}

// 继承
.font{
    font-size:14px;
    height: 16px;
}
.footer{
    @extend .font;
    border-width: 2px;
}

// 函数
@function fn($data){
   @return $data/10 + px;
}

div{
   font-size: fn(80);
}

// 循环
@for $i from 1 through 3 {
  .item-#{$i} { width: 2em * $i; }
}
//输出
.item-1 {
  width: 2em;
}
.item-2 {
  width: 4em;
}
.item-3 {
  width: 6em;
}
```