// your key=API_KEY is equal to AIzaSyAdfPN1zBfjX-Xjav-aRIGbKYq2bCXWaqU

// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
var ViewModel = function() {

    var self = this;

    this.nbrList = ko.observableArray([]);

    neighborhoodData.forEach(function(data){
        self.nbrList.push(new Marker(data));
    });

    // list view item is clicked
    this.clickNbrItem = function(nbrItem) {
        console.log('click!' + nbrItem.title);
        // TODO: make all list view items and markers normal then add highlights to the clicked item
        highlightStuff();
    }

};

ko.applyBindings(new ViewModel());

// initialize the map with some data
function initMap() {

    // TODO: retrieve objects from your list view
    // TODO: match them to your markers in the map
    // TODO: no match? turn it off

    var neighborhood = {lat: 42.42600, lng: -71.67493};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: neighborhood
    });

    // create a marker for each object in the neighborhoodData model
    neighborhoodData.forEach(function(data){
        var markerLat = parseFloat(data.location.lat);
        var markerLng = parseFloat(data.location.lng);
        var marker = new google.maps.Marker({
            position: {lat: markerLat, lng: markerLng},
            map: map,
            title: data.title
        })

        var infowindow = new google.maps.InfoWindow({
            content: data.info
        });
        marker.addListener('click', function() {
            infowindow.open(map, marker);
        });
    });
    
}

function search(target) {
    // TODO: change list view to match
    // TODO: change markers to match
}

// highlight clicked item
function highlightStuff() {
    console.log("highlight stuff called");
    // do something
}





