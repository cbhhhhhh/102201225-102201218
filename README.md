### <font color="Salmon">使用说明</font>

#### 1.环境准备

（1）**安装微信开发者工具**：

- 前往[微信开发者工具官网下载页面](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)下载并安装适用于您操作系统的版本（稳定版）。

（2）**注册微信小程序账号**：

- 如果还没有微信小程序账号，请前往[微信公众平台](https://mp.weixin.qq.com/)注册。

- 记录下自己的**AppID**

  https://img2024.cnblogs.com/blog/3512981/202410/3512981-20241010182422845-1407653917.png

（3）**获取项目代码**：

​		**打开终端**

- 克隆项目仓库（需根据提示安装相关依赖）：

  ```javascript
  git clone https://github.com/cbhhhhhh/102201225-102201218.git
  ```

- 进入项目目录：

  ```javascript
  cd 102201225-102201218 
  ```

#### 2.配置云开发

（1）**登录微信开发者工具**：

- 打开微信开发者工具，使用您的微信小程序账号登录。

（2）**导入项目**：

- 在微信开发者工具中，选择“导入项目”，选择项目根文件夹。
  导入时请输入自己的AppID（小程序ID）

  https://img2024.cnblogs.com/blog/3512981/202410/3512981-20241010182335880-1539481323.png

 （3）**配置云开发**

- 在微信开发者工具中，在编辑器内依次右键云函数点击第二个上传并部署（云端安装依赖）

https://img2024.cnblogs.com/blog/3512981/202410/3512981-20241010183630306-2034217787.png

- 初始化云函数和数据库，确保 `cloudfunctions` 和数据库集合已正确配置。

#### 3.运行项目

（1）启动开发环境

- 在微信开发者工具中，点击上方菜单栏中“工具”的“**编译**”按钮，启动项目的本地开发环境。

（2）预览小程序

- 打开**模拟器**，即可预览项目。
- **微信小程序开发者的系统可能加载缓慢或者未连上网络而出现报错，请耐心等待加载**。

#### 4.测试功能

 **（1）用户管理**

- 注册自己的账号和密码（账号可选择填写学号）
- 输入账号密码登录（可尝试错误的账号和密码、或空）

- 前往“我的”完善个人信息（可点击头像上传个人头像）
- 在“我的”页面可选择登出账号

 **（2）参与项目**

- 点击加入项目浏览项目列表
- 点击感兴趣的项目，查看项目详情
- 点击报名参加项目

  **（3）发布项目**

- 首页点击发布项目
- 填写发起项目的详情（项目名称、项目类型、关键词、人才数量、项目描述、项目展示），点击创建，即可在项目列表浏览到自己发布的项目
- 点击自己刚创建的项目，可查看项目详情（包括项目创立时间）

  **（4）项目管理**

- 点击“我的项目”可查看个人创建项目
- 可进行对应项目的修改或删除

  **（5）项目搜索与筛选**

- 在搜索框里输入项目名称或关键字即可搜索感兴趣的项目
- 点击筛选，可根据项目类别和关键词进行项目筛选

  **（6）聊天功能**

- 点击消息，输入账号进行好友添加（输入项目成员账号，即可实现项目内成员沟通）
- 在我的消息里点击聊天框选择好友进行交流
