$(document).ready(function() {
    $(window).scroll(function() {
        $('.title-card').each(function() {
            var elementTop = $(this).offset().top;
            var viewportTop = $(window).scrollTop();
            if (elementTop < viewportTop + window.innerHeight/1.25) {
                $(this).addClass('fade-in');
            }
        });
    });
});