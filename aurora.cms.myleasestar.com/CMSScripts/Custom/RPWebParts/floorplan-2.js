$('head').append('<style>.fancybox3-button--play::before, .fancybox3-button--pause::before { top: calc(50% - 6px); left: calc(50% - 4px); } ' +
    '.fancybox3-button--fullscreen::before { top: calc(50% - 6px); left: calc(50% - 7px); } .fancybox3-button--close::before, ' +
    '.fancybox3-button--close::after { top: calc(50% - 1px); left: calc(50% - 8px); } .fancybox3-button--thumbs::before { top: calc(50% - 2px); left: calc(50% - 2px); }' +
    '.fancybox3-availableunits:before { top: calc(50% - 1px); }</style>');

function f_getUnitsDone(uData, allUnitsLoaded) {
    $('.floorplan-block').removeClass('no-flicker');
    if (uData && uData.units)
        unitsData = unitsData.concat(uData.units);
    if (!allUnitsLoaded) return;
    f_setInitialUnitsData();
    f_filterFloorplans();
    f_HandleNoUnitsFloorplans();
}

function f_setLeasingUrls() {
    $.each(onlineLeasingUrls, function (i, v) {
        if (partnerName.toLowerCase() == 'onsite') {
            onlineLeasingUrlsTable[v.SiteId] = {
                href: 'javascript:f_onlineLeasing(\'' + 'https://www.on-site.com/apply/property/\'' + ',\'PartnerUnitId\',\'MoveInDate\',false,\'UnitPartnerPropertyId\',\'onsite\');',
                text: overrideLeaseNowText ? overrideLeaseNowText : 'Lease Now'
            }
        } else if (overrideSaveQuote.toLowerCase() == 'true') {
            onlineLeasingUrlsTable[v.SiteId] = { href: 'javascript:f_showSaveQuote(\'lsUnitId\',\'MoveInDate\')', text: 'Save Quote' };
        } else if (v.Url) {
            if (v.Url.toLowerCase().indexOf('onesite') > -1 || v.Url.toLowerCase().indexOf('crossfire') > -1 || skipStepsEnabled.toLowerCase() == 'true') {
                if (!isOllSupportedDevice && ollVersion.toLowerCase() != 'ollr') {
                    onlineLeasingUrlsTable[v.SiteId] = { href: 'javascript:f_showSaveQuote(\'lsUnitId\',\'MoveInDate\')', text: 'Save Quote' };
                } else {
                    onlineLeasingUrlsTable[v.SiteId] = {
                        href: 'javascript:f_onlineLeasing(\'' + v.Url + '\',\'PartnerUnitId\',\'MoveInDate\',false,\'UnitPartnerPropertyId\',\'onesite\');',
                        text: (overrideLeaseNowText ? overrideLeaseNowText : 'Lease Now')
                    };
                    $('#divOnlineLeasingLogin').show();
                    if (thirdPartyLeasingUrl) {
                        var url = thirdPartyLeasingUrl + '?siteid=' + partnerPropertyId + '&SearchUrl=' + document.referrer + '&rp-oll-page=login';
                        $('#divOnlineLeasingLogin a').attr('href', ('javascript:window.parent.postMessage("' + url + '", "*");'));
                    } else {
                        var searchUrl = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + window.location.pathname;
                        if (onlineLeasingUrls.length > 1) {
                            $('#divOnlineLeasingLogin a').attr('onclick', 'javascript:f_showPhaseLinkModal()');
                            var phaseLink = $('<a></a>');
                            phaseLink.attr('href', (skipStepsEnabled.toLowerCase() == 'true') ? ('OnlineLeasing.aspx?siteid=' + v.PartnerPropertyId + '&SearchUrl=' + window.location.href.toString() + '&rp-oll-page=login' +
                                (matchedSource ? '&oll-source-attribution=' + matchedSource : '')) : (v.Url));
                            phaseLink.html($('#fp2-phase-select option[value="' + v.SiteId + '"]').html());
                            $('.floorplan-oll-phases-container ul').append($('<li></li>').append(phaseLink));
                        } else
                            $('#divOnlineLeasingLogin a').attr('href', ((skipStepsEnabled.toLowerCase() == 'true') ? ('OnlineLeasing.aspx?siteid=' + partnerPropertyId + '&SearchUrl=' + searchUrl + '&rp-oll-page=login' +
                                (matchedSource ? '&oll-source-attribution=' + matchedSource : '')) : (v.Url)));
                    }
                }
            } else {
                onlineLeasingUrlsTable[v.SiteId] = { href: bMRedirect != "false" ? 'javascript:f_doBmPost();' : v.Url, text: overrideLeaseNowText ? overrideLeaseNowText : 'Apply Now' };
            }
        } else {
            var contactUrl;
            if (bMRedirect != "false")
                contactUrl = 'javascript:f_doBmPost();';
            else {
                contactUrl = thirdPartyContactUrl ? thirdPartyContactUrl : 'Contact.aspx';
                if (f_isInIframe())
                    contactUrl = 'javascript:window.parent.postMessage(\'' + contactUrl + '\', \'*\');';
            }
            onlineLeasingUrlsTable[v.SiteId] = { href: contactUrl, text: overrideLeaseNowText ? overrideLeaseNowText : 'Inquire' };
        }
    });

  
}



function f_doBmPost() {
    var existingAction = $('#form').attr('action');
    var existingTarget = $('#form').attr('target');
    $('#form').attr('action', 'https://www.bluemoon.com/rentalapp/index.php').
        attr('target', '_blank').
        submit();

    // replace original action and target so normal posts still work as expected
    $('#form').attr('action', existingAction);
    if (existingTarget)
        $('#form').attr('target', existingTarget);
    else
        $('#form').removeAttr('target');
}

function f_showPhaseLinkModal() {
    $('#dialog-overlay').show();
    $('#floorplan-oll-phases-modal').show();
}

function f_buildFlexSlider() {

    $('.fp-flexslider').flexslider({
        animation: "slide",
        controlNav: false,
        slideshow: false,
        start: function (slider) {
            $('body').removeClass('loading');
        }
    });
}

function f_showAmenitiesDialog(id) {
    $("#dialog-overlay").show();
    $("#amenities-popup-lightbox_" + id).fadeIn(300);
}

function f_hideAmenitiesDialog() {
    $("#overlay").hide();
    $("#dialog-overlay").hide();
    $(".amenities-popup-lightbox").fadeOut(300);
}

function f_isInIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

function f_unitShowHide(e) {
    var isIframe = f_isInIframe();
    if (e.target.innerHTML == overrideContactUsText) {
        if (bMRedirect != "false" && (!selectedLeasingUrl || (skipStepsEnabled.toLowerCase() != 'true' && selectedLeasingUrl.toLowerCase().indexOf('onesite') == -1 && selectedLeasingUrl.toLowerCase().indexOf('crossfire') == -1))) {
            f_doBmPost();
        }
        else {
            var contactUrl;
            if (studentProperty.toLowerCase() == 'true')
                contactUrl = '/OnlineLeasing.aspx?siteid=' + partnerPropertyId + (matchedSource ? '&oll-source-attribution=' + matchedSource : '') + '&SearchUrl=' + window.location.href.toString();
            else
                contactUrl = thirdPartyContactUrl ? thirdPartyContactUrl : 'Contact.aspx';
            if (isIframe)
                window.parent.postMessage(contactUrl, "*");
            else
                window.location.href = contactUrl;
        }
        return;
    }
    var id = e.target.id.substr(15);
    if ($('#par_' + id).is(':visible')) {
        $(e.target).text('See Available Units');
        $('#par_' + id).hide();
        if (isIframe)
            window.parent.postMessage($('html').height(), "*");
    }
    else {
        if (id) {
            $(e.target).text("Close");
            $('#par_' + id).show();
        }
        if (isIframe)
            window.parent.postMessage($('html').height(), "*");
    }
}

function f_clearFilters() {
    selectedBed = selectedBath = "all";
    $('.fp2-bed-select li.active').removeClass('active');
    $('.fp2-bath-select li.active').removeClass('active');
    $('.fp2-bed-select li').first().addClass('active');
    $('.fp2-bath-select li').first().addClass('active');
    if (useFloors.toLowerCase() == 'true') {
        $('#fp2-floor-slider').slider("values", 0, $('#fp2-floor-slider').slider('option', 'min'));
        $('#fp2-floor-slider').slider("values", 1, $('#fp2-floor-slider').slider('option', 'max'));
    }
    $('.fp2-min-rent').val('');
    $('.fp2-max-rent').val('');
    $('#fp2-move-in-input').datepicker("option", "setDate", new Date());
    $('#fp2-move-in-input').val($.datepicker.formatDate((internationalProperty == 'true' ? 'dd/mm/yy' : 'mm/dd/yy'), new Date()));
    isFloorSliderModified = false;
    f_filterFloorplans();
    f_moveInDateChanged();
}

function f_formatdateMMDDYYYY(date) {
    var str = date.substring(0, 10);
    var splits = str.split('-');

    return splits[1] + '/' + splits[2] + '/' + splits[0];
}

function f_formatdateYYYYMMDD(date) {
    var str = date.substring(0, 10);
    var splits = str.split('index.html');

    return splits[2] + '-' + splits[0] + '-' + splits[1];
}

function f_formatdateYYYYDDMM(date) {
    var str = date.substring(0, 10);
    var splits = str.split('index.html');

    return splits[2] + '-' + splits[1] + '-' + splits[0];
}

function f_moveInDateChanged() {
    var date = (internationalProperty == 'true' ? f_formatdateYYYYDDMM($('#fp2-move-in-input').val()) : f_formatdateYYYYMMDD($('#fp2-move-in-input').val()));
    f_getUnits(date);
}

function f_rentTextChanged() {
    f_setInitialUnitsData();
    f_filterFloorplans();
    f_HandleNoUnitsFloorplans();
}


function f_floorSliderChanged(event, ui) {
    isFloorSliderModified = true;
    $('#fp2-floors').html('(' + ui.values[0] + ' - ' + ui.values[1] + ')');
    f_setInitialUnitsData();
    f_filterFloorplans();
    f_HandleNoUnitsFloorplans();
}

function f_filterUnits() {
    var units = [];
    var bhideFloorplansPricing = $('.fp2-rent-range').length == 0;
    var minRent = bhideFloorplansPricing ? 0 : ($('.fp2-min-rent').val() == '' ? 0 : $('.fp2-min-rent').val().substring(1).replace(/,/g, ''));
    var maxRent = bhideFloorplansPricing ? Number.MAX_VALUE : ($('.fp2-max-rent').val() == '' ? Number.MAX_VALUE : $('.fp2-max-rent').val().substring(1).replace(/,/g, ''));
    var filterByfloor = $('#fp2-floor-slider').length > 0;
    var minFloor = filterByfloor ? $('#fp2-floor-slider').slider("option", "values")[0] : 0;
    var maxFloor = filterByfloor ? $('#fp2-floor-slider').slider("option", "values")[1] : Number.MAX_VALUE;

    var availabilityType = $('input[name="availability"]:checked').val();
    if (!availabilityType) {
        availabilityType = "all";
        $('input[value="all"]').attr('checked', 'checked');
    }
    var moveInDate = new Date($('#fp2-move-in-input').val());
    var flexDays = parseInt($('#fp2-flex-days').val());
    if (isNaN(flexDays))
        flexDays = 0;
    var flexDate = new Date($('#fp2-move-in-input').val());
    flexDate = new Date(flexDate.setDate(moveInDate.getDate() + flexDays));

    $.each(unitsData, function (i, u) {
        var unitVacantDate = new Date(u.vacantDate.substring(5, 7) + "/" + u.vacantDate.substring(8, 10) + "/" + u.vacantDate.substring(0, 4));

        if (u.rent >= minRent && u.rent <= maxRent &&
               u.floorNumber >= minFloor && u.floorNumber <= maxFloor && 
                ((availabilityType == "all") || (availabilityType == "date" && unitVacantDate <= moveInDate) || 
                (availabilityType == "flex" && ((unitVacantDate <= flexDate)))))
            units.push(u);
    });
    return units;
}

function f_filterFloorplans() {
    var bhideFloorplansPricing = $('.fp2-rent-range').length == 0;
    var minRent = bhideFloorplansPricing ? 0 : ($('.fp2-min-rent').val() == '' ? 0 : $('.fp2-min-rent').val().substring(1).replace(/,/g, ''));
    var maxRent = bhideFloorplansPricing ? Number.MAX_VALUE : ($('.fp2-max-rent').val() == '' ? Number.MAX_VALUE : $('.fp2-max-rent').val().substring(1).replace(/,/g, ''));
    $.each($('.floorplan-block'), function(i, f) {
        var minimumMarketRent = 0;
        var maximumMarketRent = Number.MAX_VALUE;
        $.each($('#' + f.id + ' meta'), function(j, m) {
            if (m.name == 'minimumMarketRent')
                minimumMarketRent = Number(m.content);
            if (m.name == 'maximumMarketRent')
                maximumMarketRent = Number(m.content);
        });
        if (selectedBed == "all" && selectedBath == "all" && maximumMarketRent > minRent && minimumMarketRent < maxRent) {
            $(f).show();
            $(f).addClass('filtered-in');
        } else if (maximumMarketRent < minRent || minimumMarketRent > maxRent ||
        ((selectedBed == "0" ? $(f).data('bed') != 'S' : selectedBed == "3" ? $(f).data('bed') < "3" || $(f).data('bed') == 'S' : selectedBed != "all" && selectedBed != $(f).data('bed'))) ||
        ((selectedBath == "3" ? $(f).data('bath') < "3" : selectedBath != "all" && selectedBath != $(f).data('bath')))) {
            $(f).hide();
            $(f).removeClass('filtered-in');
        } else {
            $(f).show();
            $(f).addClass('filtered-in');
        }
    });
    $('#numFilteredUnits').html($('.floorplan-block:visible').length);

    if ($('#fp2-show-available-only').is(':checked'))
        f_showAvailableOnly(true);
    else
        f_sortFloorplans($('#fp2-sort-select').val());
}

function f_createPagination() {
    $('.div-list-pagination-top').remove();
    $('.div-list-pagination-bot').remove();
    $('.floorplan-block').attr('data-page', '');
    var pageNum = (floorplansPerPage == '1' ? 0 : 1);

    if (floorplansPerPage == '0')
        return;
    else {
        $('.floorplan-block:visible').each(function(i, v) {
            if (floorplansPerPage == '1' || (i + 1 > floorplansPerPage && (i + 1) % floorplansPerPage == 1))
                pageNum++;
            $(v).attr('data-page', pageNum);
        });

        if (pageNum > 1) {
            var botPaginationHtml = '<div class="div-list-pagination-bot"><ul class="list-pagination-bot list-pagination"><li><a aria-label="Previous"" id="previous-page" onclick="f_previousPage();"><span aria-hidden="true">&laquo; Prev</span></a></li>';
            var topPaginationHtml = '<div class="div-list-pagination-top"><ul class="list-pagination-top list-pagination"><li><a aria-label="Previous"" id="previous-page" onclick="f_previousPage();"><span aria-hidden="true">&laquo; Prev</span></a></li>';
            for (var i = 1; i <= pageNum; i++) {
                botPaginationHtml += '<li class="page-numbers" data-page="' + i + '"><a onclick="f_loadPage(' + i + ')">' + i + '</a></li>';
                topPaginationHtml += '<li class="page-numbers" data-page="' + i + '"><a onclick="f_loadPage(' + i + ')">' + i + '</a></li>';
            }
            botPaginationHtml += '<li><a aria-label="Next"" id=""next-page" onclick="f_nextPage();"><span aria-hidden=""true"">Next &raquo; </span></a></li></ul></div>';
            topPaginationHtml += '<li><a aria-label="Next"" id=""next-page" onclick="f_nextPage();"><span aria-hidden=""true"">Next &raquo; </span></a></li></ul></div>';
            $('#contentarea').append(botPaginationHtml);
            $('#contentarea').prepend(topPaginationHtml);
            f_loadPage('1');
        }
    }
    if ($('#divOnlineLeasingLogin').is(':hidden') && $('.fp-switch-tabs button').length == 0)
        $('.div-list-pagination-top').addClass('pagination-oll-ism-hidden');
}

function f_loadPage(pageNum) {
    $('.floorplan-block').hide();
    $('.floorplan-block[data-page="' + pageNum + '"]').show();

    $('.list-pagination li').removeClass('active-page');
    $('.list-pagination li[data-page="' + pageNum + '"]').addClass('active-page');

    $('.list-pagination li').show();
    $('.list-pagination li').each(function(i, v) {
        if (parseInt($(v).attr('data-page')) > (parseInt(pageNum) + 3) || parseInt($(v).attr('data-page')) < (parseInt(pageNum) - 3))
            $(v).hide();
    });

    if ($('.floorplan-block[data-page="' + (parseInt(pageNum) + 1) + '"]').length == 0)
        $('.list-pagination li:last-child').hide();
    if ($('.floorplan-block[data-page="' + (parseInt(pageNum) - 1) + '"]').length == 0)
        $('.list-pagination li:first-child').hide();
    $('.flexslider').resize();
    document.body.scrollTop = $('#contentarea').offset().top;
}

function f_nextPage() {
    var currentPage = $('.floorplan-block:visible').first().attr('data-page');
    if ($('.floorplan-block[data-page="' + (parseInt(currentPage) + 1) + '"]').length > 0)
        f_loadPage(parseInt(currentPage) + 1);
}

function f_previousPage() {
    var currentPage = $('.floorplan-block:visible').first().attr('data-page');

    if ($('.floorplan-block[data-page="' + (parseInt(currentPage) - 1) + '"]').length > 0)
        f_loadPage(parseInt(currentPage) - 1);
}

function f_HandleNoUnitsFloorplans() {
    $.each($('.par-units'), function (i, t) {
        var buttonId = '#unit_show_hide_' + t.id.substring(4);
        if ((hideAvailability.toLowerCase() == 'true') || studentProperty.toLowerCase() == 'true' || $('#' + t.id + ' tr').length == 1) {
            $(buttonId).text(overrideContactUsText);
            $(t).hide();
        } else {
            $(buttonId).text('See Available Units');
        }
    });
}

function f_onlineLeasing(onlineLeasingUrl, unitPartnerId, moveInDate, dialogClicked, unitPartnerPropertyId, partnerName) {
    if (moveInDate.toLowerCase() == 'now')
        moveInDate = $('#fp2-move-in-input').val();
    else if (Date.parse($('#fp2-move-in-input').val()) > Date.parse(moveInDate))
        moveInDate = $('#fp2-move-in-input').val();
    else if (!dialogClicked) {
        $('.movein-date-proceed').attr('onclick', 'f_onlineLeasing(\'' + onlineLeasingUrl + '\', ' + unitPartnerId + ', \'' + moveInDate + '\', true, ' + unitPartnerPropertyId + ', \'' + partnerName + '\')');
        $('.movein-text').remove();
        $('.movein-header').prepend('<div class="movein-text">The unit selected is available on <b>' + moveInDate + '</b> while your selected Move In Date is <b>' + $('#fp2-move-in-input').val() +
            '</b>. <br /> <br />Would you still like to proceed to Online Leasing with a Move In Date of <b>' + moveInDate + '</b>?');
        $('#movein-date-dialog').show();
        $('.dialog-overlay').show();
        return;
    }

    var url;

    if (partnerName && partnerName.toLowerCase() == 'onsite') {
        url = onlineLeasingUrl + partnerPropertyId + '/unit/' + unitPartnerId + '?lease_start_date=' + moveInDate;
    } else {
    if (thirdPartyLeasingUrl) {
        url = thirdPartyLeasingUrl + '?siteid=' + unitPartnerPropertyId;
        url += '&MoveInDate=' + moveInDate + '&LeaseTerm=12';
        if (unitPartnerId != '')
            url += '&UnitId=' + unitPartnerId;
        url += '&SearchUrl=' + document.referrer;
        window.parent.postMessage(url, "*");
        } else {
            if (skipStepsEnabled.toLowerCase() == "true") { //skip steps are enabled 
            url = 'OnlineLeasing.aspx?siteid=' + unitPartnerPropertyId;
            url += '&MoveInDate=' + moveInDate + '&LeaseTerm=12';
            if (unitPartnerId != '') {
                url += '&UnitId=' + unitPartnerId;
            }
            } else {
            url = onlineLeasingUrl + '&dateneeded=' + moveInDate + '&leaseterm=12';
            if (unitPartnerId != '') {
                url += '&unitId=' + unitPartnerId;
            }
        }
        if (matchedSource)
            url += '&oll-source-attribution=' + matchedSource;
        url += '&SearchUrl=' + window.location.href.toString();
        }
    }
        window.location.href = url;
    }

function f_printClickHandler(floorplanName, siteId, floorplanId, originalFpName) {
    f_analyticsSendEvent('floorplans', 'click-floorplan-brochure', originalFpName + '-' + floorplanId);
    var url = 'Brochure/' + floorplanName + '?siteId=' + siteId;
    window.open(url, 'printElementWindow', 'width=710,height=715,scrollbars=yes');
    return false;
}

function f_showSaveQuote(lsUnitId, moveInDate) {
    $.each(unitsData, function (i, u) {
        if (u.id == lsUnitId) {

            if (moveInDate.toLowerCase() == 'now') {
                if (internationalProperty == 'true')
                    moveInDate = f_todayDDMMYYYY();
                else
                    moveInDate = f_todayMMDDYYYY();
            }

            var date = u.vacantDate.substring(0, 10);
            var year = date.substr(0, 4);
            var month = date.substr(5, 2);
            var day = date.substr(8, 2);

            $('#hidUnitId').val(u.id);
            $('#hidPropertyId').val(u.siteId);
            $('#hidBaseRent').val(u.rent);
            $('#spnFloorplan').html($('#floorplan_' + u.floorplanId + ' h2').html());
            $('#spnUnit').html(u.unitNumber);
            $('#spnBeds').html(u.numberOfBeds);
            $('#spnBath').html(u.numberOfBaths);
            $('#spnSqft').html(u.squareFeet);
            $('#datepicker2').datepicker(
                {
                    minDate: new Date(year, month, day),
                    dateFormat: (internationalProperty == 'true' ? "dd/mm/yy" : "mm/dd/yy"),
                    maxDate: (maxMoveInDateDays > 0 ? maxMoveInDateDays : null),
                });
            $('#datepicker2').val(moveInDate);
            $('.page_fp_quote input').focus(function () {
                if ($(this).val() == $(this).attr("title")) {
                    $(this).val("");
                }
            }).blur(function () {
                if ($(this).val() == "") {
                    $(this).val($(this).attr("title"));
                }
            });
            f_saveQuotemoveInDateChanged();
            $('#page_fp_quote').removeClass('layer1');
            $('#page_fp_success_message').addClass('layer1');
            $('#page_fp_quote').show();
            f_showSaveQuoteDialog(true);
            return false;
        }
    });
}

function f_addDay(date) {
    var thisDay = new Date(date.replace('-', 'index.html'));
    var nextDay = new Date();
    nextDay.setDate(thisDay + 1);
    var dd = nextDay.getDate();
    var mm = nextDay.getMonth() + 1;
    var yyyy = nextDay.getFullYear();

    return yyyy + '-' + (mm < 10 ? '0' : '') + mm + '-' + (dd < 10 ? '0' : '') + dd;
}

function f_todayMMDDYYYY() {
    var today = new Date(new Date().getTime());
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();

    return (mm < 10 ? '0' : '') + mm + '/' + (dd < 10 ? '0' : '') + dd + '/' + yyyy;
}

function f_todayDDMMYYYY() {
    var today = new Date(new Date().getTime());
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();

    return (dd < 10 ? '0' : '') + dd + '/' + (mm < 10 ? '0' : '') + mm + '/' + yyyy;
}

function f_doZoom(id, startAtUrl, mediaId) {
    $("#dialog-overlay").show();
    $('#floorplan-zoom .floorplan-zoom-container').append('<div id="fp-zoom" class="flexslider flex-zoom"><ul class="slides"></ul></div>');
    var startAtInt;
    var temp = 0;

    $('#floorplan_' + id + ' .img_area li').not('.clone').find('img').each(function (i, img) {
        if (startAtUrl == img.src)
            startAtInt = temp;


        //var containerWidth = 700;
        var containerWidth = Math.floor(Math.min(700, window.innerWidth, window.innerHeight));
        var imgWidth = $(img).data("maxwidth");
        var imgHeight = $(img).data("maxheight");
        if (!imgWidth)
            imgWidth = containerWidth.toString();
        if (!imgHeight)
            imgHeight = containerWidth.toString();
        imgWidth = parseInt(imgWidth);
        imgHeight = parseInt(imgHeight);
        if (isNaN(imgWidth))
            imgWidth = containerWidth;
        if (isNaN(imgHeight))
            imgHeight = containerWidth;

        var imgSizeString = '';
        var aspectRatio = imgWidth / imgHeight;

        if (imgWidth > imgHeight)
            imgSizeString = containerWidth.toString() + 'x0';
        else
            imgSizeString = '0x' + containerWidth.toString();

        var calculatedImageHeight = containerWidth / aspectRatio;
        var topMargin = 'inherit';
        if (calculatedImageHeight < containerWidth) {
            topMargin = (Math.round((containerWidth - calculatedImageHeight) / 2)).toString() + 'px';
            //topMargin = (Math.round((containerWidth - calculatedImageHeight) / 2));
            //topMargin = ((topMargin / $('#fp-zoom').height())*100).toString() + '%';
        }

        $('.floorplan-zoom-header').html($('#floorplan_' + id + ' h2').html() + '<a href="#" onclick="f_hideAllModals(); return false;" class="close-modal-button">x</a>');

        $('#fp-zoom ul.slides').append('<li style="margin-top:' + topMargin + ';"><img src="' + img.src.replace('406x308', imgSizeString) + '" /></li>');
        $('#floorplan-zoom').css('max-width', (containerWidth).toString() + 'px').
            css('width', (containerWidth).toString());
            //.css('max-height', (containerWidth).toString() + 'px').
            //css('height', (containerWidth).toString() + 'px');
        $('#floorplan-zoom .flexslider').css('height', (containerWidth).toString() + 'px');
        $('#floorplan-zoom .flexslider').css('width', (containerWidth).toString() + 'px');
        temp++;
    });
    
    $('#floorplan-zoom').show();
    $('#fp-zoom').flexslider({
        animation: "slide",
        slideshow: false,
        controlNav: false,
        startAt: startAtInt
    });

    f_analyticsSendEvent('floorplans', 'click-floorplan-image', mediaId);
}

function f_sendImageClickEvent(mediaId) {
    f_analyticsSendEvent('floorplans', 'click-floorplan-image', mediaId);
}

function f_reorderFloorplans(e) {
    e.each(function () {
        $(this).appendTo($('#floorplan-container'));
    });
}

function f_sortFloorplans(value) {
    $('.filtered-in').show();

    switch (value) {
        case "rent":
            f_reorderFloorplans($('.filtered-in').sort(function (a, b) {
                if ($(b).data('rent')) {
                    if (parseInt($(a).data("rent")) > parseInt($(b).data("rent")))
                        return 1;
                    else
                        return -1;
                }
                return 0;
            }));
            break;

        case "name":
            f_reorderFloorplans($('.filtered-in').sort(function (a, b) {
                if ($(b).data('floorplan-name')) {
                    if ($(a).data("floorplan-name").toLowerCase() > $(b).data("floorplan-name").toLowerCase())
                        return 1;
                    else
                        return -1;
                }
                return 0;
            }));
            break;

        case "sqft":
            f_reorderFloorplans($('.filtered-in').sort(function (a, b) {
                if ($(b).data('sqft')) {
                    if ($(a).data("sqft") > $(b).data("sqft"))
                        return 1;
                    else
                        return -1;
                }
                return 0;
            }));
            break;
            
        default:
            return;
            break;
    }
    if ($('#checkboxShowAvailableOnly').is(':checked'))
        f_showAvailableOnly(true);
    else
        f_createPagination();
}

function f_showAvailableOnly(b) {
    $('.filtered-in').show();
    if (b) {
        $('.floorplan-block').each(function (i, u) {
            if ($(u).find('.par-units').children().children().length <= 1)
                $(u).hide();
        });
    }
    else {
        $('.floorplan-block').each(function (i, u) {
            $(u).show();
        });
    }
    $('#numFilteredUnits').html($('.floorplan-block:visible').length);
    f_createPagination();
}

function commaSeparateNumber(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
        val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
        }
    return val;
}

function f_validateRequiredFields() {
    var error = 0;
    var foxusset = false;
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    var f = $('#txtFirst');
    try {
        if (f.val() == f.attr("title")) {
            f.css('border', '1px solid red');
            f.focus();
            foxusset = true;
            error++;
        } else {
            f.css('border', 'none');
        }
    } catch (e) { }

    try {
        f = $('#txtLast');
        if (f.val() == f.attr("title")) {
            f.css('border', '1px solid red');
            if (!foxusset) {
                f.focus();
                foxusset = true;
            }
            error++;
        } else {
            f.css('border', 'none');
        }
    } catch (e) { }

    try {
        f = $('#txtEmail');
        if (f.val() == f.attr("title")) {
            f.css('border', '1px solid red');
            if (!foxusset) {
                f.focus();
                foxusset = true;
            }
            error++;
        }
        else if (f.val() != f.attr("title")) {
            if (reg.test(f.val()) == false) {
                f.css('border', '1px solid red');
                if (!foxusset) {
                    f.focus();
                    foxusset = true;
                }
                error++;
            }
        } else {
            f.css('border', 'none');
        }
    } catch (e) { }
    try {
        f = $('#txtPhone');
        if (f.val() == f.attr("title")) {
            f.css('border', '1px solid red');
            if (!foxusset) {
                f.focus();
            }
            error++;
        } else {
            f.css('border', 'none');
        }
    } catch (e) { }
    return (error == 0);
}

var rentPerLeaseTerm = null;
var endLeaseTermPerLeaseTerm = null;

function f_getUnits(date) {
    var counter = 0;
    unitsData = [];
    $.each(onlineLeasingUrls, function (i, v) {
        if (v.IsSelectedSite) {
            var leaseTermQueryString = '';
            if (leaseTermDetails && leaseTermDetails.leaseTerms && $('#fp2-lease-term-select').val() == 'bestprice') {
                leaseTermQueryString += '&bestprice=true';
                $(leaseTermDetails.leaseTerms).each(function (i, v) {
                    leaseTermQueryString += '&leaseterm=' + v;
                });
            } else
                leaseTermQueryString = '&leaseterm=' + $('#fp2-lease-term-select').val();

            var url = 'CmsSiteManager/callback.aspx?act=Proxy/GetUnits&available=true&honordisplayorder=true&siteid=' + v.SiteId + leaseTermQueryString;
            if (date)
                url += '&dateneeded=' + date;
            $.ajax({
                type: 'GET',
                url: url,
                dataType: 'jsonp',
                success: function (uData) {
                    counter++;
                    f_getUnitsDone(uData, (counter == onlineLeasingUrls.length));
                }
            });
        }
        else
            counter++;
    });
}

function f_setInitialUnitsData() {
    $(".par-units").html('<tr>' +
                                    '<th scope="col">Unit</th>' +
                                    (showBuildingName ? '<th scope="col">Bldg</th>' : '') +
                                    '<th scope="col">Sqft</th>' +
                                    '<th scope="col">Available</th>' +
                                    ((hidePrices.toLowerCase() == 'true') ? '' : '<th scope="col">Rent</th>') +
                                    '<th scope="col">Lease Term</th>' +
                                    '<th width="170" scope="col" style="font-weight:normal;">' +
                                    '</th>' +
                                '</tr>');

    var units = f_filterUnits();
    var floorplanUnitCountArr = {};
    var floorplanMinMaxRentArr = {};
    var maxUnit = 0;
    $.each(units, function (i, u) {
        //display only the number of units set by the client
        maxUnit = Number($('#floorplan_' + u.floorplanId).data('numunits'));
        if (floorplanUnitCountArr[u.floorplanId] == null)
            floorplanUnitCountArr[u.floorplanId] = 1;
        else
            floorplanUnitCountArr[u.floorplanId]++;
        if (floorplanUnitCountArr[u.floorplanId] > maxUnit) return;
        var availability = '';
        if (u.leaseStatus == 'AVAILABLE_READY') {
            availability = 'NOW';
        }
        if (u.vacantDate) {
            var date = u.vacantDate.substring(0, 10);
            var year = date.substr(0, 4);
            var month = date.substr(5, 2);
            var day = date.substr(8, 2);
            var vacantDate = year + '-' + month + '-' + day;
            var today = f_todayYYYYMMDD();
            if (u.leaseStatus == 'OCCUPIED_ON_NOTICE' ||
                u.leaseStatus == 'AVAILABLE_NOT_READY' ||
                vacantDate > today) {
                if(internationalProperty == 'true')
                    availability = day + '/' + month + '/' + year;
                else
                    availability = month + '/' + day + '/' + year;
            }
        }
        if (floorplanMinMaxRentArr[u.floorplanId] == null) {
            floorplanMinMaxRentArr[u.floorplanId] = { minRent: 0, maxRent: 0 };
        }
        if (u.rent < floorplanMinMaxRentArr[u.floorplanId].minRent || (u.rent > 0 && floorplanMinMaxRentArr[u.floorplanId].minRent == 0))
            floorplanMinMaxRentArr[u.floorplanId].minRent = u.rent;
        if (u.rent > floorplanMinMaxRentArr[u.floorplanId].maxRent)
            floorplanMinMaxRentArr[u.floorplanId].maxRent = u.rent;
        $('#par_' + u.floorplanId).append('<tr id="tr_' + u.id + '">' +
                                                                '<td scope="col">' + u.unitNumber + '</td>' +
                                                                (showBuildingName ? '<td scope="col">' + u.buildingName + '</td>' : '') +
                                                                '<td scope="col">' + u.squareFeet + '</td>' +
                                                                '<td scope="col">' + availability + '</td>' +
                                                                ((hidePrices.toLowerCase() == 'true') ? '' : '<td scope="col">' + ($('#fp2-lease-term-select').val() == 'bestprice' ? '<label class="starting-label">Starting At: </label>' : '')
                                                                + currencySymbol + u.rent + '</td>') +
                                                                '<td scope="col">' + (u.minLeaseTermInMonth ? u.minLeaseTermInMonth : '') + '</td>' +
                                                                '<td scope="col"><a href="' + onlineLeasingUrlsTable[u.propertyId].href.replace('PartnerUnitId', u.unitPartnerId).replace('MoveInDate', availability).replace('lsUnitId', 
                                                                    u.id).replace('UnitPartnerPropertyId', u.partnerPropertyId) + '" class="button_2">' + onlineLeasingUrlsTable[u.propertyId].text + '</a></td>' +
                                                            '</tr>');
    });

    if (dynamicRentRange == 'true' && hideFloorplansPricing != 'true') {
        $('.floorplan-block').each(function () {
            var floorplanId = $(this).prop('id').substring(10);
            if (floorplanMinMaxRentArr[floorplanId] == null)
                floorplanMinMaxRentArr[floorplanId] = { minRent: 0, maxRent: 0 };
            $('#fp_' + floorplanId + '_range').parent().remove();

            $('#floorplan_' + floorplanId + ' .specification ul').append('<li>price range <br> <strong id="fp_' + floorplanId + '_range">' +
                (floorplanMinMaxRentArr[floorplanId].minRent != 0 && floorplanMinMaxRentArr[floorplanId].maxRent != 0 ? (floorplanMinMaxRentArr[floorplanId].minRent == floorplanMinMaxRentArr[floorplanId].maxRent ?
                '$' + floorplanMinMaxRentArr[floorplanId].minRent : '$' + floorplanMinMaxRentArr[floorplanId].minRent + ' - $' + floorplanMinMaxRentArr[floorplanId].maxRent) : (floorplanRentRanges[floorplanId] ? floorplanRentRanges[floorplanId] : '')) + '</strong></li>');
        });
    }
}

function f_saveQuotemoveInDateChanged() {
    var availabilityDate;
    if ($('#datepicker2').val().indexOf('index.html') > -1) {
        var splitDate = $('#datepicker2').val().split('index.html');
        if (internationalProperty == 'true')
            availabilityDate = splitDate[2] + '-' + splitDate[1] + '-' + splitDate[0];
        else
            availabilityDate = splitDate[2] + '-' + splitDate[0] + '-' + splitDate[1];
    } else {
        availabilityDate = $('#datepicker2').val();
    }

    $.ajax({
        type: "GET",
        dataType: "json",
        cache: false, 
        url: 'CmsSiteManager/callback.aspx?act=Proxy/GetRentMatrix&unitid=' + $('#hidUnitId').val() + '&neededbydate=' + availabilityDate,
        success: function (json) {
            var rentMatrixForDate = [];
            for (var i = 0; i < 10; i++) {
                rentMatrixForDate = f_getRentMatrixDate(availabilityDate, json.rentOptionList);
                if (rentMatrixForDate.length > 0) break;
                availabilityDate = f_addDay(availabilityDate);
            }
            if (rentMatrixForDate.length == 0) return;
            var radiobuttons = [];
            rentPerLeaseTerm = [];
            endLeaseTermPerLeaseTerm = [];
            $('#radioLeaseTerm').html('');

            if (rentMatrixForDate.length > 0) {
                $.each(rentMatrixForDate, function (j, r) {
                    if (r.leaseStartDate == availabilityDate) {
                        radiobuttons.push({
                            id: r.leaseTerm, htmlStr: '<input type="radio" name="group1" ' + ((r.leaseTerm == 12) ? 'checked' : '') + ' value="' + r.leaseTerm + '"> '
                                + currencySymbol + r.rent + '/mo. for ' + r.leaseTerm + '-mo.</input><br>'
                        });
                        radiobuttons.sort(function (a, b) {
                            if (a.id < b.id)
                                return -1;
                            if (a.id > b.id)
                                return 1;
                            return 0;
                        });
                        rentPerLeaseTerm[r.leaseTerm] = r.rent;
                        endLeaseTermPerLeaseTerm[r.leaseTerm] = r.leaseEndDate;
                    }
                });
            }
            else {
                radiobuttons.push({ id: 12, htmlStr: '<input type="radio" name="group1" checked value="12"> ' + currencySymbol + $('#hidBaseRent').val() + '/mo. for 12-mo.</input><br>' });
                rentPerLeaseTerm[12] = $('#hidBaseRent').val();
                endLeaseTermPerLeaseTerm[12] = f_12monthLeaseEnd();
            }
            if (radiobuttons.length != 0) {
                $.each(radiobuttons, function (j, o) {
                    $('#radioLeaseTerm').append(o.htmlStr);
                });
            }
        }
    });
}

function f_getRentMatrixDate(availabilityDate, rentMatrix) {
    var rentMatrixForDate = [];
    if (rentMatrix && rentMatrix.length > 0)
        $.each(rentMatrix, function (i, r) {
            if (r.leaseStartDate == availabilityDate)
                rentMatrixForDate.push(r);
        });
    return rentMatrixForDate;
}

function f_saveQuote() {
    if (!f_validateRequiredFields()) return;
    var leaseTerm = $('input[name=group1]:checked').val();
    $('#page_fp_quote').addClass('layer1');
    $('#page_fp_success_message h3').html('Submitting Quote. Please Wait...');
    $('#page_fp_success_message').removeClass('layer1');
    $('#page_fp_success_message').show();
    $.ajax({
        type: "POST",
        dataType: "jsonp",
        cache: false,
        url: "CMSSiteManager/Callback.aspx?act=save_quote",
        data: {
            lcid: 4,
            pid: propertyId,
            movedate: $('#datepicker2').val(),
            email: $('#txtEmail').val(),
            firstname: $('#txtFirst').val(),
            lastname: $('#txtLast').val(),
            dayPhone1: $('#txtPhone').val(),
            unitId: $('#hidUnitId').val(),
            rent: rentPerLeaseTerm[leaseTerm],
            leaseTerm: leaseTerm,
            leaseEndDate: endLeaseTermPerLeaseTerm[leaseTerm],
        },
        success: function (json) {
            $('#page_fp_success_message h3').html('Inquiry Sent Successfully!');
            $("#save-quote-overlay").show();
            $("#save-quote-lightbox").fadeIn(300);
            $('#page_fp_success_message').show();
            try {
                ga('set', { 'dimension15': json.LsLeaseId });
                if (json.L2LQuoteId != 0)
                    ga('set', { 'dimension16': json.L2LQuoteId });
                if (json.L2LLeadId != 0)
                    ga('set', { 'dimension17': json.L2LLeadId });
                f_analyticsSendEvent('Contact', 'Information Request', 'Thank you');
                ga('set', { 'dimension15': null, 'dimension16': null, 'dimension17': null });
            } catch (e) { }
            try {
                _gaq.push(['_trackEvent', 'Contact', 'Information Request', 'Thank you', , false]);
            } catch (e) { }
        }
    });
}

function quoteValidPhone(b) {
    var a = window.event ? b.keyCode : b.which;

    if ($('#txtPhone').val().length == 0 && b.shiftKey && b.keyCode == 43)
        return true;

    if (a == 0 || a == 8)
        return true;
    if (a > 47 && a < 58)
        return true;
    else
        return false;
}

function f_doOllRedirect(siteId) {
    if (window.location.hash && window.location.hash.toLowerCase() == '#rp-oll-page=login')
        window.location = '/OnlineLeasing.aspx?siteid=' + siteId + (matchedSource ? '&oll-source-attribution=' + matchedSource : '') + '&SearchUrl=' + window.location.href.toString();
}

$(function () {
    var fancybox3MainOptions = {
        idleTime: false,
        baseClass: 'fancybox3-engrained-viewer',
        margin: 0,
        infobar: false,
        touch: {
            vertical: 'auto'
        },
        buttons: [
          'close',
        ],
        animationEffect: false,
        clickSlide: false,
        clickOutside: false,
        closeClickOutside: false,
        transitionEffect: 'slide'
    }
    var modalItems = [];
    var fancybox3Options = $.extend({}, fancybox3MainOptions);
    modalItems.push({
        src: EngrainedUrl,
        type: 'iframe'
    })
    fancybox3Options.buttons = [
        'close',
    ];
    $('#engrainedMap').click(function (e) {
        e.preventDefault();
        $.fancybox3.open(modalItems, fancybox3Options);
        $('.fancybox3-title').text('Interactive Map');
    });
});