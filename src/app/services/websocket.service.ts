import {inject, Injectable, signal} from '@angular/core';
import {Client, IMessage} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {ToastService} from './toast.service';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable, filter, switchMap} from 'rxjs';

export interface DataMessage {
  data: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private readonly toastService = inject(ToastService);

  private client: Client | null = null;

  public connectionStatus = new BehaviorSubject<boolean>(false);

  /**
   * Connect to WebSocket with JWT token
   */
  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.client && this.client.connected) {
        console.log('WebSocket already connected');
        resolve();
        return;
      }

      // Create WebSocket connection with SockJS
      const socket = new SockJS(`${environment.apiEndpoint}/ws?token=${token}`);

      this.client = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${token}`
        },
        debug: (str) => {
          console.log('STOMP Debug:', str);
        },
        onConnect: (frame) => {
          console.log('Connected to WebSocket:', frame);
          this.connectionStatus.next(true);

          resolve();
        },
        onStompError: (frame) => {
          console.error('STOMP Error:', frame);
          this.connectionStatus.next(true);
          this.toastService.showError('WebSocket Error', 'Failed to connect to server');
          reject(new Error(frame.headers['message']));
        },
        onWebSocketError: (error) => {
          console.error('WebSocket Error:', error);
          this.connectionStatus.next(false);
          reject(error);
        },
        onDisconnect: () => {
          console.log('Disconnected from WebSocket');
          this.connectionStatus.next(false);
        }
      });

      // Activate the client
      this.client.activate();
    });
  }

  /**
   * Send custom message to specific destination
   */
  sendMessage(destination: string, body: any): void {
    if (!this.client || !this.client.connected) {
      this.toastService.showWarn('Connection Error', 'WebSocket not connected');
      return;
    }

    this.client.publish({
      destination,
      body: JSON.stringify(body)
    });
  }

  /**
   * Subscribe to a specific topic - returns Observable for takeUntilDestroyed
   */
  on(destination: string): Observable<any> {
    return this.connectionStatus.pipe(
      filter(connected => connected),
      switchMap(() => new Observable(observer => {
        if (!this.client || !this.client.connected) {
          console.warn('Cannot subscribe: WebSocket not connected');
          observer.error('WebSocket not connected');
          return;
        }

        const subscription = this.client.subscribe(`/topic/${destination}`, (message: IMessage) => {
          const parsedMessage = JSON.parse(message.body);
          observer.next(parsedMessage);
        });

        // Cleanup function - called when observable is unsubscribed
        return () => {
          if (subscription) {
            subscription.unsubscribe();
          }
        };
      }))
    );
  }

  /**
   * Subscribe to a specific topic with callback (legacy method)
   */
  subscribeWithCallback(destination: string, callback: (message: any) => void): void {
    if (!this.client || !this.client.connected) {
      console.warn('Cannot subscribe: WebSocket not connected');
      return;
    }

    this.client.subscribe(destination, (message: IMessage) => {
      const parsedMessage = JSON.parse(message.body);
      callback(parsedMessage);
    });
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.connectionStatus.next(false);
    }
  }
}
