// marker constructor
var Marker = function(data) {
    this.id = data.id;
    this.title = data.title;
    this.info = data.info;
    this.location = data.location;
    this.list = data.list;
    this.map = data.map;
}

// info window constructor
var NeighborhoodInfo = function(data) {
    this.content = data.info;
}
