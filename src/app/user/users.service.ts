// we are making a class here that we can use as dependencies in our other 
// components. 2 benefits of DI are: 1) we let Angular handle the lifecycle 
// of the object and 2) it's easier to test injected components
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from '../user/user.model';

@Injectable()
export class UsersService {
    // currentuser contains the current user
    // this here is a STREAM
    // Here, we are 1) definining an INSTANCE VARIABLE which is A SUBJECT STREAM
    // currentUser is a BehaviorSubject which will contain USER
    // BUUUUT, the FIRST VALUE of the STREAM is NULL - the constructor argument
    // You can think of SUBJECT as a "read/write" stream
    // BehaviorSubject stores the last value, so we can know WHO
    // the latest/most current user Is 
    currentUser: Subject<User> = new BehaviorSubject<User>(null);

    // typescript docs say void is used when returning either undefined or null
    // or/aka no value at all - not sure how this fits in here
    public setCurrentUser(newUser: User):void {
        this.currentUser.next(newUser);
    }
}
export const userServiceInjectables: Array<any> = [
    UsersService
];