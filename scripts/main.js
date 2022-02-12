var urlParams = {};

function getUrlParamCount() {
    return Object.keys(urlParams).length;
}

function getUrlVars() {
    if (getUrlParamCount() === 0) {
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            urlParams[key.toLowerCase()] = value;
        });
    }
    return urlParams;
}

function getUrlParam(parameter, defaultValue) {
    var urlParameter = defaultValue;
    if (parameter in urlParams) {
        urlParameter = urlParams[parameter];
    }
    return urlParameter;
}

function localStorageGetWithDefault(key, defaultValue) {
    const urlVal = getUrlParam(key, defaultValue);
    if (urlVal === defaultValue) {
        const value = localStorage.getItem(key);
        if (!value) {
            localStorage.setItem(key, defaultValue);
            return defaultValue;
        }
        return value;
    }
    return urlVal;
}

function getAcquiredScentCount() {
    var scentSet = new Set();
    $("img[data-name]").each(function() {
        const name = $(this).attr('data-name');
        if (!scentSet.has(name) && !$(this).hasClass("unselected")) {
            scentSet.add(name);
        }
    });

    return scentSet.size;
}

function getTotalScentCount() {
    var scentSet = new Set();
    $("img[data-name]").each(function() {
        const name = $(this).attr('data-name');
        if (!scentSet.has(name)) {
            scentSet.add(name);
        }
    });

    return scentSet.size;
}

$(document).ready(function(){
    getUrlVars();

    // disable some basic functionality
    $('img').on('dragstart', function(){return false;});
    $('html').contextmenu(function(){return false;});
    $('img').contextmenu(function(){return false;});

    $('.optional-item').height(50);
    $('.badge').height(40);

    // set text display for the main items
    $('.section img').on('mouseenter', function() {
        var modifier = $(this).attr('data-name-modifier');
        if (modifier === undefined) modifier = "";
        var fullname = `${$(this).attr('data-name')} ${modifier}`;
        $(`#${$(this).attr("data-area")} h2`).text(fullname);
    });

    $('.section img').on('mouseleave', function() {
        $('.section h2').text("");
    });

    // bind individual item trackers
    $('.optional-item').unbind("click").click(function() {
        if ($(this).hasClass("unselected")) {
            $(`img[data-name="${$(this).attr("data-name")}"]`).removeClass("unselected");
        } else {
            $(`img[data-name="${$(this).attr("data-name")}"]`).addClass("unselected");
        }

        $('#total-completion h2').text(`${Math.trunc(getAcquiredScentCount() / getTotalScentCount() * 1000) / 10}%`);
    });

    // options menu
    $(document).click(function(e) {
        // if the option menu is open, and the click is outside the options menu, close it
        var container = $("#options-menu");
        if (container.hasClass("options-open") && !container.is(e.target) && container.has(e.target).length === 0) {
            $("#options-menu-toggle").click();
        }
    });

    $("#options-menu-toggle").click(function(e) {
        e.stopPropagation();
        $(this).toggleClass("options-open");
        $("#options-menu").toggleClass("options-open");
    });

    $("#basics-visible").click(function() {
        var isChecked = $(this).is(':checked');
        $(".basic-scents").toggle(isChecked);
        localStorage.setItem("basics-visible", isChecked);
    });

    $("#fish-visible").click(function() {
        var isChecked = $(this).is(':checked');
        $(".fish-scents").toggle(isChecked);
        localStorage.setItem("fish-visible", isChecked);
    });

    $("#insect-visible").click(function() {
        var isChecked = $(this).is(':checked');
        $(".insect-scents").toggle(isChecked);
        localStorage.setItem("insect-visible", isChecked);
    });

    $("#background-color").on("input", function() {
        var color = $(this).val();
        $("body, html").css("background-color", color);
        localStorage.setItem("background-color", color);
    });

    $("#section-color").on("input", function() {
        var color = $(this).val();
        $(".section").css("background-color", color);
        localStorage.setItem("section-color", color);
    });

    // local storage settings
    var basic_scents_visible = localStorageGetWithDefault("basics-visible", true) == "true";
    if (!basic_scents_visible) {
        $("#basics-visible").click();
    }

    var fish_scents_visible = localStorageGetWithDefault("fish-visible", true) == "true";
    if (!fish_scents_visible) {
        $("#fish-visible").click();
    }

    var insect_scents_visible = localStorageGetWithDefault("insect-visible", true) == "true";
    if (!insect_scents_visible) {
        $("#insect-visible").click();
    }

    var bg_color = localStorageGetWithDefault("background-color", "#24759e");
    $("body, html").css("background-color", bg_color);
    $("#background-color").val(bg_color);

    var section_color = localStorageGetWithDefault("section-color", "#144e6c");
    $(".section").css("background-color", section_color);
    $("#section-color").val(section_color);
});
