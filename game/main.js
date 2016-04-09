var game = new Phaser.Game(800, 490, Phaser.AUTO, 'game_area');
var agent = new Agent(400, 300);
var reward_chart = new rewardChart();
var net_chart = new netChart(agent.width_dist / 20, agent.height_dist / 15);
var reward_arr = [];
var mainState = {

    times: 0,
    preload: function () {

        game.stage.disableVisibilityChange = true;
        game.config.forceSetTimeOut = true;
        this.created = false;
        // This function will be executed at the beginning
        // That's where we load the images and sounds
        this.context = {
            score: 0,
            game: game
        };
        this.bird = new Bird(game);
        this.bird.preload();

        this.pipes = new Pipes(this.context);
        this.pipes.preload();
    },

    create: function () {
        // Change the background color of the game to blue

        game.stage.backgroundColor = '#71c5cf';
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0",
            {font: "30px Arial", fill: "#ffffff"});
        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Display the bird at the position x=100 and y=245
        // set bird 
        this.bird.create();
        this.bird.setInputHandler();
        this.pipes.create();


        this.created = true;
    },


    update: function () {
        if (!this.created)
            return;
        this.reward = 1;
        if (this.bird.died()) {
            this.restartGame();
            this.reward = -1000;
        }
        game.physics.arcade.overlap(
            this.bird.sprite, this.pipes.groups, this.restartGame, null, this);
        this.bird.update();
        this.labelScore.text = this.context.score;


        learning();
    },

    destroy: function() {
        this.bird.sprite.destroy();
        this.pipes.groups.destroy();
    },

    // Restart the game
    restartGame: function () {
        // Start the 'main' state, which restarts the game
        this.reward = -1000;
        drawChart();
        game.time.events.remove(this.timer);
        game.state.start('main');
        this.times++;
    }
};

function drawChart() {
    reward_arr.push([mainState.times, mainState.context.score]);
    reward_chart.updateData(reward_arr);
    net_chart.updateData([[0,0,1],[0,1,100],[1,1,1000]]);
}

function learning() {
    var actionix = agent.think(mainState.bird, mainState.pipes, mainState.reward);
    if (actionix == 'click') {
        mainState.bird.jump();
    }
}

var startLearn = function () {
    agent.brain.learning = true;
};
var stopLearn = function () {
    agent.brain.learning = false;
};

var saveNet = function () {
    var j = agent.brain.toJson();
    document.getElementById('tt').value = j;
};

var loadNet = function () {
    var t = document.getElementById('tt').value;
    agent.brain.fromJson(t);
};

// Add and start the 'main' state to start the game
game.state.add('main', mainState);
game.state.start('main');
