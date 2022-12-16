$(document).ready(function() {
    $("a.open").each(function() {  
      window.open(this.href); 
    });
    window.close();
});
