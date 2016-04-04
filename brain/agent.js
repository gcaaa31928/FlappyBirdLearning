var Agent = function() {
    this.actions = [];
    this.brain = brain;
};

Agent.prototype = {
    forward: function (bird, pipe) {
        var input_array = [];
        // input_array[0] = bird.sprite.x;
        // input_array[1] = bird.sprite.y;

        for (var i = 0; i < pipe.closestPipe.length; i++) {
            input_array[i * 2] = pipe.closestPipe[i].x;
            input_array[i * 2 + 1] = pipe.closestPipe[i].y;
        }
        input_array[i * pipe.closestPipe.length] = bird.sprite.x;
        input_array[i * pipe.closestPipe.length + 1] = bird.sprite.y;
        this.actionix = this.brain.forward(input_array);
        return this.actionix;
    },
    backward: function(score) {
        this.brain.backward(score);
    }
};