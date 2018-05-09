
var currentFloorplanId = null;
function f_showRichMediaViewer(floorplanId) {
    currentFloorplanId = floorplanId;
    $("#dialog-overlay").show();
    f_buildRichMediaViewer(floorplanId);
    $("#richmedia-viewer").fadeIn(300);
}

function f_hideRichMediaViewer() {
    $('.rmv-flexslider').flexslider("destroy");
    $('#2d-flexslider').remove();
    $('#3d-flexslider').remove();
    currentFloorplanId = null;
    $("#dialog-overlay").hide();
    $("#richmedia-viewer").fadeOut(300);
}

function f_buildRichMediaViewer(floorplanId) {
    $('#rvm-2d-area').append('<div id="2d-flexslider" class="flexslider rmv-flexslider"><ul id="2d-slides" class="slides"></ul></div>');
    $('#rvm-3d-area').append('<div id="3d-flexslider" class="flexslider rmv-flexslider"><ul id="3d-slides" class="slides"></ul></div>');
    //$('#2d-slides').html('');
    //$('#3d-slides').html('');
    $('#2d_furnished').hide();
    $('#floorplan_' + floorplanId + ' .img_area li img').each(function (i, img) {
        if(img.alt.toLowerCase().indexOf('2d') > -1)
            $('#2d_furnished').show();
    });
    $('#3d_furnished').hide();
    $('#floorplan_' + floorplanId + ' .img_area li img').each(function (i, img) {
        if (img.alt.toLowerCase().indexOf('3d') > -1)
            $('#3d_furnished').show();
    });

    if ($('#floorplan_' + floorplanId).attr('data-360-view')) {
        $('#virtual_panaramic').show();
    } else {
        $('#virtual_panaramic').hide();
    }
    if ($('#floorplan_' + floorplanId).attr('data-furniture-arranger')) {
        $('#furniture_arranger').show();
    } else {
        $('#furniture_arranger').hide();
    }

    $("#spanFloorPlanHeader").html('Floor Plan: ' + $('#floorplan_' + floorplanId + ' h2').html() + ' | ' + $('#fp_' + floorplanId + '_beds').html() + ' bd, ' + $('#fp_' + floorplanId + '_beds').html() + ' ba, ' + $('#fp_' + floorplanId + '_sqft').html() + ' sqft, ' + $('#fp_' + floorplanId + '_range').html() + '/mo');
    $('#floorplan_' + floorplanId + ' .img_area li img').each(function(i, img) {
        if (img.alt.toLowerCase().indexOf('2d') != -1) {
            $('#2d-slides').append('<li><img src="' + img.src.replace('179x136', '500x500') + '" /></li>');
        } else if (img.alt.toLowerCase().indexOf('3d') != -1) {
            $('#3d-slides').append('<li><img src="' + img.src.replace('179x136', '500x500') + '" /></li>');
        } 
    });
   
    $('#rmv-360-view-iframe').attr('src', $('#floorplan_' + floorplanId).attr('data-360-view'));
    $('#rmv-furniture-arranger-iframe').attr('src', $('#floorplan_' + floorplanId).attr('data-furniture-arranger'));
    
    if ($('#3d_furnished').css('display') == "none")
        f_display2D();
    else
        f_display3D();
}

function f_display2D() {
    f_leftButtonClicked();
    $('.twoD_furnished').addClass('active');
    $('#rvm-2d-area').show();
    $('#2d-flexslider').flexslider({
        animation: "slide",
        controlNav: false,
        slideshow: false,
    });
}

function f_display3D() {
    f_leftButtonClicked();
    $('.threeD_furnished').addClass('active');
    $('#rvm-3d-area').show();
    $('#3d-flexslider').flexslider({
        animation: "slide",
        controlNav: false,
        slideshow: false,
    });
}

function f_display360View() {
    f_leftButtonClicked();
    //$('.left-tabs div').removeClass('active');
    $('.virtual_panaramic').addClass('active');
    $('#rvm-360-view-area').show();
}

function f_displayFurnitureArranger() {
    f_leftButtonClicked();
    $('.furniture_arranger').addClass('active');
    $('#rvm-furniture-arranger-area').show();
}

function f_printBrochure() {
    f_printClickHandler($('#floorplan_' + currentFloorplanId + ' h2').html().replace(/ /g, '-'), propertyId);
}

function f_leftButtonClicked() {
    $('.rmv-flexslider').flexslider("destroy");
    $('.left-tabs div').removeClass('active');
    $('.panel-2-area').hide();
}

function f_toggleFullScreen() {
    if ($('#richmedia-viewer').hasClass("full-screen-btn")) {
        $('#richmedia-viewer').removeClass('full-screen-view');
        $('#richmedia-viewer').removeClass('full-screen-btn');
        $(".minimize-bt").html('Full Screen');
    } else {
        $('#richmedia-viewer').addClass('full-screen-view');
        $('#richmedia-viewer').addClass('full-screen-btn');
        $(".minimize-bt").html('Standard View');
    }
}

function f_toggleRichMediaMenu() {
    if ($("#expand-bt").hasClass("collapsed-btn")) {
        $('#richmedia-viewer').removeClass('collapsed-menu');
        $('#expand-bt').removeClass('collapsed-btn');
    } else {
        $('#richmedia-viewer').addClass('collapsed-menu');
        $('#expand-bt').addClass('collapsed-btn');
    }
}
