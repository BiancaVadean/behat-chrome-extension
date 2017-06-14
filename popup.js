
var popup = {
    state: 'waiting',
    // statusButton: document.getElementById('status'),
    playButton: $('#play'),
    assertButton: $('#assert'),
    stopButton: $('#stop'),
    background: null,
    init: function() {
        var _this = this;

        chrome.storage.sync.get('status', function (status) {
            _this.state = status.status;
            _this.setState()
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
        // chrome.storage.sync.clear(function() {
        //     console.log('All cleared!');
        //
        //     return;
        // });
        this.state = 'playing'
        this.setState();
    },

    assert: function () {
        this.state = 'asserting'
        this.setState();
    },

    stop: function () {
        this.state = 'waiting'
        this.setState();

        $('#loader').removeClass('hidden');
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
            chrome.storage.sync.get('events', function(items) {
                console.log(JSON.stringify(items));
                if (items.events) {
                    $.post('http://symfony3/index', {'events': items.events}, function(data, status) {
                        console.log(data);
                        console.log(status);
                        chrome.storage.sync.clear(function() {
                            console.log('All cleared!');
                            return;
                        });
                    });
                }
            })
        }
    },

    postEvents: function () {
        chrome.storage.sync.get('events', function(items) {
            console.log(JSON.stringify(items));
            if (items.events) {
                try {
                    $.post('http://symfony3/index', {'events': items.events}, function(data, status) {
                        console.log(data);
                        console.log(status);
                        $('#loader').addClass('hidden');
                        chrome.storage.sync.clear(function() {
                            console.log('All cleared!');

                            return;
                        });
                    })
                        .fail(function() {
                            $('#loader').addClass('hidden');
                        });
                } catch (error) {
                    $('#loader').addClass('hidden');
                }
            }
        });
    },

    setState: function () {
        chrome.storage.sync.set({'status': this.state});
        switch (this.state){
            case 'playing':
                this.playButton.addClass('hidden');

                this.stopButton.removeClass('hidden');
                this.assertButton.removeClass('hidden');
                break;
            case 'asserting':
                this.assertButton.addClass('hidden');
                this.stopButton.removeClass('hidden');
                this.playButton.removeClass('hidden');
                break;
            default:
                this.stopButton.addClass('hidden');
                this.playButton.removeClass('hidden');
                this.assertButton.removeClass('hidden');
                break;
        }
    }
};
popup.init();


