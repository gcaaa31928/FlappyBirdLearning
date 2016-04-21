var Brain = require('../brain/brain.js');
var expect = require('chai').expect;

describe('Test Brain', function () {
    describe('constructor', function () {
        it('should correctly set value', function () {
            var brain = new Brain(0, 1, 0, 1, 1, 0, 1);
            expect(brain.width_range).to.eql([0, 1]);
            expect(brain.height_range).to.eql([0, 1]);
            expect(brain.velocity_range).to.eql([0, 1]);
            expect(brain.width_dist).to.eql(1);
            expect(brain.height_dist).to.eql(1);
            expect(brain.velocity_dist).to.eql(1);
        });
        it('should throw exception if low  value lower than high value', function () {
            expect(function () {
                new Brain(1, 0, 0, 1, 1, 0, 1);
            }).to.throw('width low must be lower than high value');
            expect(function () {
                new Brain(0, 1, 1, 0, 1, 0, 1);
            }).to.throw('height low must be lower than high value');
            expect(function () {
                new Brain(0, 1, 0, 1, -1, 0, 1);
            }).to.throw('sky height must be higher than zero');
            expect(function () {
                new Brain(0, 1, 0, 1, 1, 1, 0);
            }).to.throw('velocity low must be lower than high value');
        });
    });

    describe('QState', function () {
        it('should init QState correctly', function () {
            var brain = new Brain(0, 1, 0, 1, 1, 0, 1);
            brain.initQState();
            var expected = [];
            for (var i = 0; i <= 0; i++) {
                expected[i] = [];
                for (var j = 0; j <= 0; j++) {
                    expected[i][j] = [];
                    for (var k = 0; k <= 0; k++) {
                        expected[i][j][k] = [];
                        for (var v = 0; v <= 0; v++) {
                            expected[i][j][k][v] = {
                                'click': 0,
                                'noClick': 0
                            };
                        }
                    }
                }
            }
            expect(brain.QState).to.eql(expected);
        });
    });

    describe('restart', function () {
        it('should restart correctly', function () {
            var brain = new Brain(0, 4, 0, 4, 4, 0, 4);
            brain.current_state = [3, 3, 3, 3];
            brain.next_state = [4, 4, 4, 4];
            brain.restart();
            expect(brain.current_state).to.eql([0, 0, 0, 0]);
            expect(brain.next_state).to.eql([1, 1, 1, 1]);
            expect(brain.action).to.equal('noClick');
            expect(brain.next_action).to.equal('noClick');
        });
    });

    describe('set next state', function () {
        it('should set correctly', function () {
            var brain = new Brain(0, 4, 0, 4, 4, 0, 4);
            brain.setNextState(1, 1, 1, 1);
            expect(brain.next_state).to.eql([1, 1, 1, 1]);
        });
    });

    describe('bin vertical state', function () {
        it('should puts higher vertical state in corrects bins', function () {
            var brain = new Brain(0, 4, 0, 4, 4, 0, 4);
            brain.resolution = 2;
            expect(brain.binVerticalState(100)).to.equal(2);
        });
        it('should puts negative vertical state in corrects bins', function () {
            var brain = new Brain(0, 4, 0, 4, 4, 0, 4);
            brain.resolution = 2;
            expect(brain.binVerticalState(-100)).to.equal(0);
        });
        it('should puts float vertical state in corrects bins', function () {
            var brain = new Brain(0, 4, 0, 4, 4, 0, 4);
            brain.resolution = 2;
            expect(brain.binVerticalState(2.02000020202020)).to.equal(1);
        });
    });

    describe('bin horizontal state', function () {
        it('should puts higher horizontal state in corrects bins', function () {
            var brain = new Brain(0, 4, 0, 4, 4, 0, 4);
            brain.resolution = 2;
            expect(brain.binHorizontalState(100)).to.equal(2);
        });
        it('should puts negative horizontal state in corrects bins', function () {
            var brain = new Brain(0, 4, 0, 4, 4, 0, 4);
            brain.resolution = 2;
            expect(brain.binHorizontalState(-100)).to.equal(0);
        });
        it('should puts float horizontal state in corrects bins', function () {
            var brain = new Brain(0, 4, 0, 4, 4, 0, 4);
            brain.resolution = 2;
            expect(brain.binHorizontalState(2.02000020202020)).to.equal(1);
        });
    });

    describe('bin sky state', function () {
        it('should puts higher sky state in corrects bins', function () {
            var brain = new Brain(0, 4, 0, 4, 4, 0, 4);
            brain.sky_resolution = 2;
            expect(brain.binSkyDist(100)).to.equal(2);
        });
        it('should puts negative vertical state in corrects bins', function () {
            var brain = new Brain(0, 4, 0, 4, 4, 0, 4);
            brain.sky_resolution = 2;
            expect(brain.binSkyDist(-100)).to.equal(0);
        });
        it('should puts float vertical state in corrects bins', function () {
            var brain = new Brain(0, 4, 0, 4, 4, 0, 4);
            brain.sky_resolution = 2;
            expect(brain.binSkyDist(2.02000020202020)).to.equal(1);
        });
    });
    describe('bin velocity state', function () {
        it('should puts higher velocity state in corrects bins', function () {
            var brain = new Brain(0, 4, 0, 4, 4, 0, 4);
            brain.velocity_grid = 2;
            expect(brain.binVelocityState(100)).to.equal(2);
        });
        it('should puts negative velocity state in corrects bins', function () {
            var brain = new Brain(0, 4, 0, 4, 4, 0, 4);
            brain.velocity_grid = 2;
            expect(brain.binVelocityState(-100)).to.equal(0);
        });
        it('should puts float velocity state in corrects bins', function () {
            var brain = new Brain(0, 4, 0, 4, 4, 0, 4);
            brain.velocity_grid = 2;
            expect(brain.binVelocityState(2.02000020202020)).to.equal(1);
        });
    });

    describe('update QState', function () {
        it('vertical state in others region', function () {
            var brain = new Brain(0, 4, 0, 4, 4, 0, 4);
            brain.vertical_bin_offset = 0;
            brain.velocity_grid = 1;
            brain.resolution = 1;
            brain.sky_resolution = 1;
            brain.initQState();
            var action = brain.updateQState(0, 4, 0, 0, 0, 0, 0, 0, 'noClick', 0);
            expect(action).to.equal('noClick');
            action = brain.updateQState(0, 0, 0, 0, 0, 0, 0, 0, 0, 'noClick', 0);
            expect(action).to.equal('click');
        });
        it('update correctly information', function () {
            var brain = new Brain(0, 4, 0, 4, 4, 0, 4);
            brain.vertical_bin_offset = 0;
            brain.velocity_grid = 1;
            brain.resolution = 1;
            brain.sky_resolution = 1;
            brain.initQState();
            brain.updateQState(0, 4, 0, 0, 0, 0, 0, 0, 'noClick', 1000);
            var state = brain.QState[0][4][0][0]['noClick'];
            expect(state).to.equal(700);
            brain.updateQState(1, 1, 0, 0, 0, 4, 0, 0, 'click', -1000);
            state = brain.QState[1][1][0][0]['click'];
            expect(state).to.equal(-210);
            brain.updateQState(1, 0, 0, 0, 1, 1, 0, 0, 'click', 0.7);
        });
    });
    describe('update current state', function () {
        it('regularly update current state correctly', function () {
            var brain = new Brain(0, 4, 0, 4, 4, 0, 4);
            brain.action = null;
            brain.current_state = [1, 1, 1, 1];
            brain.next_action = 'noClick';
            brain.next_state = [5, 5, 5, 5];
            brain.updateCurrentState();
            expect(brain.action).to.equal('noClick');
            expect(brain.current_state).to.eql([5, 5, 5, 5]);
        });
    });
    describe('learning', function () {
        it('learning corretly', function () {
            var brain = new Brain(0, 4, 0, 4, 4, 0, 4);
            
        });
    });


});