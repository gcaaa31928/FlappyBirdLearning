var Brain = function (width_low, width_high, height_low, height_high) {
    // 0 for click, 1 for don't click
    this.width_range = [width_low, width_high];
    this.height_range = [height_low, height_high];
    this.width_dist = width_high - width_low;
    this.height_dist = height_high - height_low;
    this.sky_height = 450;
    this.action = 'noClick';
    this.QState = [];
    this.current_state = [0, 0, 0];
    this.next_state = [0, 0, 0];
    this.resolution = 6;
    this.sky_resolution = 30;
    this.learning_rate = 0.7;
    this.random_explore = 0.0001;
    for (var i = 0; i <= this.width_dist / this.resolution; i++) {
        this.QState[i] = [];
        for (var j = 0; j <= this.height_dist / this.resolution; j++) {
            this.QState[i][j] = [];
            for (var k = 0; k <= this.sky_height / this.sky_resolution; k++) {
                this.QState[i][j][k] = {
                    'click': 0,
                    'noClick': 0
                };
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
        this.current_state = [0, 0, 0];
        this.next_action = [1, 1, 1];
        this.action = 'noClick';
        this.next_action = 'noClick';
    };

    this.updateState = function (vertical_dist, horizontal_dist, sky_dist, reward) {
        // step 1: get state
        this.next_state = [vertical_dist, horizontal_dist, sky_dist];

        var vertical_state = Math.min(
            this.height_dist, this.current_state[0]
        );
        var horizontal_state = Math.min(
            this.width_dist, this.current_state[1]
        );
        var sky_state = Math.min(
            this.sky_height, this.current_state[2]
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
        vertical_state /= this.resolution;
        horizontal_state /= this.resolution;
        sky_state /= this.sky_resolution;
        vertical_next_state /= this.resolution;
        horizontal_next_state /= this.resolution;
        sky_next_state /= this.sky_resolution;
        vertical_state = vertical_state < 0 ? 0 : Math.floor(vertical_state);
        horizontal_state = horizontal_state < 0 ? 0 : Math.floor(horizontal_state);
        sky_state = sky_state < 0 ? 0 : Math.floor(sky_state);
        vertical_next_state = vertical_next_state < 0 ? 0 : Math.floor(vertical_next_state);
        horizontal_next_state = horizontal_next_state < 0 ? 0 : Math.floor(horizontal_next_state);
        sky_next_state = sky_next_state < 0 ? 0 : Math.floor(sky_next_state);

        // step 2: update
        if (vertical_next_state !== vertical_state || horizontal_next_state !== horizontal_state || sky_next_state !== sky_state) {
            if (vertical_state >= this.height_dist || vertical_state <= 0) {
                this.next_action = vertical_state >= this.height_dist ? 'noClick' : 'click';
            } else if (sky_state >= this.sky_height || sky_state <= 0) {
                this.next_action = sky_state >= 450 ? 'click' : 'noClick';
            } else {
                var click_q_next_value = this.QState[horizontal_next_state][vertical_next_state][sky_next_state]['click'];
                var no_click_q_next_value = this.QState[horizontal_next_state][vertical_next_state][sky_next_state]['noClick'];
                this.next_action = click_q_next_value > no_click_q_next_value ? 'click' : 'noClick';
            }
            var max_next_q = this.QState[horizontal_next_state][vertical_next_state][sky_next_state][this.next_action];
            var current_q_value = this.QState[horizontal_state][vertical_state][sky_state][this.action];
            this.QState[horizontal_state][vertical_state][sky_state][this.action] = current_q_value + this.learning_rate * (reward + max_next_q - current_q_value);
        }
        // step 4: update s with s'
        this.action = this.next_action;
        this.current_state = [this.next_state[0], this.next_state[1], this.next_state[2]];


        // step 3: take the action a
        return this.next_action;
    };

    // this.getAction = function () {
    //     if (Math.random() <= this.random_explore) {
    //         console.log('===== random explore =====');
    //         this.action = random(0, 1) == 1 ? 'click' : 'noClick';
    //     } else {
    //         var vertical_state = Math.min(
    //             this.height_dist, this.current_state[0]
    //         );
    //         var horizontal_state = Math.min(
    //             this.width_dist, this.current_state[1]
    //         );
    //         var sky_state = Math.min(
    //             this.sky_height, this.current_state[2]
    //         );
    //
    //         vertical_state /= this.resolution;
    //         horizontal_state /= this.resolution;
    //         sky_state /= this.resolution;
    //         vertical_state = vertical_state < 0 ? 0 : Math.floor(vertical_state);
    //         horizontal_state = horizontal_state < 0 ? 0 : Math.floor(horizontal_state);
    //         sky_state = sky_state < 0 ? 0 : Math.floor(sky_state);
    //         var click_q_value = this.QState[horizontal_state][vertical_state][sky_state]['click'];
    //         var no_click_q_value = this.QState[horizontal_state][vertical_state][sky_state]['noClick'];
    //         this.action = click_q_value > no_click_q_value ? 'click' : 'noClick';
    //         //console.log(this.current_state[0]);
    //
    //         // console.log(vertical_state, horizontal_state, click_q_value, no_click_q_value, this.action);
    //     }
    //     return this.action;
    // };

    // this.transferState = function () {
    //     this.current_state = [this.next_state[0], this.next_state[1], this.next_state[2]];
    // };

    this.toJson = function () {
        return JSON.stringify(this.QState);
    };

    this.fromJson = function (json) {
        this.QState = JSON.parse(json);
    };

    // this.printOnDebug = function () {
    //     $("#debug").text("");
    //     var debug_string = "";
    //     for (var i = 0; i < this.height_dist / this.resolution; i++) {
    //         for (var j = 0; j < this.width_dist / this.resolution; j++) {
    //             var debug_char = "<span ";
    //             if (this.QState[j][i]['click'] > this.QState[j][i]['noClick']) {
    //                 debug_char += "style=background:green;> C" + this.QState[j][i]['click'].toFixed(2);
    //             } else {
    //                 debug_char += "style=background:red;> N" + this.QState[j][i]['noClick'].toFixed(2);
    //             }
    //             debug_string = debug_string + debug_char;
    //         }
    //         debug_string = debug_string + "<br />";
    //     }
    //     $("#debug").append(debug_string);
    // }

};
function random(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

