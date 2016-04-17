function Pipes(context) {
    this.context = context;
    this.game = this.context.game;
    this.groups = this.game.add.group();
    this.closestPipe = [];

    this.preload = function () {
        this.game.load.image('pipes', 'assets/pipe.png');
    };

    this.create = function () {
        this.groups = this.game.add.group();
        this.addRowOfPipes();
        this.timer = this.game.time.events.loop(1800, this.addRowOfPipes, this);
    };

    this.addOnePipe = function (x, y, mark) {
        var pipe = this.game.add.sprite(x, y, 'pipes');
        pipe.marked = mark;
        this.groups.add(pipe);
        this.game.physics.arcade.enable(pipe);
        pipe.body.velocity.x = -200;
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    };

    this.addRowOfPipes = function () {
        this.closestPipe = [];
        var hole = Math.floor(Math.random() * 5) + 1;

        for (var i = 0; i < 8; i++) {
            if (i == hole + 2) {
                this.addOnePipe(800, i * 60 + 10, true);
            } else if (i != hole && i != hole + 1) {
                this.addOnePipe(800, i * 60 + 10, false);
            }
        }
        var that = this;
        this.groups.forEachDead(function (pipe) {
            that.groups.remove(pipe);
        });
        this.context.score += 1;
    };


}