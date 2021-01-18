# 文字列

\tableofcontents





## 概要
```
# 文字列の生成
str = "Hello, world."
# アクセス
str[2]   #-> 'e'
# アクセス(範囲)
str[1:5]   #-> "Hello"
# 結合
"I'm " * "fine."   #-> "I'm fine."
# 補完
whom = "Japan."
"Hello, $whom"   #-> "Hello, Japan."
```

## 文字と文字列について
Juliaにおいて「文字」は1つの文字、「文字列」は任意の数の文字からなる文字の集まりです。例えば、`a`や`楽`は文字、`minute`や`携帯電話`は文字列にあたります。任意の数の文字なので一文字でも構いませんし、ゼロ文字も文字列に含まれます。

- 文字列の具象型は`String`です。さまざまな文字種が使える（UTF-8エンコードのUnicodeの全範囲）。
- bbb





## 文字-Character
前述の通り、Juliaにおいて文字は1つの文字からなる値で`'a'`のように`'`シングルクオートで囲んで表現します。
あ





## 文字列-String
### 文字列の基礎
文字列は`"`（ダブルクオート）で囲みます。文字列がダブルクオートを含む場合は３つのダブルクオートで囲むか、`\"`のようにバックスラッシュでエスケープしてください。
```
str = "Hello, world."

str2 = """Contains "quote" characters"""

#同上
str3 = "Contains \"quote\" characters"
```
文字列が代入された変数`str`の3番目の文字を抜き出したい場合は`str[3]`のように書きます。このとき、結果は文字列ではなく文字です。最初および最後の文字にはそれぞれ`begin`(Julia1.4以降)、`end`でアクセスでき、これらは数字と組み合わせることもできます。
```
str[3]   #-> 'l'

# (Julia1.4以降はstr[begin]と書ける)
str[1]   #-> 'H'

str[end]   #-> '.'

str[end-3]   #-> 'r'

str[end÷2]   #-> ','
```
`str[4:9]`のように範囲で指定すると文字列から文字列を抜き出せます。範囲で指定した場合は抜き出す文字列が１文字の場合でも`Char`ではなく`String`になります。
```
str[4:9]   #-> "lo, Wo"

str[end-5:end]   #-> "World."

str[2]   #-> 'e'

str[2:2]   #-> "e"
```
範囲指定はもとの文字列の一部を複製しますが、このような抜き出しは`SubString`型でも出来ます。
```
substr = SubString(str, 1, 5)   #-> "Hello"

typeof(substr)   #-> SubString{String}
```
### 文字列の結合
文字列に対してよく使われる演算は結合です。文字列の結合は`string`関数か`*`(アスタリスク)演算子で可能です。`+`ではなく`*`です。
```
greet = "Hello"
whom = "world"

string(greet, "-", whom)   #-> "Hello-world"

greet * "_" * whom   #-> "Hello_world"
```
### 文字列補完
上記のような文字列結合よりも直感的に扱える文字列補完も便利です。文字列リテラル中に`$`を先頭に付けた変数を置くことでその変数の値を文字列中に埋め込みます。
```
"$greet, $whom."   #-> "Hello, world."

# Julia内部ではstring関数呼び出しに変換されています。
# 同じ処理ですが可読性に差がありますね。
string(greet, ", ", whom, ".")   #-> "Hello, world."

"\$greet, \$whom."
```
`$`のあとに括弧で囲んだ式を記述すると、その結果の値が文字列中に埋め込まれます。簡単な処理であれば変数を使わずに文字列リテラル内で直接処理してしまった方がいいでしょう。
```
"1 + 2 = $(1 + 2)"   #-> "1 + 2 = 3"

# 簡単な処理なら結果を変数に代入せずに
# 文字列リテラル内で処理してしまった方が良いでしょう。
myfunc(x) = x + 4
answer = myfunc(5)

"ans: $answer"   #-> "ans: 9"

"ans: $(myfunc(5))"   #-> "ans: 9"
```
例の`$(1 + 2)`が数値を処理していることからも分かりますが、文字列結合および補完は両者とも文字列以外のオブジェクトを扱えます。これらは文字列へと変換されますが、その際リテラル式として記述される形式に近い形に変換されます。
```
v = [1,2,3]

"v: $v"   #-> "v: [1, 2, 3]"
```
`AbstractString`はもちろん`AbstractChar`は文字列の構成部品であるため、変換なしで直接埋め込まれます。

`"`と同様に、文字列が`$`を含む場合は`\$`とエスケープします。下記はREPL上でこのような文字列を`print`した例です。
```julia-repl
julia> print("I have \$100 in my account.")
I have $100 in my account.
```
### 三重クオート文字リテラル
3つのダブルクオートで生成された文字列は特殊な挙動をします。複数行にわたる長文などの扱いに有用です。

閉じ"""の行を含む行のうち最もインデントレベルが浅い行がインデントの基準となり、その行のインデントレベルが0になるように全行から同数のインデントが削除されます。
```
str = """
    Hello,
    world.
"""
#-> "    Hello,\n    world.\n"
```
ここでは文字数が0の最終行(閉じ"""の行)が基準になっています。
```
"""    This
  is
    a test"""
#-> "    This\nis\n  a test"
```
この例ではではisの行が基準になっているため、a testの行のインデントが空白4つから2つに減っていますね。問題は開始"""に続く一行目です。実は「開始"""に続く最初の行」と「空白かtabのみを含む行」はインデント基準になりません。（ちなみに閉じ"""が続く最終行は空白かtabのみであっても基準となり得ます。）

また、開始"""の直後に改行がある場合、この改行は削除されます。つまり下の2つは同じです。
```
"""hello"""

"""
hello"""
```





## 演算
文字と文字列では辞書的な比較が出来ます。
```
"abc" < "abd"   #-> true

"abracadabra" == "xylophone"   #-> false

"Hello, world." != "Goodbye, world."   #-> true

"1 + 2 = 3" == "1 + 2 = $(1 + 2)"   #-> true
```
文字列中に含まれる特定の文字のうち最初と最後の文字の添字は`findfirst`関数と`findlast`関数を使って取得できます。
```
findfirst(isequal('o'), "xylophone")   #-> 4

findlast(isequal('o'), "xylophone")   #-> 7
```
n文字目以前・以降の特定の文字の添字は`findprev`および`findnext`関数で取得できます
```
findnext(isequal('o'), "xylophone", 1)   #-> 4

findnext(isequal('o'), "xylophone", 5)   #-> 7

findprev(isequal('o'), "xylophone", 5)   #-> 4
```
文字列中に特定の文字あるいはSubStringが含まれるかどうかを判定するには`occursin`関数を使います。
```
occursin("world", "Hello, world.")   #-> true

occursin("a", "Xylophon")   #-> false

occursin('o', "Xylophon")   #-> true
```
他にも有用な関数として指定回数だけ文字列を繰り返す`repeat`や特定の文字で区切って文字列を結合する`join`などがあります。
```
repeat(".:Z:.", 5)   #-> ".:Z:..:Z:..:Z:..:Z:..:Z:."

strs = ["よし", "いく", "ぞう"]
join(strs, "☆")   #-> "よし☆いく☆ぞう"
```
そのほかにも様々な関数が用意されています。これらはBaseライブラリの[文字列](/base/string/)項にて記載してあります。





## そのほかの文字列リテラル
### 正規表現

<!--
## 詳細
文字列は抽象型`AbstractString`をもち、
```plaintext
AbstractString
    |---String
    |---SubString
    |---SubstitutionString
```
### aaa
aaa

### 文字列結合の留意点
aaa

文字列操作のために用意された`chop`、`chomp`、`strip`をはじめとする関数は`SubString`型の文字列を返します。このため引数に何かしら文字列を使う関数は`AbstractString`型で定義することが推奨されます。
-->