var Agent = function (width_low, width_high, height_low, height_high, sky_high, velocity_low, velocity_high) {
    this.width_range = [width_low, width_high];
    this.height_range = [height_low, height_high];
    this.velocity_range = [velocity_low, velocity_high];
    this.brain = new Brain(width_low, width_high, height_low, height_high, sky_high, velocity_low, velocity_high);
    this.brain.initQState();
};

Agent.prototype = {
    think: function (bird, pipes, reward, first) {

        var bird_back_x = bird.sprite.x;
        var bird_back_y = bird.sprite.y;

        var closest_pipe_x = 9999;
        var closest_pipe_y = 9999;
        for (var i = 0; i < pipes.groups.length; i++) {
            var pipe = pipes.groups.getChildAt(i);
            if (bird_back_x >= pipe.x + pipe.width)
                continue;
            if (pipe.marked && pipe.x + pipe.width < closest_pipe_x) {
                closest_pipe_x = pipe.x + pipe.width;
                closest_pipe_y = pipe.y;
            }
        }
        var vertical_dist = closest_pipe_y - bird_back_y - this.height_range[0];
        var horizontal_dist = closest_pipe_x - bird_back_x - this.width_range[0];
        var sky_dist = bird_back_y;
        var velocity_dist = bird.sprite.body.velocity.y - this.velocity_range[0];
        if (isNaN(velocity_dist))
            velocity_dist = 0;
        return this.brain.learning(horizontal_dist, vertical_dist, sky_dist, velocity_dist, reward);
    }
};