// your key=API_KEY is equal to AIzaSyAdfPN1zBfjX-Xjav-aRIGbKYq2bCXWaqU... for Google Map
var instagramToken = '1285024802.e38f0d6.1eb75e601b7e4392937accc250af8008';
var map; // Google map canvas
var marker; // any marker
var markers = []; // data points from the model
var nbrInfo; // any info window
var nbrInfos = []; // info windows for the markers
var element; // binds a view model to a particular element on the page
var notify = new ko.subscribable(); // allows the search view model to notify the list view model of a change
var n; // some number
var nbrPhotos = []; // images from Instagram
var timeoutID;

// this is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
// this view model watches the search box
var nbrSearchViewModel = function() {

    // data

    var self = this;
    self.nbrDataSearch = ko.observable();

    // behaviours

    // watch the search box with instant updates (subscribe property and textInput courtesy of both Knockout documentation and Stack Overflow)
    self.nbrDataSearch.subscribe(function (newValue) { // had to subscribe to get instant updates from textInput?
        // let the list view model know the search box has changed
        notify.notifySubscribers(newValue, "searchBoxChanged");
    });

};

element = document.getElementById('search'); // we only want to view the DOM associated with an id named 'search'
ko.applyBindings(new nbrSearchViewModel(), element);

// this is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
// this view model watches the list item box
var nbrListViewModel = function() {

    // data

    var self = this;
    self.nbrList = ko.observableArray();

    // add each object from the model to the observable array
    neighborhoodData.forEach(function(data){
        self.nbrList.push(new nbrData(data)); // knockout requires an object (nbrData)?
    });

    // behaviours

    // when a list item is mouse clicked do something
    self.clickNbrItem = function(nbrItem) {
        // TODO: make all list view items and markers normal then add highlight to the clicked item
        itemClicked(nbrItem);
    }

    // receives a notification from the search view model when the search box changes
    notify.subscribe(function(newValue) {
        console.log("i can see " + newValue);
        search(newValue, self.nbrList());
    }, this, "searchBoxChanged");

};

element = document.getElementById('list'); // we only want to view the DOM associated with an id named 'list'
ko.applyBindings(new nbrListViewModel(), element);

// initialize the map
function initMap() {

    console.log('initMap start and nbrPhotos length = ' + nbrPhotos.length);

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

        // TODO: is nbrInfos array needed? examine this code later
        // create an info window for each object
        nbrInfos.push(
            new google.maps.InfoWindow({
                content: data.info // add info from neighborhoodData (add photos later after they download)
                // content: '<img src="img/wireframe.jpg" alt="a wireframe" width="100" height="100" >' + data.info
                // content: nbrPhotos[n].caption;
            })
        );

        // get the last marker and info window
        marker = markers[markers.length - 1];
        nbrInfo = nbrInfos[nbrInfos.length - 1];

        // attach the info window to the marker
        attachMessage(marker, nbrInfo);

        // attach a bounce animation to the marker
        attachBounce(marker);

    });

    console.log('initMap end and nbrPhotos length = ' + nbrPhotos.length);

}

// attach an info window to a marker (courtesy of Google Maps API documentation)
function attachMessage(marker, message) {
    marker.addListener('click', function() {
        message.open(marker.get(map), marker);
    });
}

// add bounce animation to a marker that activates on mouse click (courtesy of Google Maps API documentation)
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

// open the marker's info window after a mouse click
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

// mouse clicked a list item... do stuff here
function itemClicked(nbrItem) {

    marker = markers[nbrItem.id];
    nbrInfo = nbrInfos[nbrItem.id];
    toggleBounce(marker);
    nbrInfo.open(map, marker);

}

// turn list items and map markers on and off based on the search target
function search(target, list) {

    list.forEach(function(nbrItem){
        n = nbrItem.title.search(target); // search for the target string inside the nbrItem title string
        if (n >= 0) {
            // turn on the list item and marker
            console.log("found search in " + nbrItem.title);
            nbrItem.show(true);
            markers[nbrItem.id].setMap(map);
        } else {
            // turn off the list item and marker
            nbrItem.show(false);
            markers[nbrItem.id].setMap(null);
        };
    });

}

// asynchronously get photos from Instagram (courtesy of Misha Rudrastyh blog)
$.ajax({
    url: 'https://api.instagram.com/v1/users/self/media/recent', // no need for a user id when using a sandbox app
    // TODO: is using jsonp bad here?
    dataType: 'jsonp',
    type: 'GET',
    data: {access_token: instagramToken},
    success: function(data){
        for(stuff in data.data){
            nbrPhotos.push(new Photo(data.data[stuff])); // add photos to our photos array
        }
        addPhotosToInfoWindows(); // attach photos to info windows
    },
    error: function(data){
        console.log(data); // send the error notifications to console
    }
});
console.log('ajax photos block complete and nbrPhotos length = ' + nbrPhotos.length);

// function getPhotosComplete() {
//     console.log('the photos download is complete!');
//     console.log('nbrPhotos length = ' + nbrPhotos.length);
//     // addPhotos();
//     delayedAddPhotos();
// }

// function delayedAddPhotos() {
//     timeoutID = window.setTimeout(addPhotos, 0000);
// }

// add Instagram photos to each marker's InfoWindow
function addPhotosToInfoWindows() {
    n = 0;
    nbrInfos.forEach(function(data){
        // content: data.info
        // data.setContent('<img src="img/wireframe.jpg" alt="a wireframe" width="100" height="100">' + 'data.info');
        // content: nbrPhotos[n].caption;
        if (n < nbrPhotos.length) {
            data.setContent(nbrPhotos[n].url);
            n++;
        }
        console.log('photo in array');
    });
}











