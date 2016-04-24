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
    this.velocity_grid = 60;
    this.sky_resolution = 150;
    this.learning_rate = 0.7;
    this.random_explore = 0.0001;
    this.vertical_bin_offset = 25;

    if (width_low > width_high)
        throw 'width low must be lower than high value';
    if (height_low > height_high)
        throw 'height low must be lower than high value';
    if (sky_height < 0)
        throw 'sky height must be higher than zero';
    if (velocity_low > velocity_height)
        throw 'velocity low must be lower than high value';

    this.initQState = function () {
        for (var i = 0; i <= this.width_dist / this.resolution; i++) {
            this.QState[i] = [];
            for (var j = 0; j <= this.height_dist / this.resolution; j++) {
                this.QState[i][j] = [];
                for (var k = 0; k <= this.sky_height / this.sky_resolution; k++) {
                    this.QState[i][j][k] = [];
                    for (var v = 0; v <= this.velocity_dist / this.velocity_grid; v++) {
                        this.QState[i][j][k][v] = {
                            'click': 0,
                            'noClick': 0
                        };
                    }
                }
            }
        }
    };


    this.restart = function () {
        this.current_state = [0, 0, 0, 0];
        this.next_state = [1, 1, 1, 1];
        this.action = 'noClick';
        this.next_action = 'noClick';
    };

    this.setNextState = function (vertical_dist, horizontal_dist, sky_dist, velocity) {
        this.next_state = [vertical_dist, horizontal_dist, sky_dist, velocity];
    };

    this.updateCurrentState = function () {
        this.action = this.next_action;
        this.current_state = [this.next_state[0], this.next_state[1], this.next_state[2], this.next_state[3]];
    };

    this.binVerticalState = function (vertical_state) {
        var vertical_bin = Math.min(
            this.height_dist, vertical_state
        );
        vertical_bin /= this.resolution;
        return vertical_bin < 0 ? 0 : Math.floor(vertical_bin);
    };

    this.binHorizontalState = function (horizontal_state) {
        var horizontal_bin = Math.min(
            this.width_dist, horizontal_state
        );
        horizontal_bin /= this.resolution;
        return horizontal_bin < 0 ? 0 : Math.floor(horizontal_bin);
    };

    this.binSkyDist = function (sky_state) {
        var sky_bin = Math.min(this.sky_height, sky_state);
        sky_bin /= this.sky_resolution;
        return sky_bin < 0 ? 0 : Math.floor(sky_bin);
    };

    this.binVelocityState = function (velocity) {
        var velocity_bin = Math.min(this.velocity_dist, velocity);
        velocity_bin /= this.velocity_grid;
        return velocity_bin < 0 ? 0 : Math.floor(velocity_bin);
    };

    this.updateQState = function (horizontal_state,
                                  vertical_state,
                                  sky_state,
                                  velocity_state,
                                  horizontal_next_state,
                                  vertical_next_state,
                                  sky_next_state,
                                  velocity_next_state,
                                  previous_action,
                                  reward) {
        var action = null;
        if (vertical_state >= (this.height_dist / this.resolution) - this.vertical_bin_offset || vertical_state <= this.vertical_bin_offset) {
            action = vertical_state >= (this.height_dist / this.resolution) - this.vertical_bin_offset ? 'noClick' : 'click';
        } else {
            var click_q_next_value = this.QState[horizontal_next_state][vertical_next_state][sky_next_state][velocity_next_state]['click'];
            var no_click_q_next_value = this.QState[horizontal_next_state][vertical_next_state][sky_next_state][velocity_state]['noClick'];
            action = click_q_next_value > no_click_q_next_value ? 'click' : 'noClick';
        }
        var max_next_q = this.QState[horizontal_next_state][vertical_next_state][sky_next_state][velocity_next_state][action];
        var current_q_value = this.QState[horizontal_state][vertical_state][sky_state][velocity_state][previous_action];
        this.QState[horizontal_state][vertical_state][sky_state][velocity_state][previous_action] = current_q_value + this.learning_rate * (reward + max_next_q - current_q_value);
        return action;
    };


    this.learning = function (horizontal_dist, vertical_dist, sky_dist, velocity, reward) {
        // step 1: get state
        this.setNextState(vertical_dist, horizontal_dist, sky_dist, velocity);
        var vertical_state = this.binVerticalState(this.current_state[0]);
        var horizontal_state = this.binHorizontalState(this.current_state[1]);
        var sky_state = this.binSkyDist(this.current_state[2]);
        var velocity_state = this.binVelocityState(this.current_state[3]);

        var vertical_next_state = this.binVerticalState(this.next_state[0]);
        var horizontal_next_state = this.binHorizontalState(this.next_state[1]);
        var sky_next_state = this.binSkyDist(this.next_state[2]);
        var velocity_next_state = this.binVelocityState(this.next_state[3]);

        // step 2: update

        this.next_action = this.updateQState(
            horizontal_state,
            vertical_state,
            sky_state,
            velocity_state,
            horizontal_next_state,
            vertical_next_state,
            sky_next_state,
            velocity_next_state,
            this.action,
            reward
        );

        // step 4: update s with s'
        this.updateCurrentState();

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


module.exports = Brain;