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
            expect(brain.current_state, [0, 0, 0, 0]);
            expect(brain.next_state, [1, 1, 1, 1]);
        });
    });
});