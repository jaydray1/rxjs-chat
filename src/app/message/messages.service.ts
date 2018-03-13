import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Message } from '../message/message.model';
import { Observable } from 'rxjs/Observable';
import { User } from '../user/user.model';
import { Thread } from '../thread/thread.model';
import { Message } from '../message/message.model';

const initialMessages: Message[] = [];
interface IMessagesOperation extends Function {
    (messages: Message[]): Message[];
}

export class MessagesService {
    // this is a stream that publishes new messages only once 
    newMessages: Subject<Message> = new Subject<Message>();
    messages: Observable<Message[]>;
    // updates receives 'operations' that will be applied to our list of messages
    // we connect this in the constructor of the MessagesService
    updates: Subject<any> = new Subject<any>();
    create: Subject<Message> = new Subject<Message>();
    markThreadAsRead: Subject<any> = new Subject<any>();
    // this is a helper method that adds messages to the above stream
    
    constructor() {
        // scan is a lot like reduce - it runs the function for each element in the
        // screen and accumulates a value: it's specialty is that it will
        // emit a value for each intermediate result
        this.messages = this.updates
            .scan((messages: Message[],
                    operation: IMessagesOperation) => {
                        return operation(messages);
                    },
                        initialMessages)
                        .publishReplay(1)
                        .refCount();
        this.create
            .map(function(message: Message): IMessagesOperation {
                return (messages: Message[]) => {
                    return messages.concat(message);
                };
            })
            .subscribe(this.updates);
        this.newMessages
            .subscribe(this.create);

        this.markThreadAsRead
            .map((thread: Thread) => {
                return (messages: Message[]) => {
                    return messages.map((message: Message) => {
                        if (message.thread.id === thread.id) {
                            message.isRead = true;
                        }
                        return message;
                    });
                };
            })
            .subscribe(this.updates);
    }
    // an imperative function call to this action stream
    addMessage(message: Message): void {
        this.newMessages.next(message);
    }
    messagesForThreadUser(thread: Thread, user: User): Observable<Message> {
        return this.newMessages
            .filter((message: Message) => {
                return (message.thread.id === thread.id) &&
                        (message.author.id !== user.id);
            });
    }
}
export const messagesServicesInjectables: Array<any> = [MessagesService];

// streams are not sharable by default - if one subscriber reads a value from
// a stream it could be gone forever. Here we want to share the stream 
// among multiple subscribers and allow late subscribers to see the latest/ or last
// value emitted from the stream. We can use 2 operators, PUBLISHREPLAY and
// REFCOUNT



