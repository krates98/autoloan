$(document).ready(function() {
    $(".delete").hide();
    //when the Add Field button is clicked
    $("#add").click(function(e) {
      $(".delete").fadeIn("1500");
      //Append a new row of code to the "#items" div
      $("#itemsfor").append(
        '<div class="margin-bottom next-input"><hr><input id="textinput" name="offerurl" type="text" placeholder="Enter URL of Offer" class="form-control "></div>'
      );
    });
    $("body").on("click", ".delete", function(e) {
      $(".next-input").last().remove();
    });
  });
  