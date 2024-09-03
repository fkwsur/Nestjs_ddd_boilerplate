import * as base from './base';

export namespace User {
  export interface UserDTO extends base.BaseModel, base.CommonModel {
    oauth_id: string;
    nickname: string;
    app_key: string;
    phone: string;
    birth: Date;
    gender: string;
    email: string;
    platform: string;
    refresh_token: string;
  }
  export interface Token {
    accessToken?: string;
    refreshToken?: string;
  }
}
