import { Inject, Injectable, Type } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Client, Subscription } from 'webstomp-client';
import { environment } from '../environments/environment';
import { WEBSOCKET, WEBSTOMP } from './app.tokens';

@Injectable({
  providedIn: 'root'
})
export class WsService {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  constructor(@Inject(WEBSOCKET) private WebSocket: Type<WebSocket>, @Inject(WEBSTOMP) private Webstomp: any) {}

  connect<T>(channel: string): Observable<T> {
    return new Observable((observer: Observer<T>) => {
      // create the WebSocket connection
      const connection: WebSocket = new this.WebSocket(`${environment.wsBaseUrl}/ws`);
      // create the stomp client with Webstomp
      const stompClient: Client = this.Webstomp.over(connection);
      // connect the stomp client
      let subscription: Subscription;
      stompClient.connect(
        { login: '', passcode: '' },
        () => {
          // subscribe to the specific channel
          subscription = stompClient.subscribe(channel, message => {
            // emit the message received, after extracting the JSON from the body
            const bodyAsJson = JSON.parse(message.body);
            observer.next(bodyAsJson);
          });
        },
        // propagate the error
        error => observer.error(error)
      );
      // handle the unsubscription
      return () => {
        subscription?.unsubscribe();
        connection.close();
      };
    });
  }
}
