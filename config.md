+++
website_title = "JuliaCheatSite"
website_descr = "Juliaのチートシートもどきを作ろうとしたが長くなってしまったサイト。"
website_url = "https://jcs.okshouiti.com/"
author = "okshouiti"
date_format = "yyyy-mm-dd"
autocode = true
automath = true
lang = "julia"
mintoclevel = 2
maxtoclevel = 3

manual = (
    "manual/getting-started",
    "manual/variables",
    "manual/int-and-float",
    "manual/operations",
    "manual/complex-and-rational",
    "manual/strings",
    "manual/functions",
    "manual/control-flow",
    "manual/scope",
    "manual/type"
)
+++



<!-- 
base = (
    "base/essentials",
    "base/collections",
    "base/math",
    "base/numbers",
    "base/strings",
    "base/file",
    "base/io"
)
omake = (
    "omake/HTTP.jl",
    "omake/Cascadia.jl",
    "omake/Franklin.jl"
)
-->



\newcommand{\br}[]{~~~<br>~~~}
\newcommand{\note}[1]{@@note @@title 📝 MEMO @@ @@content #1 @@ @@}
\newcommand{\tips}[1]{@@tips @@title 📝 TIPS @@ @@content #1 @@ @@}
\newcommand{\example}[1]{
    @@aa
        @@example-btn ▼ @@
        @@example #1 @@
    @@
}


\newcommand{\ObjectTable}[2]{
```julia:!#1
#hideall
text = """
!#2
"""
lines = split(text, '\n', keepempty=false)
indices = filter(eachindex(lines)) do i
    !startswith(lines[i], ' '^4)
end
table = Tuple{String,String}[]
for m ∈ eachindex(indices)
    subline = ""
    start = indices[m]+1
    stop = m < lastindex(indices) ? indices[m+1]-1 : lastindex(lines)
    for n ∈ start:stop
        str = lines[n][begin+4:end]
        if occursin('`', str)
            bq_indices = filter(str) do c
                c == '`'
            end
            bq_len = length(bq_indices)
            bq_stop = isodd(bq_len) ? bq_len-1 : bq_len
            for bq ∈ 1:bq_stop
                if isodd(bq)
                    str = replace(str, '`' => "<code>", count=1)
                else
                    str = replace(str, '`' => "</code>", count=1)
                end
            end
        end
        if start == stop
            subline *= str * "<br>"
        else
            subline *= str * "。<br>"
        end
    end
    push!(table, (lines[indices[m]], subline))
end
print("""~~~<table><tbody><tr><th align="left">用語</th><th align="left">説明</th></tr>""")
for (x,y) ∈ table
    print("""<tr><td align="left"><span class="name">$(x)</span></td><td align="left">$(y)</td></tr>""")
end
print("""</tbody></table>~~~""")
```

\textoutput{!#1}
}
