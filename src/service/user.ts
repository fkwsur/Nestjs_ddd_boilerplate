import * as shortid from 'shortid';
import { Injectable } from '@nestjs/common';
import { User } from 'src/domain/user';
import { Repository } from '../repository';
import { Utils } from '../utils';
import * as r from "../application/response";

@Injectable()
export class UserService {
  constructor(
    private readonly repo: Repository,
    private readonly u: Utils,
  ) {}

  async SignUp(req: User.UserDTO): Promise<Error | true> {
    try {
      req.refresh_token = this.u.jwt.CreateRefreshToken(req.id);
      req.id = shortid.generate();
      req.birth = new Date(req.birth);
      req.app_key = this.u.bcrypt.encrypt(req.app_key);
      return await this.repo.userRepository.CreateUser(req);
    } catch (error) {
      throw error;
    }
  }

  async SignIn(req: User.UserDTO): Promise<Error | User.Token> {
    try {
      const rows = await this.repo.userRepository.findOne(req);
      if(!rows) throw r.TypeError(1)
      const CheckAppkey = this.u.bcrypt.compare(req.app_key, rows.app_key)
      if (!CheckAppkey) throw r.TypeError(2);
      const token = r.Token(this.u.jwt.CreateAccessToken(rows.id),this.u.jwt.CreateRefreshToken(rows.id))
      await this.repo.userRepository.UpdateRToken(token.refreshToken, rows.id);
      return token;
    } catch (error) {
      throw error;
    }
  }

}
