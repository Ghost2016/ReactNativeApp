# APP 发布说明

## Android
需要自己生成 keystore 密钥  (参考：deploy/keystore.properties.example)

1. 修改 android -> app -> app.iml  
    确保下面配置为 release  
    ```<option name="SELECTED_BUILD_VARIANT" value="release" />```  
2. 修改 android -> app -> build.gradle (参考发布配置 deploy/gradle-deploy-demo.txt，默认开发配置参考：deploy/gradle-dev-demo.txt)  
3. 菜单 build -> generate signed APK -> 按流程操作  

## iOS
注意：发布需要开发者账号 (General -> Signning -> Team/Signning Certificate)
  
1. 菜单 Product -> Scheme -> Edit Scheme -> Run -> Build Configuration: 修改为release  
2. Product -> Archive -> 开发版本 -> 按流程操作  