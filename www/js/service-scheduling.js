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

    $(document).on('click', '.agent-list.agent-list-a .card', function(e) {
        var that = $(this);
        e.preventDefault();
        showPickModal(that.find('.agent-name').html());
    });
    $(document).on('click', '.table.agent-table tbody .fa-check', function(e) {
        e.preventDefault();
        datePicked();
    });

    $(document).on('click', '#clear-company', function(e) {
        e.preventDefault();
        $('input#company').val('');
        filterCompanyList()
    });
    $(document).on('click', '#clear-agent', function(e) {
        e.preventDefault();
        $('input#agent').val('');
        filterAgentList();
    });

    $(document).on('input', 'input#company', function(e) {
        e.preventDefault();
        var needle = $('input#company').val();
        filterCompanyList(needle);
    });
    $(document).on('input', 'input#agent', function(e) {
        e.preventDefault();
        var needle = $('input#agent').val();
        filterAgentList(needle);
    });

    $('.app-title').on('click', function (e) {
        navigate('home', false);
    });

    $(document).on('submit', 'form.form-no-submit', function (e) {
        e.preventDefault();
    });

    initTest();

    navigate('home', false);
});

var isTestA = false;
var isTestB = false;
var testLog = [];
var testPrefix = '';

/**
 * Navigation Function
 * @param nextPage
 * @param closeNav
 */
function navigate(nextPage, closeNav) {
    var templateURL = 'templates/'+nextPage+'.html?t='+new Date().getTime();

    logAction('navigate', nextPage);

    var nav = $('#side-nav');
    var content = $('#main-content');

    nav.find('.active').removeClass('active');
    $.get(templateURL, function (data) {
        nav.find('a[data-nav="'+nextPage+'"]').addClass('active');
        if (closeNav) {
            $("#wrapper").toggleClass("toggled");
        }
        content.fadeOut({complete: function () {
            content.html(data);
            content.fadeIn();
            if (nextPage === 'results') {
                printResults();
            }
        }});
    });
}

/**
 * Show Info Modal
 * @param title
 * @param message
 * @param goHome
 */
function showInfoModal(title, message, goHome) {
    logAction('infoModal', title);

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
function showPickModal(agent) {
    logAction('pickModal', agent);
    var modal = $('#pick-modal');
    modal.modal('toggle');
}

/**
 * Show Pick Success Modal
 */
function datePicked() {
    logAction('datePicked');
    var modal = $('#pick-modal');
    modal.modal('hide');
    if (isTestA) {
        showInfoModal('Appointment Selected', 'You have selected an Appointment with <b>Max Power</b> on <b>Wednesday</b> at <b>08:00 AM</b>.<br/><br/>Max may contact you for more details.', true);
    } else if (isTestB) {
        showInfoModal('Appointment Selected', 'You have selected an Appointment with <b>Michael Bay</b> on <b>Wednesday</b> at <b>08:00 AM</b>.<br/><br/>Michael may contact you for more details.', true);
    }
}

/**
 * Filter the list of agents
 * @param needle
 */
function filterAgentList(needle) {
    logAction('filterAgent', needle);
    var list = $('.agent-list');
    list.find('.card').each(function(index) {
        var agent = $(this);
        if (!needle || needle === '') {
            agent.removeClass('d-none');
        } else {
            var name = agent.find('.agent-name').html();
            if (name.toLowerCase().indexOf(needle.toLowerCase()) > -1) {
                agent.removeClass('d-none');
            } else {
                agent.addClass('d-none');
            }
        }
    });
}

/**
 * Filter the list of companies
 * @param needle
 */
function filterCompanyList(needle) {
    logAction('filterCompany', needle);
    var list = $('.company-list');
    list.find('.company-list-entry').each(function(index) {
        var company = $(this);
        if (!needle || needle === '') {
            company.removeClass('d-none');
        } else {
            var name = company.html();
            if (name.toLowerCase().indexOf(needle.toLowerCase()) > -1) {
                company.removeClass('d-none');
            } else {
                company.addClass('d-none');
            }
        }
    });
}

/**
 * Print Timestamps and Action List of current Test
 */
function printResults() {
    var container = $('#result-container');
    testLog.forEach(function (msg) {
        container.append('<li>' + msg + '</li>');
    });
}

/**
 * Start Test
 */
function initTest() {
    var hash = window.location.hash;
    var body = $('body');
    if (hash === '#test-a') {
        testPrefix = 'Test A: ';
        body.addClass('test-a');
        isTestA = true;
    } else if (hash === '#test-b') {
        testPrefix = 'Test B: ';
        body.addClass('test-b');
        isTestB = true;
    } else {
        window.location.href = "index.html";
    }
}

/**
 * Log User Interaction
 */
function logAction(val1, val2) {
    var time = new Date();
    var timeF = formatted_date = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    var msg = testPrefix + val1;
    if (val2) {
        msg = msg + ' (' + val2 + ')'
    }
    msg = msg + ' ' + timeF;
    testLog.push(msg);
}
