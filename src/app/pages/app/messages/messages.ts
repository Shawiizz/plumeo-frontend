import { Component } from '@angular/core';
import {LastMessageProfile} from './last-message-profile/last-message-profile';
import {Divider} from 'primeng/divider';
import {Chat} from './chat/chat';

@Component({
  selector: 'app-messages',
  imports: [
    LastMessageProfile,
    Divider,
    Chat
  ],
  templateUrl: './messages.html',
  styleUrl: './messages.scss'
})
export class Messages {

}
