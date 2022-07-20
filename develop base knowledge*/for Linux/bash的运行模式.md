# bash 运行的 4 种模式

## bash 有 2 组运行状态：

1. 交互式与非交互式（interactive 和 non-interactive）：输入命令，窗口（标准输出）返回结果

```shell
# 检测是否交互式
'$- 变量存储了当前 bash 的状态，默认值是 himBH'
$ echo $-
$ himBH

# bash -c 执行命令的情况下，就不是交互式
$ bash -c "echo \$-"
$ hBc

# 一般情况下，直接运行一个 sh 脚本，该脚本的执行过程是非交互式的，可以强制指定为 交互式的
# check_bash_attr.sh 的内容是 echo $-
$ bash -i check_bash_attr.sh
$ himBH
```

2. 登录式与非登录式（login shell 和 non-login shell）：用户登录到机器获得的 shell

```shell
# 检查是否登录式
$ shopt login_shell
$ login_shell    	on
```

## 额外知识：$- 值的解析

```shell
# 打开 bash man手册
$ man bash
'在结果中搜索 -h -i -B，可以查看每个字母代表什么意思'

# 可以通 set 命令设置 $- 的模式
'这里的 +m 是去掉 m 配置， -m 反而是增加 m 配置'
$ set +m
$ echo $-
$ hiBH

$ set -m
$ echo $-
$ himBH
```

- i - interactive

  - 这个选项说明当前的 shell 是一个交互式的 shell
  - 何为交互式？你输入命令，shell 解释执行后给你返回结果，我们在 Terminal 下使用的 shell 就是交互式的，所以 `$-` 会包含 `i` 字符
  - 如果我们在一个脚本里面 `echo $-`，结果是不会包含 `i` 的

- H - history expand

  - shell 会把我们执行的命令记录下来，可以通过 history 命令查看
  - 在 shell 退出时，会将这些信息保存到 `~/.bash_history` 文件中，启动时也会从该文件中加载
  - 可以通过 !! 来执行 history 中的上一条命令

- m - monitor mode

  - 字面意思是说打开监控模式，Bash 手册上后面还有一句话"Job control is enabled"，Job control 是什么？就是说可以控制进程的停止、继续，后台或者前台执行等
  - 正常情况下，在交互式模式下，该选项默认是打开的
  - 执行一个比较耗时的命令时，你可以按下 `CTRL+Z` 让它在后台运行，然后可以用 `fg` 命令将后台运行的任务恢复到前台执行

- B - brace expansion

  - 这是花括号扩展语法

  ```shell
  $ echo {1..10}
  $ 1 2 3 4 5 6 7 8 9 10

  $ echo {A..Z}
  $ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z

  # 花括号扩展支持嵌套
  $ echo c{a{1,4},b{2,3}}d
  $ ca1d ca4d cb2d cb3d

  # 应用
  $ mkdir {2021..2022}-0{1..9} {2021..2022}-{10..12}
  $ 2021-01 2021-02 2021-03.........2022-12
  ```

## bash 的 4 种运行模式，是由 2 组状态的交叉组合而成：

不同的运行模式，加载配置文件的顺序是不一样的

1. interactive + login shell （交互式登录）

   ```shell
   # 后面的配置文件 **继承** 前边的变量和Shell设置，相同的配置会进行覆盖

   加载的配置文件及顺序：
   # 1 login shell 才会读
   /etc/profile # 系统级的配置文件，最好不要修改这个文件

   # 2（依次读取下面三个，三选一，有一个存在，就不往下读）
   /root/.bash_profile # login shell 才会读
   /root/.bash_login
   /root/.profile

   # 3
   /root/.bashrc
   # 4
   /etc/bashrc
   # 5 退出的时候读取
   /root/.bash_logout

   # 额外说明
   .bash_profile 会读取 .bashrc，因为/root/.bash_profile 文件中一般会有下面的代码：
   if [ -f ~/.bashrc ] ; then
   . ./bashrc
   fi

   ~/.bashrc会调用 /etc/bashrc文件，因为 ~/.bashrc中，一般会有以下代码：
   if [ -f /etc/bashrc ] ; then
   . /bashrc
   fi
   ```

2. non-interactive + login shell （非交互式登录）

   - 进入该模式的操作：`bash -l xxx.sh`
   - 同为 login shell，加载顺序与第一种一致

3. interactive + non-login shell（交互式非登录）

   - 进入该模式的操作：`ssh -t xxx@123.123.123.123 “python”`，不登录，只执行命令

   ```shell
   # 加载文件顺序
   /root/.bashrc
   /etc/bashrc
   ```

4. non-interactive + non-login shell（非交互式非登录）

   - 进入该模式的操作：`bash xxx.sh`、`ssh xxx@123.123.123.123 “uptime”`

   ```shell
   # 加载文件顺序
   /root/.bashrc
   /etc/bashrc
   ```

# 一些常见问题

1. 为什么我必须在容器内使用`bash -l -c` ？

> `-l` 使 bash 成为登录式 shell，以便 bash 首先读取 `/etc/profile`，它可能具有某些重要配置项，否则会导致一些命令找不到

2. `bash xx.sh`会导致脚本 non-login && non-interactive，如何解决？

> 在 sh 脚本文件开头，配置 `#!/bin/bash -l`，让脚本用登录 Shell 来解释执行，就可以加载`/etc/profile`

3. su 和 su - 的区别？

> su 只是切换了 root 身份，但 Shell 环境仍然是普通用户的 Shell；而 su - 连用户和 Shell 环境一起切换成 root 身份了，**只有切换了 Shell 环境才不会出现 PATH 环境变量错误**

4. .bash_profile 和 .bashrc 的一些区别 ？

> .bash_profile 文件中会 ① 加载 .bashrc 文件 ② 设置一些 PATH 变量； .bashrc 文件中主要定义一些命令别名和函数
>
> ```shell
> # .bashrc文件
> # Source global definitions
> if [ -f /etc/bashrc ]; then
>     . /etc/bashrc
> fi
>
> # User specific aliases and functions
> alias rm='rm -i'
> alias cp='cp -i'
> alias mv='mv -i'
>
>
> # .bash_profile文件
> # Get the aliases and functions
> if [ -f ~/.bashrc ]; then
>     . ~/.bashrc
> fi
>
> # User specific environment and startup programs
> PATH=$PATH:$HOME/bin
> export PATH
> ```
