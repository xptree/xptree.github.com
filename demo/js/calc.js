function submit_info() {
    var one = $('input[name="step1"]:checked');
    if (!one.length) { return false; }
    var two = $('input[name="step2"]:checked');
    if (!two.length) { return false; }
    one = one[0].id;
    two = two[0].id;
    var result = document.getElementById('result');
    result.style.display = "initial";
}
