
var popup = {
    start: false,
    statusButton: document.getElementById('status'),
    init: function() {
        this.statusButton.addEventListener('click', this.changeStatus, false);
        if (true) {
            chrome.extension.onMessage.addListener(function (myMessage, sender, sendResponse) {


            });
            chrome.storage.sync.get('events', function (items) {
                console.log(items)
                for (var i in items.events) {
                    var ul = document.getElementById('events');
                    var li = document.createElement('li');
                    li.appendChild(document.createTextNode(items.events[i]));
                    ul.appendChild(li);
                }
            });
        }
    },
    changeStatus: function () {
        this.start = !this.start;
        if (this.start) {
            document.getElementById('status').value = "Start";
        } else {
            document.getElementById('status').value = "End";
        }
    }
};
popup.init();


