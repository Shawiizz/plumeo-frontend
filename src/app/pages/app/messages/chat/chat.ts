import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageComponent, Message } from './message/message';
import { Button } from 'primeng/button';
import { Avatar } from 'primeng/avatar';
import {TextareaModule} from 'primeng/textarea';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    MessageComponent,
    FormsModule,
    Button,
    TextareaModule,
    Avatar
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
  host: {
    'class': 'flex w-full h-full'
  }
})
export class Chat {
  messageText: string = '';
  messages: Message[] = [
    {
      id: '1',
      content: 'Salut ! Comment ça va aujourd\'hui ?',
      timestamp: '19:45',
      isOwn: false,
      senderName: 'Shawiiz_z2',
      senderAvatar: 'S'
    },
    {
      id: '2',
      content: 'Salut ! Ça va bien merci, et toi ?',
      timestamp: '19:46',
      isOwn: true
    },
    {
      id: '3',
      content: 'Super ! Tu as des projets pour ce weekend ?',
      timestamp: '19:47',
      isOwn: false,
      senderName: 'Shawiiz_z2',
      senderAvatar: 'S'
    },
    {
      id: '4',
      content: 'Oui je pense aller me promener si il fait beau. Et toi ?',
      timestamp: '19:48',
      isOwn: true
    },
    {
      id: '5',
      content: 'Pareil ! On pourrait peut-être se voir ?',
      timestamp: '20:15',
      isOwn: false,
      senderName: 'Shawiiz_z2',
      senderAvatar: 'S'
    }
  ];

  trackByMessageId(index: number, message: Message): string {
    return message.id;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.shiftKey && event.key === 'Enter') {
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage(): void {
    if (this.messageText.trim()) {
      // Ici vous pourrez ajouter la logique pour envoyer le message
      const newMessage: Message = {
        id: Date.now().toString(),
        content: this.messageText.trim(),
        timestamp: new Date().toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        isOwn: true
      };

      this.messages.push(newMessage);
      this.messageText = '';
      // Garder l'état d'expansion tel quel après envoi
    }
  }
}
