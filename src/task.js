export class SvelteTask {

    constructor(gantt, task, row){
        this.gantt = gantt;
        Object.assign(this, {
            classes: ''
        }, task);
        this.row = row;
        this.dependencies = [];
        this.updatePosition();
    }

    notify() {
        if(this.dependencies){
            this.dependencies.forEach(dependency => {
                dependency.update();
            });
        }
    }

    updatePosition(){
        const left = this.gantt.utils.getPositionByDate(this.from);
        const right = this.gantt.utils.getPositionByDate(this.to); 

        this.left = left;
        this.width = right - left;
    }

    updateDate(){
        const from = this.gantt.utils.getDateByPosition(this.left);
        const to = this.gantt.utils.getDateByPosition(this.left + this.width);
                   
        const roundedFrom = this.gantt.utils.roundTo(from);
        const roundedTo = this.gantt.utils.roundTo(to);

        if(!roundedFrom.isSame(roundedTo)){
            this.from = roundedFrom;
            this.to = roundedTo;
        }
    }

    overlaps(other) {
        return !(this.left + this.width <= other.left || this.left >= other.left + other.width);
    }

    subscribe(dependency) {
        this.dependencies.push(dependency);
    }

    unsubscribe(dependency) {
        let result = [];
        for(let i = 0; i < this.dependencies.length; i++) {
            if(this.dependencies[i] === dependency) {
                result.push(dependency);
            }
        }

        for(let i = 0; i < result.length; i++) {
            let index = this.dependencies.indexOf(result[i]);
            this.dependencies.splice(index, 1);
        }
    }

    updateView() {
        if(this.component) {
            this.component.set({task: this});
        }
    }
}
