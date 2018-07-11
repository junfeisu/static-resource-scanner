> 简介

一个简单的静态扫描工具，扫描指定项目目录下的所有静态文件，然后生成一张资源表，写入json文件。可以指定扫描项目目录下的某个目录，也可以指定忽略某些目录

### 运行环境
本工具是采用Node开发的，并且运行环境是Node，并非Shell。需要的Node版本Node6.5++

### Usage

  1. 克隆项目

        git clone git@github.com:junfeisu/static-resource-scanner.git


  2. 进行扫描

        cd static-resource-scanner && npm install
        node bin/scan scan dir -r relativePth -i ignorePath -n jsonFileName

  3. 具体使用指南可以通过一下命令查看：

        node bin/scan scan -help

    具体示例如下图：

    ![](http://7xrp7o.com1.z0.glb.clouddn.com/Selection_001.png)

  4. 标注：一些问题的标注

    * 每个option只支持一个value(由于commander库的限制，后面应该会改成通过readline来设置option)

    * 静态文件类型的设定现在是写死的，可以自行更改app.js里面的配置

    * 后期会加上每个静态文件的依赖

### Thanks

  [commander.js](https://github.com/tj/commander.js)
    

