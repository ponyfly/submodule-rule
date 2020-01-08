## mainModule与submodule开发指南
### 指南
准备工作
1. `yarn add @sd-test/submodule-rule -D`
2. package.json中添加两条命令：
```
"script": {
    "preserve": "submodule-rule-cli --dev $branch",
    "prebuild": "submodule-rule-cli --prod",
}
```
#### 本地
```
graph TB
A(mainModule)-->B{使用submodule指定分支}
B --> | master | C(yarn serve)
B --> | issue#dev |D(branch=issue#dev yarn serve)
```
#### 远程
+ 测试环境zelda
1. submodule
```
graph TB
A(submodule)-->B(issue#subdev merge to zelda)
```
2. mainModule
```
graph TB
A(mainModule)-->B(issue#dev merge to zelda,可忽略subModule的提交)
```
注意：测试环境对应的submodule永远zelda分支上最新的一条commit
+ 线上master
1. submodule
```
graph TB
A(submodule)-->B(issue#subdev merge to master)
```
2. mainModule
```
graph TB
A(mainModule)-->B(issue#dev merge to master)
```
注意：线上环境对应的submodule永远是mainSubmodule中保存的subModule的commit（不一定是新的）
