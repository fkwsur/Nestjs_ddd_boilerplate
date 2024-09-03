import { Injectable } from "@nestjs/common";
import { Infrastructure } from "src/infrastructure";
import { Prisma } from "@prisma/client";
import { User } from "src/domain/user";

@Injectable()
export class UserRepository {
    constructor(
        private readonly infrastructure: Infrastructure,
    ){};

    async CreateUser(user: Prisma.UserCreateInput):Promise<Error | true>{
        try {
            await this.infrastructure
                .mysql
                .user
                .create({
                    data: user,
                });
            return true;
        } catch (error) {
            throw error;
        }
    }

    async findOne(user: Prisma.UserCreateInput):Promise<User.UserDTO>{
        try {
            return await this.infrastructure
                .mysql
                .user
                .findFirst({
                    where: { oauth_id: user.oauth_id },
                });
        } catch (error) {
            throw error;
        }
    }

    async UpdateRToken(refreshToken: string, id : string):Promise<User.UserDTO>{
        try {
            return await this.infrastructure
                .mysql
                .user
                .update({
                    where: { id: id },
                    data: {
                        refresh_token: refreshToken
                    }
                });
        } catch (error) {
            throw error;
        }
    }
}