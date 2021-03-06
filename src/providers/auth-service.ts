import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { baseUrl } from '../config/config'
import 'rxjs';

/*
  Generated class for the FriendService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthService {
  
  constructor(private http: Http, private storage: Storage) {}
  
  /*
    Using the details provided by the user, attempt to get a token from the api.
    If a token is successfuly retrieved, get the user information and store both
    the user and their token in local storage.
  */
  public login(credentials) {
    if (credentials.username === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        let url = `${baseUrl}/tokenlogin/`;
        
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let options = new RequestOptions({ headers: headers });
        
        let login_data = {
          "username": credentials.username, 
          "password": credentials.password
        };
        
        this.http.post(url, JSON.stringify(login_data), options)
          .map(res => res.json().token)
          .subscribe(token => {
            this.setToken(`Token ${token}`).subscribe(done => {
              observer.next(true);
              observer.complete(); 
            });                  
          }, err => {
            observer.next(false);
          })
        });
    }
  }

  public register(credentials) {
    if (credentials.username === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        let url = `${baseUrl}/register/`;
        
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let options = new RequestOptions({ headers: headers });
        
        let register_data = {
          "username": credentials.username, 
          "password": credentials.password
        };
        
        this.http.post(url, register_data, options)
          .subscribe(done => {
            observer.next(true);
            observer.complete();       
          }, err => {
            observer.next(false);
          })
        });
    }
  }
  
  public getToken() : any {
    return Observable.create(observer => {
      this.storage.get('token').then(value => { 
        if (value === null) {
          observer.error(new Error('No token found'));  
        } else {
          observer.next(value);
        }
      },
      err => { 
        observer.error(err);
      });
    })
  }
  
  public setToken(token) {
    return Observable.create(observer => {
      this.storage.ready().then(() => { 
        this.storage.set('token', token).then(() => {
          observer.next(true);
        });
      }).catch((err) => {
          console.log(err);
      });
    })
  }

  public logout() {
    return Observable.create(observer => {
      this.storage.clear().then(() => {
        observer.next(true);
        observer.complete();
      });
    });
  }

}
