# 型
-値の分類-

値を扱う上で型は避けて通れない。Juliaには型をあまり気にせず済む工夫がされているが、型の知識が必要になることもある。

\tableofcontents





## 型とは
ざっくり言えば値の種類。`1`は整数型の値で`"こんにちは"`は文字列型の値だ。大きく分けると次のようになる。

- 抽象型 (Abstract)
- プリミティブ型 (Primitive)
- 複合型 (Composite)




## 型を宣言する
### 型断定 (assertion)
`::`演算子でコード内の値に型の情報を注釈として付与すると、場合によっては
-  型由来の予期せぬエラーを回避できる
-  コンパイラが吐くコードが高速化する

対象の値が断定した型で表現できなければエラー

```julia-repl
julia> (1+2)::Int
3

julia> (1+2)::AbstractFloat
ERROR: TypeError: in typeassert, expected AbstractFloat, got a value of type Int64

julia> x = 1.0
1.0

julia> (x+2)::AbstractFloat
3.0
```

### 型宣言 (declaration)

代入式や`local`変数宣言において`::`をつける場合は挙動が異なり、指定した型になるよう`convert`関数で変換を試みる。ただしグローバル変数に対しては不可。

```julia
function foo(n)
	x::Int8 = n
	y = n
	z::Float64 = n
	return x, y, z
end

a, b, c = foo(100)

typeof(a)   # -> Int8
typeof(b)   # -> Int64
typeof(c)   # -> Float64
```





## Tips
### 型宣言
`::`演算子でコード内の値に型の情報を注釈として付与すると、場合によっては
-  値の型を明示することで型由来の予期せぬエラーを回避できる
-  コンパイラが吐くコードが高速化する