import { Injectable } from "@nestjs/common";
import { Jwt } from "./jwt"
import { Bcrypt } from "./bcrypt"
import { Aws } from "./aws"

@Injectable()
export class Utils {
    public jwt: Jwt;
    public bcrypt: Bcrypt;
    public aws: Aws;
    constructor(
    ) {
        this.jwt = new Jwt();
        this.bcrypt = new Bcrypt();
        this.aws = new Aws();
    }
}