
var popup = {
    start: false,
    statusButton: document.getElementById('status'),
    background: null,
    init: function() {
        // chrome.storage.sync.clear(function() {
        //     console.log('All cleared!');
        //     return;
        // })
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
                console.log(_this);
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
                console.log(items.events);
                for (var event in items.events) {
                    // console.log(items.events[event].eventTarget.value);
                }
            })
        }
    }
};
popup.init();


