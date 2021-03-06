import { uuid } from '../../../node_modules/uuid';

export class User {
    id: string;

    constructor(public name: string,
                public avatarSrc: string) {
                    this.id = uuid();
                }
}
