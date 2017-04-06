
var popup = {
    start: false,
    statusButton: document.getElementById('status'),
    init: function() {
        chrome.storage.sync.set({'events': []}, function () {
            console.log('Storage set empty!');
        });

        this.statusButton.addEventListener('click', this.changeStatus, false);
        if (this.start) {
            chrome.extension.onMessage.addListener(function (myMessage, sender, sendResponse) {


            });
            // chrome.storage.sync.get('events', function (items) {
            //     console.log(items)
            //     for (var i in items.events) {
            //         var ul = document.getElementById('events');
            //         var li = document.createElement('li');
            //         li.appendChild(document.createTextNode(items.events[i]));
            //         ul.appendChild(li);
            //     }
            // });
        }
    },
    changeStatus: function () {
        this.start = !this.start;
        console.log(this.start);
        if (this.start) {
            document.getElementById('status').value = "End";
        } else {
            document.getElementById('status').value = "Start";
            chrome.storage.sync.get('events', function(items) {
                for (var event in items.events) {
                    console.log(event);
                }
            })
        }
    }
};
popup.init();


