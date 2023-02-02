function iterateRecords(data) {
  console.log(data);

  // Save artwork template to a variable.
  var artworkTemplate = $(".artwork-template");

  $.each(data.result.records, function (artID, recordValue) {
    var artID = recordValue["_id"];
    var artTitle = recordValue["Item_title"];
    var location = recordValue["The_Location"];
    var description = recordValue["Description"];
    var material = recordValue["Material"];
    var year = recordValue["Installed"];
    var artLatitude = recordValue["Latitude"];
    var artLongitude = recordValue["Longitude"];

    if (artID && artTitle && location && description && material && year && artLatitude && artLongitude) {
      var clonedArtworkTemplate = artworkTemplate.clone();
      clonedArtworkTemplate.attr("id", "artwork-" + artID);
      clonedArtworkTemplate.appendTo("#artworks");

      $("#artwork-" + artID + " h2").html(artTitle);
      $("#artwork-" + artID + " .location").html(location);
      $("#artwork-" + artID + " img").attr("src", "https://monumentaustralia.org.au/content/directory/full/Walter_Hill_-76511-90855.jpg");
      $("#artwork-" + artID + " img").attr("data-strip-caption", artTitle);
      $("#artwork-" + artID + " .strip").attr("href", "https://marmelab.com/images/blog/ascii-art-converter/homer.png");
      $("#artwork-" + artID + " .material").html("Material: " + material);
      $("#artwork-" + artID + " div .latitude").html(artLatitude);
      $("#artwork-" + artID + " div .longitude").html(artLongitude);
    }

    // Save relevant data to a constant and use encodeURIComponent sending it to its own detailed page
    const artDetail = {
      artTitle,
      description,
      location,
      year,
      material,
    };
    const jsonDataStr = JSON.stringify(artDetail);
    const urlParams = "detail.html?" + encodeURIComponent(jsonDataStr);
    $("#artwork-" + artID + " div.action a[id='view-detail']").attr("href", urlParams);
  });

  // Display the number of showed records.
  $("#filter-count strong").text($(".artwork-template:visible").length);

  // Set timeout for the loading sign.
  setTimeout(function () {
    $("body").addClass("loaded");
  }, 1000);

  // Search by its material.
  $("#filter-text").keyup(function (event) {
    var searchTerm = $(this).val();

    $(".artwork-template").hide();

    if (searchTerm) {
      $(".artwork-template:contains('" + searchTerm + "')").show();
    } else {
      $(".artwork-template").each(function (index, value) {
        if ($(value).find(".title").text() != "Art title") {
          $(value).show();
        }
      });
    }

    $("#filter-count strong").text($(".artwork-template:visible").length);
  });
}

$(document).ready(function () {
  // Find localStorage data and send it to a variable.
  var slqData = JSON.parse(localStorage.getItem("slqData"));

  // Get data from localStorage if saved, else get data form API.
  if (slqData) {
    console.log("Source: localStorage");
    iterateRecords(slqData);
  } else {
    console.log("Source: ajax call");
    var data = {
      resource_id: "3c972b8e-9340-4b6d-8c7b-2ed988aa3343",
      //limit: 100
    };

    $.ajax({
      url: "https://www.data.brisbane.qld.gov.au/data/api/3/action/datastore_search",
      data: data,
      dataType: "jsonp",
      cache: true,
      success: function (data) {
        // Save data into localStorage.
        localStorage.setItem("slqData", JSON.stringify(data));

        iterateRecords(data);
      },
    });
  }
});
