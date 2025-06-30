import { Injectable } from "@nestjs/common";
import { Infrastructure } from '../infrastructure';
import { Repository } from "../repository";
import { Utils } from "../utils";
import { UserService } from "./user";

@Injectable()
export class Service {
    public userService: UserService;
    constructor(
        repo : Repository,
        utils : Utils,
        infra: Infrastructure,
    ) {
        this.userService = new UserService(repo,utils,infra);
    }
}