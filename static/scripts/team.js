function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

var saveName = debounce(function() {
    var name = $('#team-name').val();
    var messageElement = $('#team-message');
    messageElement.removeProp('class');
    messageElement.css('opacity', 1);
    messageElement.text('saving...');
    $.post('/team', {name}, function(response, status){
        var message = '';
        if (status === 'success') message = 'saved';
        else message = 'failed';
        messageElement.text(message);
        messageElement.addClass(message);
        messageElement.animate({
            opacity: 0
        }, 1000);
    });
}, 500);

$('#team-name').on('input', saveName);

