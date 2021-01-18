document.addEventListener('DOMContentLoaded', () => {
    toggleExample();
});

const toggle = () => {
    const sidebar = document.getElementsByClassName("sidebar")[0];
    if (sidebar.style.left) {
        sidebar.style.left = null;
    } else {
        sidebar.style.left = "0";
    };
};

const toggleExample = () => {
    const examplebtn = document.getElementsByClassName("example-btn");
    const example = document.getElementsByClassName("example");
    for (let i=0; i<example.length; i++) {
        examplebtn[i].addEventListener("click", () => {
            if (example[i].style.maxHeight) {
                example[i].style.maxHeight = null;
            } else {
                example[i].style.maxHeight = example[i].scrollHeight+"px";
            };
        });
    };
};

/*
const evenHeadlines = () => {
    const content = document.getElementsByClassName("franklin-content")[0];
    const h2s = content.children.filter(elm => elm.tagName === "H2");
    const evenH2s = h2s.filter((v, i) => i % 2 === 0)
    var count = content.childElementCount;
    var h2s = [];
    for (let i=0; i<count-1; i++) {
        if (content.children[i].tagName == "H2") {
            h2s.push(i)
        };
    };
    h2s
    for (let j=0; j<h2s.length-1; ) {
        aaa
    };
};
*/
