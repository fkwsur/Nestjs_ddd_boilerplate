import { Injectable } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class Jwt {
    constructor(
    ){};

    CreateAccessToken = (id: string): string => {
        return jwt.sign(
            {
                id: id
            },
            process.env.ACCESS_KEY,
            {
                algorithm: "HS256",
                expiresIn: "5m"
            }
        )
    };
    CreateRefreshToken = (id: string): string => {
        return jwt.sign(
            {
                id: id,
            },
            process.env.REFRESH_KEY,
            {
                algorithm: "HS256",
                expiresIn: "7d",
            }
        )
    };
    VerifyAccessToken = (token: string): any => {
        try {
            return jwt.verify(token, process.env.ACCESS_KEY);
        } catch (error) {
            console.error(error);
            return null;
        }
    };
    VerifyRefreshToken = (token: string): any => {
        try {
            return jwt.verify(token, process.env.REFRESH_KEY);
        } catch (error) {
            return error;
        }
    };


}
