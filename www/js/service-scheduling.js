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
        if (nextPage === 'cancel') {
            window.location.href = "index.html";
        } else {
            navigate(nextPage, true);
        }
    });

    $(document).on('submit', '#form-profile', function(e) {
        e.preventDefault();
        showInfoModal('Profile', 'Your profile has been updated.', false);
    });
    $(document).on('submit', '#form-settings', function(e) {
        e.preventDefault();
        showInfoModal('Settings', 'Your settings have been saved.', false);
    });

    $(document).on('click', '#schedule-now', function(e) {
        e.preventDefault();
        navigate('schedule', false);
    });

    $(document).on('click', '.company-list .company-list-entry', function(e) {
        e.preventDefault();
        var hash = window.location.hash;
        if (hash === '#test-a') {
            navigate('schedule2-a', false);
        } else if (hash === '#test-b') {
            navigate('schedule2-b', false);
        } else {
            window.location.href = "index.html";
        }
    });

    $(document).on('click', '.agent-list .card', function(e) {
        e.preventDefault();
        showPickModal();
    });

    $(document).on('click', '.table.agent-table tbody .fa-check', function(e) {
        e.preventDefault();
        datePicked();
    });

    navigate('home', false);
});

/**
 * Navigation Function
 * @param nextPage
 * @param closeNav
 */
function navigate(nextPage, closeNav) {
    var templateURL = 'templates/'+nextPage+'.html?t='+new Date().getTime();

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
function showInfoModal(title, message, goHome) {
    var modal = $('#info-modal');
    modal.find('#info-modal-title').html(title);
    modal.find('#info-modal-message').html(message);
    modal.modal('toggle');
    if (goHome) {
        navigate('home', false);
    }
}

/**
 * Show Pick Modal
 */
function showPickModal() {
    var modal = $('#pick-modal');
    modal.modal('toggle');
}

/**
 * Show Pick Success Modal
 */
function datePicked() {
    var modal = $('#pick-modal');
    modal.modal('hide');
    showInfoModal('Appointment Selected', 'You have selected an Appointment with <b>Max Power</b> on <b>Wednesday</b> at <b>08:00 AM</b>.<br/><br/>Max may contact you for more details.', true);
}


