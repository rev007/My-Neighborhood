// marker constructor
var Marker = function(data) {
    this.id = data.id;
    this.title = data.title;
    this.info = data.info;
    this.location = data.location;
    this.show = ko.observable(JSON.parse(data.show)); // parses and converts into an object corresponding to the given text
}

// info window constructor
var NeighborhoodInfo = function(data) {
    this.content = data.info;
}

// photo constructor
var Photo = function(data) {
    // this.url = '<img src="'+data.data[x].images.low_resolution.url+'">';
    this.url = '<img src="'+data.images.low_resolution.url+'">';
    this.caption = data.caption.text;
    console.log(this.caption);
}
