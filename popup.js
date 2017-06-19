var popup = {
    state: 'waiting',
    // statusButton: document.getElementById('status'),
    playButton: $('#play'),
    assertButton: $('#assert'),
    stopButton: $('#stop'),
    background: null,
    init: function () {
        var _this = this;

        $('#clear-events').click(function () {
            _this.clearEvents();
        });

        chrome.storage.sync.get(null, function (items) {
            $('#scenarioName').val(items.name);
            _this.state = items.status;
            _this.setState()
        });


        $('#scenarioName').change(function (event) {
           var value = $(this).val()
            chrome.storage.sync.set({name: value});
        });

        this.playButton.click(function () {
            _this.play();
        });

        this.assertButton.click(function () {
            _this.assert();
        });

        this.stopButton.click(function () {
            _this.stop();
        });
    },

    play: function () {
        var settings = [];
        var events = $('.event input');
        console.log(events)
        events.each(function (i, e) {
            console.log(e);
            if (e.checked) {
                settings.push(e.id);
            }
        });
        console.log(settings);
        chrome.storage.sync.set({'settings': settings});
        this.state = 'playing';

        this.setState();
    },

    assert: function () {
        this.state = 'asserting'
        this.setState();
    },

    stop: function () {
        this.state = 'waiting'
        this.setState();
        chrome.browserAction.setBadgeText({text: ''});
        $('#loader').removeClass('hidden');
        $('#scenarioName').val('');
        this.postEvents();
    },
    changeStatus: function () {
        var _this = this;
        chrome.storage.sync.get('status', function (status) {
            console.log(status.status);
            if (status.status) {
                _this.state = false;
                console.log(_this.state);
                _this.displayStatus();
                chrome.storage.sync.set({'status': false});
            } else {
                _this.state = true;
                _this.displayStatus();
                chrome.storage.sync.set({'status': true});
            }
        });

    },
    displayStatus: function () {
        if (this.state) {
            document.getElementById('status').value = "End";
        } else {
            document.getElementById('status').value = "Start";
            chrome.storage.sync.get('events', function (items) {
                console.log(JSON.stringify(items));
                if (items.events) {
                    $.post('http://symfony3/index', {'events': items.events}, function (data, status) {
                        console.log(data);
                        console.log(status);
                        chrome.storage.sync.clear(function () {
                            console.log('All cleared!');
                            return;
                        });
                    });
                }
            })
        }
    },

    postEvents: function () {
        chrome.storage.sync.get(null, function (items) {
            console.log(JSON.stringify(items));
            if (items.events) {
                try {
                    $.post('http://symfony3/index', {
                        'events': items.events,
                        'name': $('#scenarioName').val()
                    }, function (data, status) {
                        console.log(data);
                        console.log(status);
                        $('#loader').addClass('hidden');
                        chrome.downloads.download({url: 'http://symfony3/test'}, function () {

                        })
                        chrome.storage.sync.clear(function () {
                            return;
                        });
                    })
                        .fail(function () {
                            $('#loader').addClass('hidden');
                        });
                } catch (error) {
                    $('#loader').addClass('hidden');
                }
            } else {
                $('#loader').addClass('hidden');
            }
        });
    },

    setState: function () {
        chrome.storage.sync.set({'status': this.state});
        $('#state').html(this.state);
        switch (this.state) {
            case 'playing':
                this.playButton.addClass('hidden');
                $('#events').addClass('hidden');
                this.stopButton.removeClass('hidden');
                this.assertButton.removeClass('hidden');
                $("#clear-events").show();
                break;
            case 'asserting':
                this.assertButton.addClass('hidden');
                this.stopButton.removeClass('hidden');
                this.playButton.removeClass('hidden');
                $("#clear-events").show();
                break;
            default:
                this.stopButton.addClass('hidden');
                $('#events').removeClass('hidden');
                this.playButton.removeClass('hidden');
                this.assertButton.removeClass('hidden');
                $('#state').html('waiting');
                $("#clear-events").hide();
                break;
        }
    },
    clearEvents: function () {
        chrome.storage.sync.set({events: null});
    }
};
popup.init();


