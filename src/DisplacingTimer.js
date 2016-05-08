/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Таймер, который по start() отталкивает момент вызова на таймаут секунд
 *
 */
function DisplacingTimer(context, tickHandler, interval, type){
    this.log= DisplacingTimer.log;
    this.context= context?context:this;
    this.tick= tickHandler;
    this.interval= interval;
    if (type!== undefined){
        this.type= type;
    }
    else{
        this.type= DisplacingTimer.Type.Timeout;
    }
    this.id= undefined;
    //this.start();
}

DisplacingTimer.log= log4javascript.getLogger("DisplacingTimer");
DisplacingTimer.Type={
    Timeout: 1,
    Interval: 2,
    timeout: 1,
    interval: 2
};

/**
 * Аналог timer.start(); если интервал не задан, немедленно вызывает tick
 */
DisplacingTimer.prototype.start= function(){
    var this2= this;
    
    if (this.type== DisplacingTimer.Type.Timeout){
        clearTimeout(this.id);
        if (this.interval){
            this.id= setTimeout(
                function (){
                    //this2.log.debug("DisplacingTimer.start() executing tick handler...");
                    this2.id= undefined;  //сброс идентификатора стоит до вызова обработчика, потмоу что в обработчике может вызываться sender.start() - повторный старт
                    this2.tick.call(this2.context, this2, {});
                },
                this.interval
            );
        }
        else{
            this.id= undefined;
            this.tick.call(this.context, this, {});
        }
    }
    else{
        clearInterval(this.id);
        this.id= setInterval(
            function (){
                //this2.log.debug("DisplacingTimer.start() executing tick handler...");
                this2.tick.call(this2.context, this2, {});
            },
            this.interval
        );
    }
};

DisplacingTimer.prototype.stop= function(){
    if (this.type== DisplacingTimer.Type.Timeout){
        clearTimeout(this.id);
    } else{
        clearInterval(this.id);
    }
    this.id= undefined;
};

DisplacingTimer.prototype.isStarted= function(){
    return this.id!==undefined;
};

DisplacingTimer.prototype.fireImmediately= function(){
    if (!this.isStarted()){
        throw new Error("таймер не запущен или уже отработал");
    }
    else{
        this.stop();
        this.tick.call(this.context, this, {});
        if (this.type== DisplacingTimer.Type.Interval){
            this.start();
        }
    }
};