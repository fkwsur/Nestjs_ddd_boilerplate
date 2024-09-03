import * as bcrypt from "bcryptjs";

export class Bcrypt {
    constructor(
    ){};
encrypt = (password: string):string => {
        const salt = bcrypt.genSaltSync(8);
        return bcrypt.hashSync(password, salt);
};
compare = (password: string, dbPassword: string): boolean => {
    return bcrypt.compareSync(password, dbPassword);
};
}
