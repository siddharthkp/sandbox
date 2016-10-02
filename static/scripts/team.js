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

function setMessage(messageElement, message) {
    messageElement.text(message);
    messageElement.addClass(message);
    messageElement.animate({
        opacity: 0
    }, 1000);
}

function save(url, data, messageElement) {
    messageElement.removeAttr('class');
    messageElement.css('opacity', 1);
    messageElement.text('saving...');
    $.ajax({
        url: url,
        type: 'POST',
        data: data,
        success: function() {setMessage(messageElement, 'saved')},
        error: function() {setMessage(messageElement, 'failed')}
    });
}

var saveName = debounce(function() {
    var name = $('#team-name').val();
    var messageElement = $('#team-message');
    var url = '/team';
    save(url, {name: name}, messageElement);
}, 500);

var saveTshirt = debounce(function() {
    var size = $('#tshirt').val();
    var messageElement = $('#tshirt-message');
    var url = '/tshirt';
    save(url, {size: size}, messageElement);
}, 500);

$('#team-name').on('input', saveName);
$('#tshirt').on('input', saveTshirt);

