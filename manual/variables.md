# 変数

\tableofcontents





## 変数の基礎
Juliaにおいて、変数とはある値に紐付けた（[束縛](https://ja.wikipedia.org/wiki/自由変数と束縛変数)された）名前です。様々な値に名前をつけて管理しておくと後で利用しやすくなります。
```julia
# 代入式の基本
x = 10

# 変数xを利用した計算
x + 1   # -> 11

# xに値を再び代入
x = 1 + 1

x + 1   # -> 3

#  複数の変数に同時に代入
m, n = 4, 5

# 文字列のような数値以外の値も代入できます
x = "Hello World!"
```
Juliaでは多様な変数名を使うことができます。変数は大文字と小文字が区別され（`aa`と`Aa`は異なる変数）、その名前自体は意味を持ちません。
```julia
x = 1.0

y = -3

Z = "My string"

customary_phrase = "Hello world!"

UniversalDeclarationOfHumanRightsStart = "人人生而自由，在尊严和权利上一律平等。"
```
Unicode(UTF-8)の文字が使えます（もちろん日本語も！）。
```julia
δ = 0.00001

안녕하세요 = "Hello"

いちにち = "1440分"
```
juliaのREPLやその他いくつかの開発環境では、バックスラッシュ・LaTeXコマンド・tabキーを組み合わせて記号を入力できます。例えばδという記号を入力したいとき、`\delta`と入力し`tab`キーを押せばδが現れます。（日本語からの変換でも入力できます）。記号の名前やコマンドが分からない場合はREPLで?と入力しhelpモードに入ってから記号を貼り付けてEnterするとコマンドを教えてくれます。
```julia-repl
julia> ?

help?> δ
"δ" can be typed by \delta(tab)
```
Juliaによって定義済みの定数や関数を定義し直したりすることも可能です。（しかし混乱を生みやすいので、これらの再定義はしないほうがよいでしょう）
```julia
# 定義済み変数のπ
π   # -> 3.1415926535897...

π = 3

2π   # -> 6

sqrt = 4
```
再定義する前にその定数や関数を一度でも使っていたらJuliaはエラーを吐きます。再定義はこれらの定数を使う前に行いましょう。
```julia
2π   # -> 6.283185307179586

π = 3   # -> ERROR: cannot assign variable MathConstants.pi from module Main

sqrt(100)   # -> 10.0

sqrt = 4   # -> ERROR: cannot assign variable Base.sqrt from module Main
```





## 使用可能な変数名
変数名は文字に分類される文字やアンダースコアなどで始まらなければなりません。数字から始めた場合例えば`3x`は`3*x`と解釈され、これは`3`と`x`の積です。

詳しくはUnicodeコードポイントが00A0より大きい記号、例えば
- Lu/Ll/Lt/Lm/Lo/Nl   "文字"
- Sc/So   "通貨およびその他のシンボル"
- 数学記号などの"文字のような"記号
などが変数名の先頭に使えます。

先頭以外では
- Nd/No - "数"
- Pc - "句読点"
等を含む多くの記号が使えます。

`+`のような演算子も
Operators like + are also valid identifiers, but are parsed specially. In some contexts, operators can be used just like variables; for example (+) refers to the addition function, and (+) = f will reassign it. Most of the Unicode infix operators (in category Sm), such as ⊕, are parsed as infix operators and are available for user-defined methods (e.g. you can use const ⊗ = kron to define ⊗ as an infix Kronecker product). Operators can also be suffixed with modifying marks, primes, and sub/superscripts, e.g. +̂ₐ″ is parsed as an infix operator with the same precedence as +.

The only explicitly disallowed names for variables are the names of built-in statements:
```julia-repl
julia> else = false
ERROR: syntax: unexpected "else"

julia> try = "No"
ERROR: syntax: unexpected "="
```
Some Unicode characters are considered to be equivalent in identifiers. Different ways of entering Unicode combining characters (e.g., accents) are treated as equivalent (specifically, Julia identifiers are NFC-normalized). The Unicode characters ɛ (U+025B: Latin small letter open e) and µ (U+00B5: micro sign) are treated as equivalent to the corresponding Greek letters, because the former are easily accessible via some input methods.





## 命名慣習
Juliaは使用可能な名前にもいくつか制限を設けており、以下の慣習に沿って書きやすくなっています。
- 変数名は小文字
- アンダースコア(`_`)で複数語からなる変数名の各単語を区切る。ただし、区切らないと読みづらい場合を除き極力使わない
- 型とモジュールの名前は大文字で始め、区切り文字を使わず各単語の先頭を大文字とすることで識別する
- 関数とマクロの名前は小文字でアンダースコアを使わない
- 自身の引数に値を上書きする関数は最後に`!`をつける

命名慣習およびその他「書き方」については[スタイルガイド](aaa)にて詳しく触れます。
