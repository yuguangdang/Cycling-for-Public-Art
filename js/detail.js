
const params = JSON.parse(decodeURIComponent(location.search).substring(1));

function renderDetailPage(params) {
  console.log(params.location);
  $("#content").html(`
    <div class="image">
      <img src="https://monumentaustralia.org.au/content/directory/full/Walter_Hill_-76511-90855.jpg" alt="art img">
    </div>
    
    <div class="detail-info">
      <h1>${params.artTitle}</h1>
      <br>
      <p>Location: ${params.location}</p>
      <br>
      <p>Material: ${params.material}</p>
      <br>
      <p>Description: </p>
      <br>
      <p>${params.description}</p>
      <br>
      <p>Installed Year: ${params.year}</p>
      <br>
      <br>
      <a id="view-map" class="btn" href="map.html">VIEW IN MAP</a>
    </div>

    

  `);
}
renderDetailPage(params);
