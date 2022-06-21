## Mac 系统的环境变量加载顺序

1. /etc/profile

   - 该文件是**系统层面**的，系统启动就会加载
   - 系统下的**所有用户**都会生效，为系统的每个用户设置环境变量信息

2. /etc/paths

   - 是**系统层面**的

3. /etc/bashrc

   - 是**系统层面**的

4. ~/.bash_profile

   - 是**当前用户层面**的
   - 按照从前往后的顺序读取，如果 ~/.bash_profile 存在，就不会去读后面的 ~/.bash_login 和 ~/.profile 了；如果不存在，才会去读后面的文件

5. ~/.bash_login

   - 是**当前用户层面**的
   - 同上，按照从前往后的顺序读取

6. ~/.profile

   - 是**当前用户层面**的
   - 同上，按照从前往后的顺序读取

7. ~/.bashrc
   - 没有上述 " 从前往后的顺序读取 " 规则，它是 bash shell 打开的时候载入的

## 修改配置

### 想要对所有用户生效

一般不建议修改/etc/profile 和/etc/bashrc 文件，而去修改/etc/paths 文件

```shell
$ vim /etc/paths

/usr/local/bin
/usr/bin
/bin
/usr/sbin
/sbin
# 在结尾加上自己想要的路径
```

### 只想对当前用户生效

一般修改 ~/.bash_profile 文件

- Linux 里面是 .bashrc 而 Mac 是 .bash_profile
- 如果 ~/.bash_profile 文件不存在，可以 touch 一个
- `$PATH` 表示引用已存在的 path，冒号表示分隔符，后面拼接新的环境变量

```shell
$ vim ~/.bash_profile

# 定义一个环境变量 JAVA_HOME
# 把 JAVA_HOME 拼接到原始的 $PATH 上
export JAVA_HOME=/lib/java/jdk1.9.0/home
export PATH=$PATH:$JAVA_HOME/bin

# 保存退出后，执行 source 立刻生效
source ~/.bash_profile

# 查看
echo $PATH
```
