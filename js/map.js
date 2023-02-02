
/*********************** Setup the map  ********************/

// Create tile layer (base layer).
var baselayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoieXVndWFuZy0iLCJhIjoiY2t0OXc1aGw2MWZ1aDJ3bjlzaWhhN28xcyJ9.wUum46HehtfX57lKhhSW8w', {
attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
maxZoom: 18,
id: 'mapbox/streets-v11',
tileSize: 512,
zoomOffset: -1,
accessToken: 'your.mapbox.access.token'
});

// Create overlayers
var taps = L.layerGroup();
var arts = L.layerGroup();
var racks = L.layerGroup();

// Define my map
var mymap = L.map('mapid', {
    center: [-27.448129, 153.041823],
    zoom: 12,
    layers: [baselayer, arts]
});

// Define base map
var baseMaps = {
    "Map": baselayer,
};

// Define overlayers
var overlayMaps = {
	"Public Arts": arts,
	"Taps": taps,
	"Bicycle racks": racks,
};

// Add overlayers on base map.
L.control.layers(baseMaps, overlayMaps).addTo(mymap);


/*********************** Loading puclic art onto the map ********************/

function iterateRecords(data) {

	console.log(data);

	// Save artwork template to a variable.
	var artworkTemplate = $(".artwork-template");

	var myIcon = L.icon({
		iconUrl: 'images/water.png',

		iconSize:     [20, 30], 
		iconAnchor:   [22, 94], 
		popupAnchor:  [-15, -100] 
	});

	$.each(data.result.records, function(artID, recordValue) {
		
		var artID = recordValue["_id"];
		var artTitle = recordValue["Item_title"];
		var location = recordValue["The_Location"];
		var description = recordValue["Description"];
		var material = recordValue["Material"];
		var year = recordValue["Installed"];
		var artLatitude = recordValue["Latitude"];
		var artLongitude = recordValue["Longitude"];

		if(artID && artTitle && location && description && material && year && artLatitude && artLongitude ) {

			var clonedArtworkTemplate = artworkTemplate.clone();
			clonedArtworkTemplate.attr("id", "artwork-" + artID);
			clonedArtworkTemplate.appendTo("#artworks");

			$("#artwork-" + artID + " h2").html(artTitle + " (" + year + ") ");
			$("#artwork-" + artID + " .location").html(location);
			$("#artwork-" + artID + " img").attr("src", "https://monumentaustralia.org.au/content/directory/full/Walter_Hill_-76511-90855.jpg");
			$("#artwork-" + artID + " img").attr("data-strip-caption", artTitle);
			$("#artwork-" + artID + " a").attr("href", "https://marmelab.com/images/blog/ascii-art-converter/homer.png");
			$("#artwork-" + artID + " .material").html("Material: " + material);
			$("#artwork-" + artID + " div .latitude").html(artLatitude);
			$("#artwork-" + artID + " div .longitude").html(artLongitude);

			// Mark all public art shown on the map.
			var marker = L.marker([artLatitude, artLongitude]).addTo(arts);
			popupText = "" + artTitle + " (" + year + ") " + "<br>" + "<br>" + location;
			marker.bindPopup(popupText).openPopup();
		}
	});

	// Display the number of showed record.
	$("#filter-count strong").text($(".artwork-template:visible").length);
	
	// Hide all public art
	$(".artwork-template").hide();
	$("#artworks").hide();

	// Set timeout for the loading sign.
	setTimeout(function () {
		$("body").addClass("loaded");
	}, 1000);

	// Search by its material.
	$("#filter-text").keyup(function(event) {
		var searchTerm = $(this).val();

		$(".artwork-template").hide();
		arts.clearLayers();

		console.log(searchTerm);

		if(searchTerm) {
				var markerCounter = 0;
				$(".artwork-template:contains('" + searchTerm + "')").each(function(index, value) {
					loadMarkers(value);
					markerCounter ++;
				})
		} else {
			var markerCounter = 0;
			$(".artwork-template").each(function(index, value) {
				if($(value).find(".title").text() != "Art title") {
				loadMarkers(value);
				markerCounter ++;
				}
			})
		}
				
		$("#filter-count strong").text(markerCounter);
	});

	// Load markers from given artwork-template objects.
	function loadMarkers(artwork) {
		var lat = $(artwork).find(".latitude").text();
		var lng = $(artwork).find(".longitude").text();
		var marker = L.marker([lat, lng]).addTo(arts);
		popupText = "" + $(artwork).find(".title").text() + "<br>" + "<br>" + $(artwork).find(".location").text();
		marker.bindPopup(popupText).openPopup();
	}
}

/*********************** Loading fountain tap onto the map ********************/

function iterateTapRecords(data) {

	console.log("this is tap data");

	var myIcon = L.icon({
		iconUrl: 'images/water.png',
		iconSize:     [20, 30], 
		iconAnchor:   [22, 94], 
		popupAnchor:  [-15, -100] 
	});

	$.each(data.result.records, function(ID, recordValue) {
		
		var description = recordValue["ITEM_DESCRIPTION"];
		var tapLatitude = recordValue["Y"];
		var tapLongitude = recordValue["X"];

		if(description && tapLatitude && tapLongitude) {

		// Mark all public art shown on the map.
		var marker = L.marker([tapLatitude, tapLongitude], {icon: myIcon}).addTo(taps);
		// console.log(taps);
		popupText = "Type: " + description.toLowerCase();
		marker.bindPopup(popupText).openPopup();
	}

	})
}

/*********************** Loading bicyle racks onto the map ********************/

function iterateRackRecords(data) {

	console.log("this is rack data");

	var rackIcon = L.icon({
		iconUrl: 'images/bikeRack.png',
		iconSize:     [20, 20], 
		iconAnchor:   [22, 94], 
		popupAnchor:  [-15, -100] 
	});

	$.each(data.result.records, function(artID, recordValue) {
		
		var description = recordValue["Rack type"];
		var capacity = recordValue["Capacity"];
		var rackLatitude = recordValue["Latitude"];
		var rackLongitude = recordValue["Longitude"];

		if(capacity && rackLatitude&&rackLongitude) {

		// Mark all public art shown on the map.
		var marker = L.marker([rackLatitude, rackLongitude], {icon: rackIcon}).addTo(racks);
		// console.log(taps);
		popupText = "Rack type: " + description + "<br>" + "<br>" + "(Capacity: " + capacity + ")";
		marker.bindPopup(popupText).openPopup();
	}

	})
}

/** 
 * Getting data from database and save it to local storage if it is the first time.
 */

$(document).ready(function() {

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
		}

		$.ajax({
			url: "https://www.data.brisbane.qld.gov.au/data/api/3/action/datastore_search",
			data: data,
			dataType: "jsonp", 
			cache: true,
			success: function(data) {
				// Save data into localStorage.
				localStorage.setItem("slqData", JSON.stringify(data));
	
				iterateRecords(data);
			}
		});
	}


	// Getting fountain tap info from its dataset.

	var tapData = JSON.parse(localStorage.getItem("tapData"));

	if (tapData) {
		console.log("Source: localStorage");
		iterateTapRecords(tapData);
	} else {
		console.log("Source: ajax call");
		var tapData = {
			resource_id: "69c588f4-232a-4e71-88ee-045f8afb6880",
			//limit: 100
		}

		$.ajax({
			url: "https://www.data.brisbane.qld.gov.au/data/api/3/action/datastore_search",
			data: tapData,
			dataType: "jsonp", 
			cache: true,
			success: function(data) {
				// Save data into localStorage.
				localStorage.setItem("tapData", JSON.stringify(data));
	
				iterateTapRecords(data);
			}
		});
	}

	// Getting bicycle rack info from its dataset.

	var rackData = JSON.parse(localStorage.getItem("rackData"));

	if (rackData) {
		console.log("Source: localStorage");
		iterateRackRecords(rackData);
	} else {
		console.log("Source: ajax call");
		var rackData = {
			resource_id: "4a67a16d-ffc7-4831-a77b-64d8ac42459e",
			//limit: 100
		}

		$.ajax({
			url: "https://www.data.brisbane.qld.gov.au/data/api/3/action/datastore_search",
			data: rackData,
			dataType: "jsonp", 
			cache: true,
			success: function(data) {
				// Save data into localStorage.
				localStorage.setItem("rackData", JSON.stringify(data));
	
				iterateRackRecords(data);
			}
		});
	}
});


