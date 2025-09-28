import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  senderName?: string;
  senderAvatar?: string;
}

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message.html',
  styleUrls: ['./message.scss']
})
export class MessageComponent {
  @Input() message!: Message;
}