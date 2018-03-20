$(function(){
    $.fancybox3.defaults.loop = true;
    $.fancybox3.defaults.buttons = [ 'fullScreen', 'close' ];
    $.fancybox3.defaults.caption = function(instance, item){
            var caption = ($(this).attr('title') != '') ? $(this).attr('title') : '';
            return caption;
        };

    $.fancybox3.open(modalItems, fancybox3Options);

    var fancybox3MainOptions = {
        idleTime  : false,
        baseClass : 'fancybox3-media-viewer',
        margin    : 0,
        infobar   : false,
        thumbs    : {
            autoStart : true,
            hideOnClose : false
        },
        touch : {
            vertical  : 'auto'
        },
        btnTpl : {
            title : '<div class="fancybox3-title"></div>',
            availableUnits : '<button data-fancybox3-availableunits class="fancybox3-button fancybox3-availableunits" title="Available Units">Available Units</button>',
            contact : '<button data-fancybox3-contact class="fancybox3-button fancybox3-contact" title="Contact Us"><div class="fancybox3-mail"></div> Contact Us</button>',
        },
        buttons : [
            'title',
            'availableUnits',
            'contact',
            'slideShow',
            'fullScreen',
            'close',
        ],
        loop: true,
        animationEffect : false,
        clickSlide : false,
        clickOutside : false,
        closeClickOutside : false,
        transitionEffect  : 'slide'
    }

    if (typeof mvColor === 'undefined' || mvColor === null){
        mvColor = '#000';
    }

    var modalItems = [];
    var mvBtnHTML = '<div class="media-viewer-btn-container"><div class="media-viewer-btn"><svg xmlns="http://www.w3.org/2000/svg" id="_x33_d_logo" viewBox="0 0 120 120"><style>.st0{opacity:0.75;fill-rule:evenodd;clip-rule:evenodd;} .st1{fill-rule:evenodd;clip-rule:evenodd;fill:#FFFFFF;} .st2{fill-rule:evenodd;clip-rule:evenodd;fill:none;}</style><path d="M60.3 103.9c-21.4 0-38.8-17.4-38.8-38.8 0-.7 0-1.3.1-2 0-.2 0-.5.1-.7 0-.4.1-.8.1-1.3 0-.3.1-.6.1-.9 0-.4.1-.7.1-1.1 0-.3.1-.6.2-.9.1-.3.1-.6.2-1 .1-.3.2-.7.2-1 .1-.3.1-.6.2-.9.1-.4.2-.7.3-1 .1-.3.1-.5.2-.8.1-.4.2-.7.4-1.1.1-.2.2-.5.2-.7.1-.4.3-.8.4-1.1.1-.2.2-.4.2-.6.2-.4.3-.8.5-1.2.1-.2.2-.4.2-.5l.6-1.2c.1-.2.2-.3.2-.5.2-.4.5-.8.7-1.2.1-.1.1-.3.2-.4.3-.4.5-.8.8-1.3.1-.1.1-.2.2-.3.3-.4.6-.9.9-1.3.1-.1.1-.2.2-.2.3-.4.7-.9 1-1.3 0-.1.1-.1.1-.2.4-.4.7-.9 1.1-1.3l.1-.1c.4-.4.8-.9 1.2-1.3l.1-.1 1.3-1.3c7.1-6 16.1-9.8 26.1-9.9v10.3l12.4-8.4C87.9 33.4 99 48 99 65.2c0 21.4-17.3 38.7-38.7 38.7z" class="st0"/><path d="M55.6 68.3c-.4-.5-.9-.9-1.4-1.2-.5-.3-1.2-.6-1.8-.7v-.1c1.1-.3 2.1-.9 2.8-1.8.7-.9 1.1-2 1.1-3.3 0-1.1-.2-2.1-.7-2.9-.5-.8-1.1-1.5-1.9-2.1-.8-.6-1.6-1-2.6-1.2-1-.3-2-.4-3-.4s-1.9.1-2.8.4c-.9.3-1.8.6-2.5 1.1-.8.5-1.5 1.1-2 1.9-.6.7-1 1.6-1.3 2.6l5.1 1.2c.2-.8.6-1.4 1.1-1.9.6-.5 1.3-.7 2.1-.7s1.4.2 2 .7c.6.4.9 1.1.9 1.9 0 .6-.1 1-.3 1.4-.2.4-.5.6-.9.8-.4.2-.8.4-1.3.4-.5.1-1 .1-1.5.1H45v4h1.5c.6 0 1.1 0 1.7.1.6.1 1.1.3 1.5.5.4.2.8.5 1.1.9.3.4.4.9.4 1.5s-.1 1-.3 1.4c-.2.4-.5.7-.8.9-.3.2-.7.4-1.1.5-.4.1-.8.2-1.2.2-1.1 0-1.9-.3-2.6-.9-.7-.6-1.1-1.3-1.3-2L38.8 73c.3 1.1.8 2 1.4 2.8.6.8 1.3 1.4 2.2 1.9.8.5 1.7.9 2.7 1.1 1 .2 2 .4 3.1.4s2.1-.1 3.2-.4c1-.3 2-.7 2.8-1.4.8-.6 1.5-1.4 2-2.3.5-.9.8-2 .8-3.3 0-.7-.1-1.3-.3-1.9-.4-.6-.7-1.1-1.1-1.6zm24.5-7c-.8-1.5-1.8-2.7-3-3.6-1.2-.9-2.7-1.5-4.3-1.9-1.6-.4-3.2-.6-4.9-.6h-8.4v23.4h8.7c1.6 0 3.2-.2 4.7-.7 1.6-.5 3-1.2 4.2-2.1 1.2-1 2.2-2.2 3-3.7.8-1.5 1.1-3.3 1.1-5.3 0-2.2-.3-4-1.1-5.5zm-5.3 8.8c-.4.9-1 1.6-1.7 2.1s-1.5.9-2.5 1.1c-.9.2-1.9.3-2.9.3H65V60h2.8c1 0 1.9.1 2.8.3.9.2 1.7.6 2.4 1.1.7.5 1.3 1.2 1.7 2.1.4.9.6 2 .6 3.3.1 1.3-.1 2.4-.5 3.3z" class="st1"/><path d="M108.8 64.9c0 27-21.9 48.8-48.8 48.8-27 0-48.8-21.9-48.8-48.8 0-27 21.8-48.8 48.8-48.8V6.3l22.4 15.2L60 36.7V26.4c-21.3.2-38.5 17.4-38.5 38.7 0 21.4 17.4 38.8 38.8 38.8S99 86.6 99 65.2v-.3h9.8z" class="st2"/></svg><svg xmlns="http://www.w3.org/2000/svg" id="_x33_d_logo" viewBox="0 0 120 120"><style>.st3{opacity:0;fill-rule:evenodd;clip-rule:evenodd;} .st4{fill-rule:evenodd;clip-rule:evenodd;fill:none;} .st5{fill-rule:evenodd;clip-rule:evenodd;fill:#' + mvColor + ';stroke:#' + mvColor + ';stroke-width:1px;}</style><path d="M60.3 103.9c-21.4 0-38.8-17.4-38.8-38.8 0-.7 0-1.3.1-2 0-.2 0-.5.1-.7 0-.4.1-.8.1-1.3 0-.3.1-.6.1-.9 0-.4.1-.7.1-1.1 0-.3.1-.6.2-.9.1-.3.1-.6.2-1 .1-.3.2-.7.2-1 .1-.3.1-.6.2-.9.1-.4.2-.7.3-1 .1-.3.1-.5.2-.8.1-.4.2-.7.4-1.1.1-.2.2-.5.2-.7.1-.4.3-.8.4-1.1.1-.2.2-.4.2-.6.2-.4.3-.8.5-1.2.1-.2.2-.4.2-.5l.6-1.2c.1-.2.2-.3.2-.5.2-.4.5-.8.7-1.2.1-.1.1-.3.2-.4.3-.4.5-.8.8-1.3.1-.1.1-.2.2-.3.3-.4.6-.9.9-1.3.1-.1.1-.2.2-.2.3-.4.7-.9 1-1.3 0-.1.1-.1.1-.2.4-.4.7-.9 1.1-1.3l.1-.1c.4-.4.8-.9 1.2-1.3l.1-.1 1.3-1.3c7.1-6 16.1-9.8 26.1-9.9v10.3l12.4-8.4C87.9 33.4 99 48 99 65.2c0 21.4-17.3 38.7-38.7 38.7z" class="st3"/><path d="M55.6 68.3c-.4-.5-.9-.9-1.4-1.2-.5-.3-1.2-.6-1.8-.7v-.1c1.1-.3 2.1-.9 2.8-1.8.7-.9 1.1-2 1.1-3.3 0-1.1-.2-2.1-.7-2.9-.5-.8-1.1-1.5-1.9-2.1-.8-.6-1.6-1-2.6-1.2-1-.3-2-.4-3-.4s-1.9.1-2.8.4c-.9.3-1.8.6-2.5 1.1-.8.5-1.5 1.1-2 1.9-.6.7-1 1.6-1.3 2.6l5.1 1.2c.2-.8.6-1.4 1.1-1.9.6-.5 1.3-.7 2.1-.7s1.4.2 2 .7c.6.4.9 1.1.9 1.9 0 .6-.1 1-.3 1.4-.2.4-.5.6-.9.8-.4.2-.8.4-1.3.4-.5.1-1 .1-1.5.1H45v4h1.5c.6 0 1.1 0 1.7.1.6.1 1.1.3 1.5.5.4.2.8.5 1.1.9.3.4.4.9.4 1.5s-.1 1-.3 1.4c-.2.4-.5.7-.8.9-.3.2-.7.4-1.1.5-.4.1-.8.2-1.2.2-1.1 0-1.9-.3-2.6-.9-.7-.6-1.1-1.3-1.3-2L38.8 73c.3 1.1.8 2 1.4 2.8.6.8 1.3 1.4 2.2 1.9.8.5 1.7.9 2.7 1.1 1 .2 2 .4 3.1.4s2.1-.1 3.2-.4c1-.3 2-.7 2.8-1.4.8-.6 1.5-1.4 2-2.3.5-.9.8-2 .8-3.3 0-.7-.1-1.3-.3-1.9-.4-.6-.7-1.1-1.1-1.6zm24.5-7c-.8-1.5-1.8-2.7-3-3.6-1.2-.9-2.7-1.5-4.3-1.9-1.6-.4-3.2-.6-4.9-.6h-8.4v23.4h8.7c1.6 0 3.2-.2 4.7-.7 1.6-.5 3-1.2 4.2-2.1 1.2-1 2.2-2.2 3-3.7.8-1.5 1.1-3.3 1.1-5.3 0-2.2-.3-4-1.1-5.5zm-5.3 8.8c-.4.9-1 1.6-1.7 2.1s-1.5.9-2.5 1.1c-.9.2-1.9.3-2.9.3H65V60h2.8c1 0 1.9.1 2.8.3.9.2 1.7.6 2.4 1.1.7.5 1.3 1.2 1.7 2.1.4.9.6 2 .6 3.3.1 1.3-.1 2.4-.5 3.3z" class="st4"/><path d="M108.8 64.9c0 27-21.9 48.8-48.8 48.8-27 0-48.8-21.9-48.8-48.8 0-27 21.8-48.8 48.8-48.8V6.3l22.4 15.2L60 36.7V26.4c-21.3.2-38.5 17.4-38.5 38.7 0 21.4 17.4 38.8 38.8 38.8S99 86.6 99 65.2v-.3h9.8z" class="st5"/></svg></div></div>';

    var fancybox3Options = $.extend({}, fancybox3MainOptions);
    fancybox3Options.transitionEffect = 'fade';
    fancybox3Options.baseClass = 'fancybox3-media-viewer fancybox3-media-viewer-tours-only';
    fancybox3Options.buttons = [
        'thumbs',
        'fullScreen',
        'close',
    ];

    if (typeof(mvTours) != 'undefined' && mvTours != null) {
        $('head').append('<style>.fancybox3-media-viewer .fancybox3-button--play::before, .fancybox3-media-viewer .fancybox3-button--pause::before { top: calc(50% - 6px); left: calc(50% - 4px); } .fancybox3-media-viewer .fancybox3-button--fullscreen::before { top: calc(50% - 6px); left: calc(50% - 7px); } .fancybox3-media-viewer .fancybox3-button--close::before, .fancybox3-media-viewer .fancybox3-button--close::after { top: calc(50% - 1px); left: calc(50% - 8px); } .fancybox3-media-viewer .fancybox3-button--thumbs::before { top: calc(50% - 2px); left: calc(50% - 2px); }.fancybox3-media-viewer .fancybox3-availableunits:before { top: calc(50% - 1px); }.fancybox-is-open .fancybox-bg { opacity: 1 !important; }</style>');

        if (mvTours.length < 2) {
            fancybox3Options.thumbs.autoStart = false;
        }

        $.each(mvTours, function(idx, tour){
            modalItems.push({
                src:   tour.Src,
                type:  'iframe',
                thumb: ((tour.ImgUrl != null) ? tour.ImgUrl.replace('%s', '600x600') : '/App_Themes/Global/RPWebParts/images/mv_default_thumb.png')
            });
        });

        fancybox3Options.beforeLoad = function(instance, current) {
            $.each(mvTours, function(idx, tour){
                if ($('.fancybox3-thumbs li').eq(idx).find('.fancybox3-media-viewer-caption').length < 1){
                    $('.fancybox3-thumbs li').eq(idx).append('<div class="fancybox3-media-viewer-caption">' + tour.Caption + '</div>');
                }
            });
        }

        $('body').append(mvBtnHTML);

        if (typeof(mvTourText) != 'undefined' && mvTourText != null && mvTourText != '') {
            $('.media-viewer-btn-container media-viewer-btn').attr('title', mvTourText);
        }

        setTimeout(function(){
            $('.media-viewer-btn-container').css('opacity', 1);
            $('.media-viewer-btn').addClass('expandUp');
        }, 1500);

        if (mvBtnAnimation == 'spin') {
            $('.media-viewer-btn svg:first-child').addClass('spin-left');
            $('.media-viewer-btn svg:last-child').addClass('spin-right');
        }

        if (mvBtnAnimation == 'pulse') {
            $('.media-viewer-btn svg').addClass('pulse');
        }

        $('.media-viewer-tab, .media-viewer-btn').click(function(e){
            e.preventDefault();
            $.fancybox3.open(modalItems, fancybox3Options);
            $('.fancybox3-title').text('Media Viewer');
        });
    }
});
