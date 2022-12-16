function myFunction(arg) {
    var copyText = document.querySelectorAll("input");
    copyText[arg].select();
    copyText[arg].setSelectionRange(0, 99999)
    document.execCommand("copy");
  }

  function date(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
    }
    function date1(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
    }
    function date2(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
    }
    document.getElementById('myField').value = date(30, 1);
    document.getElementById('myField2').value = date1(12, 3);
    var xa = date2(2001, 1975);
    document.getElementById('myField3').value = xa;
    var xax = 2020-xa;
    document.getElementById('myField4').value = xax;