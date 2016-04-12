var Brain = function (width_low, width_high, height_low, height_high) {
    // 0 for click, 1 for don't click
    this.width_range = [width_low, width_high];
    this.height_range = [height_low, height_high];
    this.width_dist = width_high - width_low;
    this.height_dist = height_high - height_low;
    this.action = 'noClick';
    this.QState = [];
    this.current_state = [0, 0];
    this.resolution = 10;
    this.learning_rate = 0.9;
    this.random_explore = 0.0001;
    for (var i = 0; i <= this.width_dist/this.resolution; i++) {
        this.QState[i] = [];
        for (var j = 0; j <= this.height_dist/this.resolution; j++) {
            this.QState[i][j] = {
                'click': 0,
                'noClick': 0
            }
        }
    }

    this.getState = function (vertical_dist, horizontal_dist) {
        this.next_state = [vertical_dist, horizontal_dist];
    };

    this.updateState = function (reward) {
        var vertical_state = Math.min(
            this.height_dist, this.current_state[0]
        );
        var horizontal_state = Math.min(
            this.width_dist, this.current_state[1]
        );
        var vertical_next_state = Math.min(
            this.height_dist, this.next_state[0]
        );
        var horizontal_next_state = Math.min(
            this.width_dist, this.next_state[1]
        );
        vertical_state /= this.resolution;
        horizontal_state /= this.resolution;
        vertical_next_state /= this.resolution;
        horizontal_next_state /= this.resolution;
        vertical_state = vertical_state < 0 ? 0 : Math.floor(vertical_state);
        horizontal_state = horizontal_state < 0 ? 0 : Math.floor(horizontal_state);
        vertical_next_state = vertical_next_state < 0 ? 0 : Math.floor(vertical_next_state);
        horizontal_next_state = horizontal_next_state < 0 ? 0 : Math.floor(horizontal_next_state);

        var click_q_next_value = this.QState[horizontal_next_state][vertical_next_state]['click'];
        var no_click_q_next_value = this.QState[horizontal_next_state][vertical_next_state]['noClick'];
        var q_next_value = Math.max(click_q_next_value, no_click_q_next_value);
        var q_current_value = this.QState[horizontal_state][vertical_state][this.action];
        this.QState[horizontal_state][vertical_state][this.action] =
            q_current_value + this.learning_rate * (reward + q_next_value - q_current_value);
        this.current_state = this.next_state.slice();
    };

    this.getAction = function () {
        if (Math.random() <= this.random_explore) {
            console.log('===== random explore =====');
            this.action = random(0, 1) == 1 ? 'click' : 'noClick';
        } else {
            var vertical_state = Math.min(
                this.height_dist, this.current_state[0]
            );
            var horizontal_state = Math.min(
                this.width_dist, this.current_state[1]
            );
            vertical_state /= this.resolution;
            horizontal_state /= this.resolution;
            vertical_state = vertical_state < 0 ? 0 : Math.floor(vertical_state);
            horizontal_state = horizontal_state < 0 ? 0 : Math.floor(horizontal_state);
            var click_q_value = this.QState[horizontal_state][vertical_state]['click'];
            var no_click_q_value = this.QState[horizontal_state][vertical_state]['noClick'];
            this.action = click_q_value > no_click_q_value ? 'click' : 'noClick';
            //console.log(this.current_state[0]);

            // console.log(vertical_state, horizontal_state, click_q_value, no_click_q_value, this.action);
        }
        return this.action;
    };

    this.toJson = function () {
        return JSON.stringify(this.QState);
    };

    this.fromJson = function (json) {
        this.QState = JSON.parse(json);
    }


};
function random(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}
