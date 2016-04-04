function Bird(game) {
    this.game = game;

    this.preload = function () {
        this.game.load.image('bird', 'assets/bird.png')
    };

    this.create = function () {
        this.sprite = this.game.add.sprite(100, 245, 'bird');
        this.sprite.anchor.setTo(-0.2, 0.5);
        this.game.physics.arcade.enable(this.sprite);
        this.sprite.body.gravity.y = 1000;

        this.bitmap = this.game.add.bitmapData(this.game.width, this.game.height);
        this.bitmap.context.fillStyle = 'rgb(255, 255, 255)';
        this.bitmap.context.strokeStyle = 'rgb(255, 255, 255)';
        this.game.add.image(0, 0, this.bitmap);
    };

    this.setInputHandler = function () {
        var spaceKey = this.game.input.keyboard.addKey(
            Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
    };

    this.jump = function () {
        // Add a vertical velocity to the bird
        this.sprite.body.velocity.y = -350;
        // Create an animation on the bird
        var animation = this.game.add.tween(this.sprite);

        // Change the angle of the bird to -20° in 100 milliseconds
        animation.to({angle: -20}, 100);

        // And start the animation
        animation.start();
    };

    this.update = function () {
        if (this.sprite.angle < 20)
            this.sprite.angle += 1;
    };
    
    this.died = function() {
        return (this.sprite.y < 0 || this.sprite.y > 450);
    };

    this.almostDied = function (pipes) {
        if (this.sprite.y < 50 || this.sprite.y > 400) {
            console.log('almost died');
            return true;
        }
        var ray = new Phaser.Line(this.sprite.x, this.sprite.y, this.sprite.x + this.sprite.width + 1000, this.sprite.y);
        var weight = 1;
        for (var i = 0; i < pipes.groups.length; i++) {
            var pipe = pipes.groups.getChildAt(i);
            var pipeLine = new Phaser.Line(pipe.x, pipe.y, pipe.x, pipe.y + pipe.height);
            var intersect = Phaser.Line.intersects(ray, pipeLine);
            if (intersect) {
                var distance = this.game.math.distance(ray.start.x, ray.start.y, intersect.x, intersect.y);
                weight = distance / 1000;
            }
        }
        this.bitmap.context.clearRect(0, 0, game.width, game.height);
        this.bitmap.context.beginPath();
        this.bitmap.context.moveTo(this.sprite.x, this.sprite.y);
        this.bitmap.context.lineTo(this.sprite.x + this.sprite.width + 1000, this.sprite.y);
        this.bitmap.context.stroke();
        this.bitmap.dirty = true;
        if (weight <= 0.1) {
            console.log('almost died');
            return true;
        }
        return weight;
    };

}