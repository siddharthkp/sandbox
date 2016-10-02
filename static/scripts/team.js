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
    $.post('/team', {
        name: name,
        success: function(response, status){
            var message = '';
            if (status === 'success') message = 'saved';
            else message = 'failed';
            messageElement.text(message);
            messageElement.addClass(message);
            messageElement.animate({
                opacity: 0
            }, 1000);
        },
        error: function() {
            // error
        }
    });
}, 500);

var saveTshirt = debounce(function() {
    var size = $('#tshirt').val();
    var messageElement = $('#tshirt-message');
    messageElement.removeProp('class');
    messageElement.css('opacity', 1);
    messageElement.text('saving...');
    $.ajax({
        url: '/tshirt',
        type: 'POST',
        data: {size: size},
        success: function(response, status) {
            var message = '';
            if (status === 'success') message = 'saved';
            else message = 'failed';
            messageElement.text(message);
            messageElement.addClass(message);
            messageElement.animate({
                opacity: 0
            }, 1000);
        },
        error: function() {
            // error
        }
    });
}, 500);

$('#team-name').on('input', saveName);
$('#tshirt').on('input', saveTshirt);

