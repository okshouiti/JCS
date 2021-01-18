# スコープ
-変数の参照可能範囲-

プログラム中の構造の多くはスコープと呼ばれる範囲を持つ。スコープは変数を参照できる範囲のことで、変数名の重複による意図せざる動作を避けるなど多くの恩恵がある。

\toc





## 構造ごとのスコープ

| 構造                                  | スコープ       | 配置できる場所            |
| :------------------------------------ | :------------- | :------------------------ |
| `module`, `baremodule`                | グローバル     | グローバル                |
| `struct`                              | ソフトローカル | グローバル                |
| `for`, `while`, `try`                 | ソフトローカル | すべて（global or local） |
| `macro`                               | ハードローカル | グローバル                |
| `let`, 関数, 内包リスト, ジェネレータ | ハードローカル | すべて                    |
| `begin`, `if`                         | 導入なし       | すべて                    |

Juliaのスコープはレキシカルスコープで、
- 動的に変化しない。
- 子スコープは親スコープの変数を参照できる（逆は不可）。

関数は、
- 呼び出し場所のスコープを継承せず（値の受け渡しは引数で）、
- 定義された場所の変数を参照できる（引数と同名の変数は除く）。





## グローバルスコープ
グローバルスコープは最も上位のスコープで、*モジュール*（後の項で説明）がこれを導入します。

- モジュール内の変数は特別な場合を除き外部から変更されない

また、REPLなど対話環境下の作業スペースは`Main`モジュール内なのでグローバルスコープ。

\example{
```julia
module A
    a = 2
    module B
        b = 3
    end
    c = a   # 同じスコープ内の値にアクセス
    d = b   # エラー、同じスコープ内のBは参照できるが、その中身は見えない
    module C
        e = b   # エラー、独立した別のグローバルスコープにはアクセス不可
        import ..B   # モジュールBをこのスコープ内で利用可能にする
        f = B.b   # モジュールB内の変数にアクセス
        B.b = 5   # エラー、別モジュールの変数は変更できない
    end
end
```
}





## ローカルスコープ
プログラム中のほとんどの構造はローカルスコープを導入し、そこで使われる変数は暗黙的にローカル変数とみなされる。`local x`と明示的にローカル変数であると宣言することもできる。

また、ローカルスコープにはハードローカルスコープとソフトローカルスコープの２種があり、挙動が異なります。

ローカルスコープ内で変数への代入`x = 値`があった場合の挙動は以下の通り
1. `x`がローカル変数として宣言されていればそのまま代入
1. `x`がローカル変数として宣言されていない場合、代入を行ったのが
    1. ハードローカル内なら新たなローカル変数として宣言される
    1. ソフトローカル内かつ
        1. `x`がグローバル変数として定義されていなければ新たなローカル変数として宣言される
        1. `x`がグローバル変数として定義されており、さらに
            1. 対話環境ならグローバル変数として代入される
            1. 非対話環境なら警告を表示してローカル変数として宣言される


\example{
```julia
let
    # パターン1
    a = 3
    let
        a = 5
        println(a)   # -> 5
    end
    println(a)   # -> 5
    # パターン2-1
    let
        b = 4
        println(b)   # -> 4   # 新たにローカルとして宣言される
    end
    println(b)   # -> エラー、変数cはこのスコープでは未定義
end;
```

次の最後の例はコードを文字列から実行するinclude_stringを使っている。これは非対話環境扱いとなる。
```julia-repl
julia> for i ∈ 1:3   # パターン2-2-1
           a = i
           println(a)
       end
1
2
3

julia> println(a)
ERROR: UndefVarError: a not defined


julia> b = 1;   # パターン2-2-2-1

julia> for i ∈ 2:4
           b = i
           println(b)
       end
2
3
4

julia> println(b)
4


julia> code = """
       b = 1
       for i ∈ 2:4
           b = i
           println(b)
       end
       println(b)
       """;   # パターン2-2-2-2

julia> include_string(Main, code)
┌ Warning: Assignment to `b` in soft scope is ambiguous because a global variable by the same name exists: `b` will be treated as a ne
w local. Disambiguate by using `local b` to suppress this warning or `global b` to assign to the existing global variable.
└ @ string:3
2
3
4
1
```
}



### `Let`ブロック
`let`キーワードに続けて変数の代入や宣言をすると、`let`ブロック内でその変数は新しいローカル変数として宣言され、親スコープの変数と同じ名前であっても別物として扱われます。スコープを導入しない`begin`ブロックの代わりに使うと便利だったりします。

```julia
x, y, z = 1, 1, 1
let x=2, z
    println("x = $x, y = $y")   # -> x = 2, y = 1
    println(z)   # エラー、ローカル変数として宣言したが値を入れていない
end
```

\example{
```julia
julia> Fs = Vector{Any}(undef, 2); i = 1;

julia> while i <= 2
           Fs[i] = ()->i
           global i += 1
       end

julia> Fs[1]()
3

julia> Fs[2]()
3
```

```julia
julia> Fs = Vector{Any}(undef, 2); i = 1;

julia> while i <= 2
           let i = i
               Fs[i] = ()->i
           end
           global i += 1
       end

julia> Fs[1]()
1

julia> Fs[2]()
2
```
}



### ループにおけるスコープ
`let`ブロックのように、`for`ループや内包ループ（後の項で説明）は毎回スコープを導入します。`for i in 1:3`の`i`のような反復に使われる変数は常に新しいローカル変数となります。しかし、`outer`キーワードを使えば新しいローカル変数ではなく親スコープの変数に再代入する形でループを回すことができます。
\example{
```julia
let
    i = 0
    for i ∈ 1:3
        # 空ループ、i=0への再代入なし
    end
    println(i)   # -> 0
    for outer i = 1:3
        # 空ループ、i=0への再代入あり
    end
    println(i)   # -> 3
end
```
}



### 定数
変数の中には一度決めた値を様々な場所で使いまわすものもあります。グローバルスコープ直下にある変数が変更を必要としないものなら、積極的に定数として定義しましょう。パフォーマンス向上に寄与します。ローカル変数の場合には`const`をつけなくともそれが定数かどうかはJuliaがうまく判断してくれます。
```julia-repl
julia> const pi = 3.14159265358979323846;

julia> const a, b = 1, 2
(1, 2)
```
`const`キーワードで定義される定数は再び変数束縛されないというだけで、イミュータブルなオブジェクトではない。例えば配列を定数として定義したとき、別の配列や数値などをそれに再代入することはできないが配列の中身に対する操作は可能である。

Special top-level assignments, such as those performed by the function and struct keywords, are constant by default.

定数への再代入は特定の条件下では可能である。とはいえ非推奨。
```julia
# 別の型を代入
const x = 1.0
x = 1   # エラー

# 同じ型を代入
const y = 1.0
y = 2.0   # 警告は出るがイケる

# 同じ型でかつ、結果的に値が変わらない
const z = 100
z = 100   # OK

# ただしミュータブルオブジェクトは値が不変でも警告が出る
const a = [1]
a = [1]   # 警告は出るがイケる
```
