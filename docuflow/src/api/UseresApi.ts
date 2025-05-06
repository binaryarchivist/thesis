import client from './axiosClient';

export default class UsersApi {
  static getUsers() {
    return client.get('/users/');
  }
}
