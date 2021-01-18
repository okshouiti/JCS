# はじめる

\tableofcontents





## インストール
Juliaのインストールは簡単です。[https://julialang.org/downloads/](https://julialang.org/downloads/)から自分のOS用のバイナリをダウンロードしてインストールしましょう。またはソースコードから自分でビルドすることも可能です。





## Juliaを動かす
Juliaで書かれたコードを実行するには2つの方法があります。1つはREPLと呼ばれる対話環境にて
```julia-repl
$ julia
               _
   _       _ _(_)_     |  Documentation: https://docs.julialang.org
  (_)     | (_) (_)    |
   _ _   _| |_  __ _   |  Type "?" for help, "]?" for Pkg help.
  | | | | | | |/ _` |  |
  | | |_| | | | (_| |  |  Version 1.3.1 (2019-12-30)
 _/ |\__'_|_|_|\__'_|  |  Official https://julialang.org/ release
|__/                   |

julia> println("Hello, World")
Hello, World

julia>
```
のようにするか、コマンドラインから
```
$ julia script.jl arg1 arg2...
```
と呼び出す方法があります。
