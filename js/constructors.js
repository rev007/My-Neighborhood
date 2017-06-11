// neighborhood data constructor
var NbrData = function(data) {
    this.id = data.id;
    this.title = data.title;
    this.info = data.info;
    this.location = data.location;
    this.show = ko.observable(JSON.parse(data.show)); // parses and converts into an object corresponding to the given text
};

// photo constructor
var Photo = function(data) {
    this.url = '<img src="'+data.images.low_resolution.url+'" alt="Instagram photo" width="100" height="100">';
    this.caption = data.caption.text;
};
