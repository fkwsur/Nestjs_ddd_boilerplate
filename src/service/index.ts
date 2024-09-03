import { Injectable } from "@nestjs/common";
import { UserService } from "./user"
import { Repository } from "../repository";
import { Utils } from "../utils";

@Injectable()
export class Service {
    public userService: UserService;
    constructor(
        repo : Repository,
        utils : Utils,
    ) {
        this.userService = new UserService(repo,utils);
    }
}