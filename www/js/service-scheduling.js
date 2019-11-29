$(document).ready(function() {

    //Toggle Nav
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });

    //Navigate
    $('#side-nav').find('a').on('click', function(e) {
        e.preventDefault();
        var that = $(this);
        var nextPage = that.data('nav');
        navigate(nextPage, true);
    });

    $(document).on('submit', '#form-profile', function(e) {
        e.preventDefault();
        showInfoModal('Profile', 'Your profile has been updated.');
    });$(document).on('submit', '#form-settings', function(e) {
        e.preventDefault();
        showInfoModal('Settings', 'Your settings have been saved.');
    });

    navigate('home', false);
});

/**
 * Navigation Function
 * @param nextPage
 * @param closeNav
 */
function navigate(nextPage, closeNav) {
    var templateURL = 'templates/'+nextPage+'.html';

    var nav = $('#side-nav');
    var content = $('#main-content');

    nav.find('.active').removeClass('active');
    content.html('');
    $.get(templateURL, function (data) {
        content.html(data);
        nav.find('a[data-nav="'+nextPage+'"]').addClass('active');
        if (closeNav) {
            $("#wrapper").toggleClass("toggled");
        }
    });
}

/**
 * Show Info Modal
 * @param title
 * @param message
 */
function showInfoModal(title, message) {
    var modal = $('#info-modal');
    modal.find('#info-modal-title').html(title);
    modal.find('#info-modal-message').html(message);
    modal.modal('toggle');
}