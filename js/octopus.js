// key=API_KEY... AIzaSyAdfPN1zBfjX-Xjav-aRIGbKYq2bCXWaqU

// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
var ViewModel = function() {

    var self = this;

    this.markers = ko.observableArray([]);

    markersData.forEach(function(marker){
        self.markers.push(new Marker(marker));
    });

    this.clickMarker = function(clickedMarker) {
        console.log('click!' + clickedMarker.name);
    }
};

ko.applyBindings(new ViewModel());




