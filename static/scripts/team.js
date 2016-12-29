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
        success: function(response) {
            setMessage(messageElement, 'saved');
            if (response === 'Created') location.reload();
        },
        error: function() {setMessage(messageElement, 'failed')}
    });
}

var saveTeam = debounce(function(event) {
    var name = $('#team-name').val();
    var track = $('input[name="track"]:checked').val() || '';
    var messageElement;
    if (event.target.name === 'track') messageElement = $('#track-message');
    else messageElement = $('#name-message');
    var url = '/team';
    save(url, {name: name, track: track}, messageElement);
}, 500);

var saveTshirt = debounce(function() {
    var size = $('#tshirt').val();
    var messageElement = $('#tshirt-message');
    var url = '/tshirt';
    save(url, {size: size}, messageElement);
}, 500);

$('#team-name').on('input', saveTeam);
$('#tshirt').on('input', saveTshirt);
$('input[name="track"]').on('change', saveTeam);
$('#copy').on('click', function() {
    $('#copy').text('copied').addClass('saved');
});

new Clipboard('#copy');
