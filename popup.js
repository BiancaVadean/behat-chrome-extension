
var popup = {
    start: false,
    statusButton: document.getElementById('status'),
    background: null,
    init: function() {

        var _this = this;
        chrome.storage.sync.get('status', function (status) {
            _this.start = status.status;
            _this.displayStatus();
        });
        this.statusButton.addEventListener('click', function () {
            _this.changeStatus();
        });
    },
    changeStatus: function () {
        var _this = this;
        chrome.storage.sync.get('status', function (status) {
            console.log(status.status);
            if (status.status) {
                _this.start = false;
                console.log(_this.start);
                _this.displayStatus();
                chrome.storage.sync.set({'status': false});
            } else {
                _this.start = true;
                _this.displayStatus();
                chrome.storage.sync.set({'status': true});
            }
        });

    },
    displayStatus: function () {
        if (this.start) {
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
    }
};
popup.init();


