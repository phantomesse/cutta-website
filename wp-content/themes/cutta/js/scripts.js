$(document).ready(function() {

    // Set i18n for nav bar
    $('div.menu-nav-container ul li').each(function() {
        var a = $($(this).children('a'));
        var page = a.html().toLowerCase().replace(/ /g, '_');
        a.attr('data-i18n', 'nav.' + page);
    });

    // Set language
    var params = window.location.hash.substring(1);
    var langIndex = params.indexOf("lang=");
    if (langIndex >= 0) {
        var language = params.substring(langIndex + 5, langIndex + 7);
        lang(language);
    } else {
        lang($('html').attr('lang').substring(0,2));
    }

    // Select language by flags
    $('div.flags a').click(function() {
        lang($(this).attr('data-language'));
    });

    // Set language for page changes
    $('a').click(function() {
        var href = $(this).attr('href');
        if (href) {
            $(this).attr('href', href + '#lang=' + $('html').attr('lang').substring(0,2));
        }
    });

    // Quote calculator
    var page = $('body').attr('id');
    if (page == 'tutoring') {
        quote_calculator_tutoring();
    } else if (page == 'translating') {
        quote_calculator_translating();
    }

});

// Language
var language_cache = {};
function lang(language) {
    $('html').attr('lang', language);
    window.location.hash = 'lang=' + language;

    if (language_cache[language]) {
        var dictionary = language_cache[language];

        $('[data-i18n]').each(function() {
            var key = $(this).attr('data-i18n').split('.');
            var str = dictionary;
            for (var i = 0; i < key.length; i++) {
                str = str[key[i]];
            }
            $(this).html(str);
        });
    } else {
        $.getJSON('/cutta/wp-content/themes/cutta/strings/lang.' + language + '.js', function(dictionary) {
            language_cache[language] = dictionary;

            $('[data-i18n]').each(function() {
                var key = $(this).attr('data-i18n').split('.');
                var str = dictionary;
                for (var i = 0; i < key.length; i++) {
                    str = str[key[i]];
                }
                $(this).html(str);
            });
        });
    }
}

function quote_calculator_tutoring() {
    var form = 'form.quote-calculator ';

    $(form + 'div#1-student').hide();
    $(form + 'div#2-students').hide();
    $(form + 'div#3-students').hide();
    $(form + 'div#esl').hide();
    $(form + 'div#columbia-affiliation').hide();
    $(form + 'input[type=submit]').hide();
    $(form + 'p#rate').hide();
    $(form + 'select[name=number-of-students]').on('change', function() {
        switch ($(this).val()) {
            case '1': $(form + 'div#1-student').fadeIn();
            $(form + 'div#2-students').hide();
            $(form + 'div#3-students').hide();
            $(form + 'div#esl').fadeIn();
            $(form + 'div#columbia-affiliation').fadeIn();
            $(form + 'input[type=submit]').fadeIn();
            break;
            case '2': $(form + 'div#2-students').fadeIn();
            $(form + 'div#1-student').hide();
            $(form + 'div#3-students').hide();
            $(form + 'div#esl').fadeIn();
            $(form + 'div#columbia-affiliation').fadeIn();
            $(form + 'input[type=submit]').fadeIn();
            break;
            case '3': $(form + 'div#3-students').fadeIn();
            $(form + 'div#1-student').hide();
            $(form + 'div#2-students').hide();
            $(form + 'div#esl').hide();
            $(form + 'div#columbia-affiliation').hide();
            $(form + 'input[type=submit]').hide();
            break;
        }
    });

$(form).submit(function() {
    var rate = 0;
    if ($(form + 'select[name=number-of-students]').val() == '1') {
                    // One student
                    rate = 65;

                    if ($(form + 'select[name=education').val() == 'high-school-and-above'
                        && $(form + 'input[name=columbia-affiliation]:checked').val() == 'no') {
                        rate = 80;
                }

                if ($(form + 'input[name=esl]:checked').val() == 'yes') {
                    rate = 55;
                }
            } else {
                // Two students
                if ($(form + 'input[name=esl]:checked').val() == 'yes') {
                    rate = 82.5;
                } else {
                    rate = 130;
                    if ($(form + 'input[name=columbia-affiliation]:checked').val() == 'no') {
                        if ($(form + 'select[name=education-1').val() == 'high-school-and-above') {
                            rate += 15;
                        }
                        if ($(form + 'select[name=education-2').val() == 'high-school-and-above') {
                            rate += 15;
                        }
                    }
                    rate = rate/2*1.5;
                }

            }

            $(form + 'p#rate span').html(rate.toFixed(2));
            $(form + 'p#rate').slideDown();
            return false;
        });

$(form + 'input').on('change', function() {
    if ($(form + 'p#rate').is(':visible')) {
        $(form + 'p#rate').fadeOut();
    }
});

$(form + 'select').on('change', function() {
    if ($(form + 'p#rate').is(':visible')) {
        $(form + 'p#rate').fadeOut();
    }
});
}

function quote_calculator_translating() {
    var form = 'form.quote-calculator ';

    $(form + 'div#translation').hide();
    $(form + 'div#proofreading').hide();
    $(form + 'div#interpretation').hide();
    $(form + 'div#transcription').hide();
    $(form + 'input[type=submit]').hide();
    $(form + 'select[name=translation-type]').on('change', function() {
        switch ($(this).val()) {
            case 'translation':
            $(form + 'div#translation').fadeIn();
            $(form + 'div#proofreading').hide();
            $(form + 'div#interpretation').hide();
            $(form + 'div#transcription').hide();
            $(form + 'input[type=submit]').fadeIn();
            break;
            case 'proofreading':
            $(form + 'div#translation').hide();
            $(form + 'div#proofreading').fadeIn();
            $(form + 'div#interpretation').hide();
            $(form + 'div#transcription').hide();
            $(form + 'input[type=submit]').fadeIn();
            break;
            case 'interpretation':
            $(form + 'div#translation').hide();
            $(form + 'div#proofreading').hide();
            $(form + 'div#interpretation').fadeIn();
            $(form + 'div#transcription').hide();
            $(form + 'input[type=submit]').fadeIn();
            break;
            case 'transcription':
            $(form + 'div#translation').hide();
            $(form + 'div#proofreading').hide();
            $(form + 'div#interpretation').hide();
            $(form + 'div#transcription').fadeIn();
            $(form + 'input[type=submit]').fadeIn();
            break;
        }
    });

$(form).submit(function() {
    var rate = '';

    switch ($(form + 'select[name=translation-type]').val()) {
        case 'translation':
        var wordcount = $(form + 'input[name=translation-word-count]').val();
        if (wordcount > 2000) {
            rate = 'Please <a href="contact-us">contact us</a> about rates for over 2000 words.'
        } else if (wordcount <= 250){
            rate = 'My rate is $60.00';
        } else if ($(form + 'input[name=translation-rush]:checked').val() == 'yes') {
            rate = 'My rate is $' + (wordcount*0.3).toFixed(2) + '.';
        } else {
            rate = 'My rate is $' + (wordcount*0.25).toFixed(2) + '.';
        }
        break;

        case 'proofreading':
        var wordcount = $(form + 'input[name=proofreading-word-count]').val();
        if (wordcount > 2000) {
            rate = 'Please <a href="contact-us">contact us</a> about rates for over 2000 words.'
        } else if (wordcount <= 270){
            rate = 'My rate is $40.00';
        } else if ($(form + 'input[name=proofreading-rush]:checked').val() == 'yes') {
            rate = 'My rate is $' + (wordcount*0.18).toFixed(2) + '.';
        } else {
            rate = 'My rate is $' + (wordcount*0.15).toFixed(2) + '.';
        }
        break;

        case 'interpretation':
        var hours = $(form + 'input[name=interpretation-hours]').val();
        if (hours <= 2) {
            rate = 'My rate is $160.00';
        } else {
            rate = 'My rate is $' + (hours*4*20).toFixed(2) + '.';
        }
        break;

        case 'transcription':
        var hours = $(form + 'input[name=transcription-hours]').val();
        if ($(form + 'select[name=language-from]').val() == 'english'
            && $(form + 'select[name=language-to]').val() == 'english') {
            rate = 'My rate is $' + (hours*4*45).toFixed(2) + '.';
    } else {
        rate = 'My rate is $' + (hours*4*75).toFixed(2) + '.';
    }
    break;
}

$(form + 'p#rate').html(rate);
$(form + 'p#rate').slideDown();
return false;
});

$(form + 'input').on('change', function() {
    if ($(form + 'p#rate').is(':visible')) {
        $(form + 'p#rate').fadeOut();
    }
});

$(form + 'select').on('change', function() {
    if ($(form + 'p#rate').is(':visible')) {
        $(form + 'p#rate').fadeOut();
    }
});
}