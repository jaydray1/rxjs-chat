import { Subject } from 'rxjs/Subject';
import { Message } from '../message/message.model';
import { Observable } from 'rxjs/Observable';

export class MessageService {
    // this is a stream that publishes new messages only once 
    newMessages: Subject<Message> = new Subject<Message>();
    
    // this is a helper method that adds messages to the above stream
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

