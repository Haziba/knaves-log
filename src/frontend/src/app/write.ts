export class Write {
    type: string;
    when: Date = new Date();
    tags: string[];
    note: string;
    stats: Stat[];
}

export class Stat {
    name: string;
    value: number;
    units: string;
}