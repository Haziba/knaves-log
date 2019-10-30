export class Write {
    type: string;
    when: Date = new Date();
    tags: string[];
    note: string;
    stats: Stat[];

    constructor(init?:Partial<Write>){
        this.tags = [];
        this.stats = [];

        Object.assign(this, init);
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

    constructor(init?:Partial<StatAndUnits>){
        this.Units = [];

        Object.assign(this, init);
    }
}

export class AutoComplete {
    types: string[];
    tags: string[];
    stats: StatAndUnits[];

    constructor(init?:Partial<AutoComplete>){
        this.types = [];
        this.tags = [];
        this.stats = [];

        Object.assign(this, init);
    }
}