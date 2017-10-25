// your key=API_KEY is equal to AIzaSyAdfPN1zBfjX-Xjav-aRIGbKYq2bCXWaqU... for Google Map
var instagramToken = '1285024802.e38f0d6.1eb75e601b7e4392937accc250af8008';
var map; // Google map canvas
var marker; // any marker
var markers = []; // data points for the map
var nbrInfo; // any info window
var nbrInfos = []; // info windows for the markers
var contentString; // content for info windows of downloaded model data
var newMarkerContentString; // content for info windows of new markers
var element; // binds a view model to a particular element on the page
var notify = new ko.subscribable(); // allows the search view model to notify the list view model of a change
var n; // some number
var nbrPhotos = []; // images from Instagram

/* ==========================================================================
 SEARCH BOX VIEW MODEL
 ========================================================================== */

// third party API courtesy of Knockout
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

/* ==========================================================================
 LIST ITEMS VIEW MODEL
 ========================================================================== */

// third party API courtesy of Knockout
// this is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
// this view model watches the list item box
var nbrListViewModel = function() {

    // data

    var self = this;
    self.nbrList = ko.observableArray();

    // add each object from the model to the observable array
    neighborhoodData.forEach(function(data){
        self.nbrList.push(new NbrData(data)); // knockout requires an object (nbrData)?
    });

    // behaviours

    // when a list item is mouse clicked do something
    self.clickNbrItem = function(nbrItem) {
        // TODO: make all list view items and markers normal then add highlight to the clicked item
        itemClicked(nbrItem);
    };

    // receives a notification from the search view model when the search box changes
    notify.subscribe(function(newValue) {
        console.log("i can see " + newValue);
        search(newValue, self.nbrList());
    }, this, "searchBoxChanged");

};

element = document.getElementById('list'); // we only want to view the DOM associated with an id named 'list'
ko.applyBindings(new nbrListViewModel(), element);


/* ==========================================================================
 MAP
 ========================================================================== */

// an error will be called if something goes wrong with your Google map scripting from index.html
function googleError() {
    console.log('There is something wrong with your JavaScript!');
    alert('There was an issue with Neighborhood Map! Please contact customer support.'); // alert user
}

// this error will be called if something goes wrong with the Google map API itself
function gm_authFailure() {
    console.log('Google maps failed to authenticate!');
    alert('There was an issue with Google maps! Please contact Google.'); // alert user
}

// third party API courtesy of Google
// initialize the map
function initMap() {

    var neighborhood = {lat: 42.42580, lng: -71.67593};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 19,
        center: neighborhood
    });

    var imageBounds = {
        north: 42.42707,
        south: 42.42432,
        east: -71.67329,
        west: -71.67862
    };

    // add the neighborhood image to the map
    var neighborhoodOverlay = new google.maps.GroundOverlay(
        'img/neighborhood.svg',
        imageBounds);
    neighborhoodOverlay.setMap(map);

    // cycle through each object in the neighborhoodData model
    neighborhoodData.forEach(function(nbrData){

        var markerLat = parseFloat(nbrData.location.lat);
        var markerLng = parseFloat(nbrData.location.lng);

        // create a marker for each object
        markers.push(
            new google.maps.Marker({
                position: {lat: markerLat, lng: markerLng},
                map: map,
                title: nbrData.title,
                animation: google.maps.Animation.DROP
            })
        );

        // create some content for the info windows
        initialContentString =
            '<h3>'+nbrData.title+'</h3>'+
            '<p>'+nbrData.info+'</p>';

        // create an info window for each object
        newInfoWindow(initialContentString); // add content from neighborhoodData (add photos later after they download)
        attachInfoWindow();

        // attach a bounce animation to the marker
        attachBounce(marker);

    });

    // create a new marker whenever the neighborhood map is clicked
    google.maps.event.addListener(neighborhoodOverlay, "click", function(event) {

        newMarker(event.latLng);
        newInfoWindow();
        attachInfoWindow();

    });

}


/* ==========================================================================
 TEST AREA do stuff here
 ========================================================================== */

function newMarker(coordinates) {
    markers.push(
        new google.maps.Marker({
            position: coordinates,
            map: map,
            title: 'new',
            animation: google.maps.Animation.DROP
        })
    );
}

function newInfoWindow(contentString) {

    if (!contentString) {
        // add content if none was specified (such as in a new marker)
        contentString =
            '<div id="zork" class="info-window">'+
            '<table>'+
            '<tr><td>Title:</td> <td><input type="text" id="title"/> </td> </tr>'+
            '<tr><td>Info:</td> <td><input type="text" id="info"/> </td> </tr>'+
            '<tr><td></td><td><input type="button" value="Save" onclick="saveData(this)"/>'+
            '<input type="button" value="Delete" onclick="deleteData()"/></td></tr>'+
            '<table>'+
            '</div>';
    }

    nbrInfos.push(
        new google.maps.InfoWindow({
            content: contentString // add blah blah
        })
    );
}

function attachInfoWindow() {
    // get the last marker and info window
    marker = markers[markers.length - 1];
    nbrInfo = nbrInfos[nbrInfos.length - 1];

    // attach the info window to the marker
    attachMessage(marker, nbrInfo);
}

function saveData(content) {
    console.log('saved!');
    console.log(content);
    console.dir(content);

    // TODO: attach a bounce animation to the marker
    // TODO: attachBounce(marker);
}

function deleteData() {
    console.log('deleted!');
}

/* ==========================================================================
 MARKERS displays and animations
 ========================================================================== */

// attach an info window to a marker (courtesy of Google Maps API documentation)
function attachMessage(marker, message) {
    marker.addListener('click', function() {
        message.open(marker.get(map), marker);
    });
}

// add bounce animation to a marker that activates on mouse click (courtesy of Google Maps API documentation)
function attachBounce(marker) {
    marker.addListener('click', function() {toggleBounce(marker);});
}

// turn bouncing off for all markers
function stopBounce() {
    markers.forEach(function(data) {
        data.setAnimation(null);
    });
}

// turn bouncing marker animation on and off
function toggleBounce(marker) {
    var bMarkerWasBouncing = false;
    if (marker.getAnimation() !== null) {bMarkerWasBouncing = true;} // check if marker was already bouncing when clicked
    stopBounce(); // stop all markers from bouncing
    if (!bMarkerWasBouncing) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

/* ==========================================================================
 LIST ITEMS
 ========================================================================== */

// mouse clicked a list item... do stuff here
function itemClicked(nbrItem) {

    marker = markers[nbrItem.id];
    nbrInfo = nbrInfos[nbrItem.id];
    toggleBounce(marker);
    nbrInfo.open(map, marker);

}

/* ==========================================================================
 LIST ITEMS AND MARKERS
 ========================================================================== */

// turn list items and map markers on and off based on the search target
function search(target, list) {

    list.forEach(function(nbrItem){
        n = nbrItem.title.search(target); // search for the target string inside the nbrItem title string
        if (n >= 0) {
            // turn on the list item and marker
            console.log("found search in " + nbrItem.title);
            nbrItem.show(true);
            markers[nbrItem.id].setVisible(true);
        } else {
            // turn off the list item and marker
            nbrItem.show(false);
            markers[nbrItem.id].setVisible(false);
        }
    });

}

/* ==========================================================================
 PHOTOS retrieve Instagram URLs and attach
 ========================================================================== */

// third party API courtesy of Instagram
// asynchronously get photos from Instagram (courtesy of Misha Rudrastyh blog)
$.ajax({
    url: 'https://api.instagram.com/v1/users/self/media/recent', // no need for a user id when using a sandbox app
    // TODO: is using jsonp bad here?
    dataType: 'jsonp',
    type: 'GET',
    data: {access_token: instagramToken},
    success: function(data){
        data.data.forEach(function(element) {
            nbrPhotos.push(new Photo(element)); // add photos to our photos array
        });
        addPhotosToInfoWindows(); // attach photos to info windows
    },
    error: function(data){
        console.log(data); // send the error notifications to console for developer troubleshooting
        alert('There was an issue with downloading photos from Instagram! Please contact customer support.'); // alert user
    }
});

// add Instagram photos to each marker's InfoWindow
function addPhotosToInfoWindows() {

    // get the title from each info window
    nbrInfos.forEach(function(windowData){

        n = windowData.content.indexOf("</h3>"); // find the position of the closing <h3> element
        contentString = windowData.content.substring(4, n); // grab the title of the current info window between the two <h3> elements

        // find a matching photo
        nbrPhotos.forEach(function(photoData){

            if (photoData.caption === contentString) {
                contentString = windowData.content + photoData.url; // create a new content string that includes the matching photo
                windowData.setContent(contentString); // set the new content string to the current info window
            }

        });

    });

}
