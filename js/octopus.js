// your key=API_KEY is equal to AIzaSyAdfPN1zBfjX-Xjav-aRIGbKYq2bCXWaqU
var map; // Google map canvas
var markers = []; // data points from the model
var marker; // any marker
var nbrInfos = []; // info windows for the markers
var nbrInfo; // any info window
var element; // binds a view model to a particular element on the page

// this is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
var nbrSearchViewModel = function() {

    // data

    var self = this;
    self.nbrMarkerSearch = ko.observable();

    // behaviours

    // search input (subsribe property and textInput courtesy of both Knockout documentation and Stack Overflow)
    self.nbrMarkerSearch.subscribe(function (newValue) {
        // search for markers that match newValue
        search(newValue);
    });

};

element = document.getElementById('search');
ko.applyBindings(new nbrSearchViewModel(), element);

// this is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
var nbrListViewModel = function() {

    // data

    var self = this;
    self.nbrList = ko.observableArray();
    // self.nbrMarkerSearch = ko.observable();

    // add each marker from the model to the observable array
    neighborhoodData.forEach(function(data){
        self.nbrList.push(new Marker(data)); // knockout requires an object (Marker)?
    });

    // behaviours

    // when a list item is clicked do something
    self.clickNbrItem = function(nbrItem) {
        console.log('click!' + nbrItem.title);
        // TODO: make all list view items and markers normal then add highlight to the clicked item
        itemClicked(nbrItem);
    }

    // filter markers (courtesy of Knockout documentation)
    self.filterMarkers = function() {
        // self.tasks.push(new Task({ title: this.nbrMarkerFilter() }));
        console.log(self.nbrMarkerFilter);
        self.nbrMarkerFilter("");
    };
    self.removeTask = function(task) { self.tasks.remove(task) };

};

element = document.getElementById('list');
ko.applyBindings(new nbrListViewModel(), element);

// initialize the map
function initMap() {

    // TODO: retrieve objects from your list view
    // TODO: match them to your markers in the map
    // TODO: no match? turn it off

    var neighborhood = {lat: 42.42600, lng: -71.67493};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: neighborhood
    });

    // cycle through each object in the neighborhoodData model
    neighborhoodData.forEach(function(data){

        var markerLat = parseFloat(data.location.lat);
        var markerLng = parseFloat(data.location.lng);

        // create a marker for each object
        markers.push(
            new google.maps.Marker({
                position: {lat: markerLat, lng: markerLng},
                map: map,
                title: data.title,
                animation: google.maps.Animation.DROP
            })
        );

        // TODO: not sure if this array will be useful later, but making it anyway
        // create an info window for each object
        nbrInfos.push(
            new google.maps.InfoWindow({
                content: data.info
            })
        );

        // get the last marker and info window
        marker = markers[markers.length - 1];
        nbrInfo = nbrInfos[nbrInfos.length - 1];

        // attach the info window to the marker
        attachMessage(marker, nbrInfo);

        attachBounce(marker);

    });

}

// attach an info window to a marker (courtesy of Google Maps API documentation)
function attachMessage(marker, message) {
    marker.addListener('click', function() {
        message.open(marker.get(map), marker);
    });
}

// add bounce animation to a marker that activates on click (courtesy of Google Maps API documentation)
// TODO: would be nice to understand how to add toggleBounce() here instead of duplicating
function attachBounce(marker) {
    marker.addListener('click', function() {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    });
}

// open the marker's info window
function toggleMessage(marker) {
    message.open(marker.get(map), marker);
}

// turn bouncing marker animation on and off
function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

function search(target) {
    // TODO: change list view to match
    // TODO: change markers to match

    console.log("search fcn called");
    console.log(target);
}

// clicked item
function itemClicked(nbrItem) {
    console.log("highlight stuff called");
    // do something
    marker = markers[nbrItem.id];
    nbrInfo = nbrInfos[nbrItem.id];

    toggleBounce(marker);
    nbrInfo.open(map, marker);
    console.log(nbrItem);
    console.log(nbrItem.list());
    nbrItem.list(false);
    console.log(nbrItem.list());
}





