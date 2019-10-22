export class Write {
    type: string;
    when: Date = new Date();
    tags: string[];
    note: string;
    stats: Stat[];

    constructor(){
        this.tags = [];
        this.stats = [];
    }
}

export class Stat {
    name: string;
    value: number;
    units: string;
}

export class StatAndUnits {
    Stat: string;
    Units: string[];
}

export class AutoComplete {
    types: string[];
    tags: string[];
    stats: StatAndUnits[];

    constructor(){
        this.types = [];
        this.tags = [];
        this.stats = [];
    }
}