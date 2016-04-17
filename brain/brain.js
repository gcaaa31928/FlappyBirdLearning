var Brain = function (width_low, width_high, height_low, height_high, sky_height, velocity_low, velocity_height) {
    // 0 for click, 1 for don't click
    this.width_range = [width_low, width_high];
    this.height_range = [height_low, height_high];
    this.width_dist = width_high - width_low;
    this.height_dist = height_high - height_low;
    this.sky_height = sky_height;
    this.velocity_range = [velocity_low, velocity_height];
    this.velocity_dist = velocity_height - velocity_low;
    this.action = 'noClick';
    this.QState = [];
    this.current_state = [0, 0, 0, 0];
    this.next_state = [0, 0, 0, 0];
    this.resolution = 4;
    this.velocity_grid = 20;
    this.sky_resolution = 150;
    this.learning_rate = 0.7;
    this.random_explore = 0.0001;
    for (var i = 0; i <= this.width_dist / this.resolution; i++) {
        this.QState[i] = [];
        for (var j = 0; j <= this.height_dist / this.resolution; j++) {
            this.QState[i][j] = [];
            for (var k = 0; k <= this.sky_height / this.sky_resolution; k++) {
                this.QState[i][j][k] = [];
                for(var v = 0;v<=this.velocity_dist/this.velocity_grid;v++) {
                    this.QState[i][j][k][v] = {
                        'click': 0,
                        'noClick': 0
                    };
                }
            }
        }
    }

    // this.setCurrentState = function (vertical_dist, horizontal_dist, sky_height) {
    //     this.current_state = [vertical_dist, horizontal_dist, sky_height];
    // };
    //
    // this.getState = function (vertical_dist, horizontal_dist, sky_height) {
    //     this.next_state = [vertical_dist, horizontal_dist, sky_height];
    // };
    this.restart = function () {
        this.current_state = [0, 0, 0, 0];
        this.next_action = [1, 1, 1, 1];
        this.action = 'noClick';
        this.next_action = 'noClick';
    };

    this.updateState = function (vertical_dist, horizontal_dist, sky_dist, velocity, reward) {
        // step 1: get state
        this.next_state = [vertical_dist, horizontal_dist, sky_dist, velocity];

        var vertical_state = Math.min(
            this.height_dist, this.current_state[0]
        );
        var horizontal_state = Math.min(
            this.width_dist, this.current_state[1]
        );
        var sky_state = Math.min(
            this.sky_height, this.current_state[2]
        );
        var velocity_state = Math.min(
            this.velocity_dist, this.current_state[3]
        );
        var vertical_next_state = Math.min(
            this.height_dist, this.next_state[0]
        );
        var horizontal_next_state = Math.min(
            this.width_dist, this.next_state[1]
        );
        var sky_next_state = Math.min(
            this.sky_height, this.next_state[2]
        );
        var velocity_next_state = Math.min(
            this.velocity_dist, this.next_state[3]
        );
        vertical_state /= this.resolution;
        horizontal_state /= this.resolution;
        sky_state /= this.sky_resolution;
        velocity_state /= this.velocity_grid;
        vertical_next_state /= this.resolution;
        horizontal_next_state /= this.resolution;
        sky_next_state /= this.sky_resolution;
        velocity_next_state /= this.velocity_grid;
        vertical_state = vertical_state < 0 ? 0 : Math.floor(vertical_state);
        horizontal_state = horizontal_state < 0 ? 0 : Math.floor(horizontal_state);
        sky_state = sky_state < 0 ? 0 : Math.floor(sky_state);
        velocity_state = velocity_state < 0 ? 0 : Math.floor(velocity_state);
        vertical_next_state = vertical_next_state < 0 ? 0 : Math.floor(vertical_next_state);
        horizontal_next_state = horizontal_next_state < 0 ? 0 : Math.floor(horizontal_next_state);
        sky_next_state = sky_next_state < 0 ? 0 : Math.floor(sky_next_state);
        velocity_next_state = velocity_next_state < 0 ? 0 : Math.floor(velocity_next_state);

        // step 2: update

        if (vertical_state >= (this.height_dist / this.resolution) - 30 || vertical_state <= 25) {
            this.next_action = vertical_state >= (this.height_dist / this.resolution) - 30 ? 'noClick' : 'click';
        } else {
            var click_q_next_value = this.QState[horizontal_next_state][vertical_next_state][sky_next_state][velocity_next_state]['click'];
            var no_click_q_next_value = this.QState[horizontal_next_state][vertical_next_state][sky_next_state][velocity_state]['noClick'];
            this.next_action = click_q_next_value > no_click_q_next_value ? 'click' : 'noClick';
        }
        var max_next_q = this.QState[horizontal_next_state][vertical_next_state][sky_next_state][velocity_next_state][this.next_action];
        var current_q_value = this.QState[horizontal_state][vertical_state][sky_state][velocity_state][this.action];
        this.QState[horizontal_state][vertical_state][sky_state][velocity_state][this.action] = current_q_value + this.learning_rate * (reward + max_next_q - current_q_value);
        // step 4: update s with s'

        this.action = this.next_action;
        this.current_state = [this.next_state[0], this.next_state[1], this.next_state[2], this.next_state[3]];


        // step 3: take the action a
        return this.next_action;
    };

    this.toJson = function () {
        return JSON.stringify(this.QState);
    };

    this.fromJson = function (json) {
        this.QState = JSON.parse(json);
    };


};
function random(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

