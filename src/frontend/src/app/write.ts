export class Write {
    type: string;
    when: Date = new Date();
    tags: string[];
    note: string;
    stats: { [stat: string] : number }
}