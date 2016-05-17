/**
 * Created by alexey2baranov on 5/17/16.
 */
var DisplacingTimer= require("../src/DisplacingTimer");

describe('DisplacingTimer', function() {
    describe('#start()', function() {
        it('Timer callback should be called after 500msec', function(done) {
            var timer= new DisplacingTimer(null, function(){
                done();
            }, 500, DisplacingTimer.Type.Timeout);

            timer.start();
        });
    });
});