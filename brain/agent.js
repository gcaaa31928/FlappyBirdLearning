var Agent = function () {
    this.actions = [];
    this.brain = brain;
};

Agent.prototype = {
    forward: function (bird, pipes) {
        var input_array = [];
        input_array[0] = bird.sprite.x;
        input_array[1] = bird.sprite.y;
        // for (var i = 1; i <= pipes.groups.length; i++) {
        //     var pipe = pipes.groups.getChildAt(i - 1);
        //     input_array[i * 2] = pipe.x;
        //     input_array[i * 2 + 1] = pipe.y;
        // }
        this.actionix = this.brain.forward(input_array);
        console.log(this.actionix);
        return this.actionix;
    },
    backward: function (score) {
        this.brain.backward(score);
    }
};