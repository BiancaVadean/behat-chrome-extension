var page = {
    init: function () {
        return true;
    },
    started: false,
    changeStatus: function () {
        this.started = !this.started;
    }
};

page.init();