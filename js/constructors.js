// marker constructor
var Marker = function(data) {
    this.id = data.id;
    this.title = data.title;
    this.info = data.info;
    this.location = data.location;
    this.show = ko.observable(JSON.parse(data.show)); // parses and converts into an object corresponding to the given text
}

// // info window constructor
// var NeighborhoodInfo = function(data) {
//     this.id = data.id; // will use id to match with a photo
//     this.content = data.info; // content will start off with info from the neighborhoodData model
// }

// photo constructor
var Photo = function(data) {
    // this.url = '<img src="'+data.data[x].images.low_resolution.url+'">';
    // <img src="img/wireframe.jpg" alt="a wireframe" width="100" height="100">'
    // this.url = '<img src="'+data.images.low_resolution.url+'">';
    this.url = '<img src="'+data.images.low_resolution.url+'" alt="Instagram photo" width="100" height="100">';
    // this.url = '<img src="'+data.images.low_resolution.url+'" alt="Instagram photo" width=photoWidth height="100">';

    this.caption = data.caption.text; // will use Instagram caption to match with info window
    // console.log(this.caption);
}
