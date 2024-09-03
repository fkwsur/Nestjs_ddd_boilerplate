import { Injectable } from "@nestjs/common";
import { Infrastructure } from "src/infrastructure";
import { UserRepository } from "./user";

@Injectable()
export class Repository {
    public userRepository: UserRepository;
    constructor(
        infrastructure: Infrastructure,
    ){
        this.userRepository = new UserRepository(infrastructure);
    }
}