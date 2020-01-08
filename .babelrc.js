module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        // "debug": true, // debug，编译的时候 console
        "useBuiltIns": false, // 是否开启自动支持 polyfill
        "modules": false, // 模块使用 es modules ，不使用 commonJS 规范
        // "targets": "> 0.25%, last 2 versions, iOS >= 8, Android >= 4.4, not dead"
      }
    ]
  ]
}
