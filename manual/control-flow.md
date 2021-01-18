# 制御構造

\tableofcontents



Julia provides a variety of control flow constructs:

- Compound Expressions: begin and ;.
- Conditional Evaluation: if-elseif-else and ?: (ternary operator).
- Short-Circuit Evaluation: &&, || and chained comparisons.
- Repeated Evaluation: Loops: while and for.
- Exception Handling: try-catch, error and throw.
- Tasks (aka Coroutines): yieldto.

The first five control flow mechanisms are standard to high-level programming languages. Tasks are not so standard: they provide non-local control flow, making it possible to switch between temporarily-suspended computations. This is a powerful construct: both exception handling and cooperative multitasking are implemented in Julia using tasks. Everyday programming requires no direct usage of tasks, but certain problems can be solved much more easily by using tasks.





## 複合式
いくつかの式をまとめて一つの式として扱えるようにしたもの。式を順に評価していき、その結果を自身の値とする。`begin`あるいは`;`でまとめることができます。
```
z = begin
    x = 1
    y = 2
    x + y
end

z = (x = 1; y = 2; x + y)   #> 3
```
これらは一行あるいは複数行のどちらでも記述可能です。
```
begin x = 1; y = 2; x + y end

(x = 1;
 y = 2;
 x + y)   #-> 3
```





## 条件評価
条件式の真偽によって処理を分岐できます。条件式とそれが真であるときに評価されるコードブロックのセットで構成されます。
- `if` - 基本形、条件式が真であれば評価。
- `elseif` - 任意の数の条件式を追加。
- `else` - すべての条件式が偽の場合の処理を記述。
```
if 条件式1
    コードブロック1
elseif 条件式2
    コードブロック2
else
    コードブロック3
end
```
\example{
```julia-repl
julia> function test(x, y)
           if x < y
               println("xはyより小さい")
           elseif x > y
               println("xはyより大きい")
           else
               println("xとyは等しい")
           end
       end
test (generic function with 1 method)

julia> test(1, 2)
xはyより小さい

julia> test(2, 1)
xはyより大きい

julia> test(1, 1)
xとyは等しい
```
`if`文のブロックはローカルスコープを導入しないためブロック内で新たに定義された変数をブロック外の式から参照できます。
```julia-repl
julia> function test(x,y)
           if x < y
               relation = "less than"
           elseif x == y
               relation = "equal to"
           else
               relation = "greater than"
           end
           # ifブロック以降の式から変数を参照
           println("x is ", relation, " y.")
       end
test (generic function with 1 method)

julia> test(2, 1)
x is greater than y.
```
`if`文をこのように使う場合、条件分岐の全パターンで変数を定義するよう気をつけてください。変数を定義していないブロックがある場合、後にその変数を利用する際にエラーになり得ます。
}
`if`ブロックは値を返します。複合式と同様に返される値は評価されるブロックの最後の式の結果です。

また、Juliaの条件評価で使えるのは真偽値を表す`Bool`型の2値（`true`と`false`）のみです。一部の言語で使われている1と0は使えません。
\example{
```julia-repl
julia> x = 3;

julia> if x > 0
           "positive!"
       else
           "negative..."
       end
"positive!"



julia> if true
           println("真")
       end
真

julia> if 1
           println("真")
       end
ERROR: TypeError: non-boolean (Int64) used in boolean context
```
}

### 三項演算
条件式と式が単純な場合は三項演算を使うことで可読性の高いコードになります。
```
条件式 ? 式1 : 式2

# 同上
if 条件式
    式1
else
    式2
end
```
上の2つは同じです。各式と`?`および`:`の間の半角空白は必須。

これらを組み合わせることも可能。
```
# 分かりやすく括弧を付けた、無くても良い
条件式1 ? 式1 : (条件式2 ? 式2 : 式3)

# 上と同じ結果を得る
if 条件式1
    式1
elseif 条件式2
    式2
else
    式3
end
```





## 短縮評価
`&&`と`||`はブール演算子として使われ、余分な処理を省くために以下のような性質を持ちます。
- `a && b` - aが`false`ならbにかかわらず`false`。（aかつb）
- `a || b` - aが`true`ならbにかかわらず`true`。（aまたはb）
これらの性質から条件評価に似た使い方が出来ます。
```
# 条件式が真であれば式が評価される
条件式 && 式

# 条件式が偽 〃
条件式 || 式
```
\example{
評価される式と結果の値は次のようになります。
```julia-repl
julia> 真(x) = (println(x); true);

julia> 偽(x) = (println(x); false);

julia> 式1,式2 = "式1は評価された","式2は評価された";

julia> 真(式1) && 真(式2)
式1は評価された
式2は評価された
true

julia> 真(式1) && 偽(式2)
式1は評価された
式2は評価された
false

julia> 偽(式1) && 真(式2)
式1は評価された
false

julia> 偽(式1) && 偽(式2)
式1は評価された
false

julia> 真(式1) || 真(式2)
式1は評価された
true

julia> 真(式1) || 偽(式2)
式1は評価された
true

julia> 偽(式1) || 真(式2)
式1は評価された
式2は評価された
true

julia> 偽(式1) || 偽(式2)
式1は評価された
式2は評価された
false
```
以下は短縮評価を使って再帰的に階乗を求める関数を定義した例です。
```julia-repl
julia> function fact(n::Int)
           n >= 0 || error("nは非負でなければいけません！")
           n == 0 && return 1
           n * fact(n-1)
       end
fact (generic function with 1 method)

julia> fact(5)
120

julia> fact(0)
1

julia> fact(-1)
ERROR: nは非負でなければいけません！
```
}

条件式は`if`文と同様に`Bool`型の値のみ使えます。一方で式2ではあらゆる値を受け付け、式2が評価された際にはその値を返値として返します。

You can easily experiment in the same way with the associativity and precedence of various combinations of && and || operators.





## 反復評価-ループ
### whileループ
`while`ループは条件式が真である限りコードブロックを評価し続けます。
```julia
while 条件式
    コードブロック
end
```
\example{
```julia-repl
julia> i = 1;

julia> while i <= 5
           println(i)
           global i += 1
       end
1
2
3
4
5
```
}
### forループ
`for`ループはイテラブルオブジェクトを使って反復処理をします。`while`ループとの主な違いは反復に利用する変数がブロック外からアクセス可能か否かです。`while`ループではブロック外で予め定義された変数を使って反復しますが、`for`ループではブロックの内側のみでアクセス可能な変数が使われます。
```
for 変数 = イテラブルオブジェクト
    コードブロック
end
```
\example{
```julia-repl
julia> for j = 1:5
           println(j)
       end
1
2
3
4
5

julia> j
ERROR: UndefVarError: j not defined
```
任意の変数名と、`=`に加えて`in`および`∈`キーワードが使えます。さらに範囲オブジェクト以外にも配列やタプルなどのイテラブル（反復可能）オブジェクトを使って反復処理が可能です。
```julia-repl
julia> for i in [1,4,0]
           println(i)
       end
1
4
0

julia> strs = ("foo","bar","baz");

julia> for str ∈ strs
           println(str)
       end
foo
bar
baz
```
}

### 反復の制御
関数には即座に値を返し評価を終了する`return`キーワードがありますが、ループ処理にもこれに近いキーワードが二つあります。

- `break` - 反復自体の終了。このキーワードが評価された時点でループを終了。
- `continue` - 現在のループを終了。ループ自体は継続しており、次のループへ移行。
\example{
```julia-repl
julia> i = 1;

julia> while true
           println(i)
           if i >= 5   # 5以上であれば反復を終了
               break
           end
           global i += 1
       end
1
2
3
4
5

julia> for i = 1:10
           if i%3 != 0   # 3の倍数以外はcontinueでスキップ
               continue
           end
           println(i)
       end
3
6
9
```
この`while`ループは条件式がリテラル`true`なので`break`キーワードが無ければ無限にループします。
}

### ネスト
`for`ループは入れ子にでき、単純な入れ子の場合には簡潔な記法（便宜的に単純ネスト記法と呼ぶことにします）も用意されていますが、特定の状況では振る舞いが異なることもあるため注意が必要です。
\example{
単純ネスト記法では反復に使うすべての変数が反復の度に新しくセットされるのに対して、通常のネストでは内側の反復処理が終わって初めて親ループの変数が新しくセットされます。
```julia-repl
julia> for i=1:2, j=3:4
           println((i,j))
           i = 0
       end
(1, 3)
(1, 4)
(2, 3)
(2, 4)

julia> for i = 1:2
           for j = 3:4
               println((i, j))
               i = 0
           end
       end
(1, 3)
(0, 4)
(2, 3)
(0, 4)
```
`break`キーワードはそれが含まれるループを終了するので、普通にネストしたループでは内側ブロックを抜けるだけなのに対し、単純ネスト記法はあくまで一つの反復ブロック扱いなので評価された時点で終了します。
```julia-repl
julia> for i in 1:2:11, j in 2:3:11
           if i == j
               println("iとjが持つ最小の共通値は$i")
               break
           end
       end
iとjが持つ最小の共通値は5

julia> for i in 1:2:11
           for j in 2:3:11
               if i == j
                   println("iとjが持つ最小の共通値は$i")
                   break
               end
           end
       end
iとjが持つ最小の共通値は5
iとjが持つ最小の共通値は11
```
}





## 例外処理
不慮の事態により関数が予期せぬ値を返したとき、その値によってエラーを吐いたり適切な処理をすることもあります。このような処理には例外オブジェクトを使います。

### 組み込みの例外
```plaintext
Exception
    │
    ├─── ArgumentError
    ├─── BoundsError
    ├─── CompositeException
    ├─── DimensionMismatch
    ├─── DivideError
    ├─── DomainError
    ├─── EOFError
    ├─── ErrorException
    ├─── InexactError
    ├─── InitError
    ├─── InterruptException
    ├─── InvalidStateException
    ├─── KeyError
    ├─── LoadError
    ├─── OutOfMemoryError
    ├─── ReadOnlyMemoryError
    ├─── RemoteException
    ├─── MethodError
    ├─── OverflowError
    ├─── Meta.ParseError
    ├─── SystemError
    ├─── TypeError
    ├─── UndefRefError
    ├─── UndefVarError
    └─── StringIndexError
```
\example{
```julia-repl
julia> sqrt(-1)
ERROR: DomainError with -1.0:
sqrt will only return a complex result if called with a complex argument. Try sqrt(Complex(x)).
```
}

### 