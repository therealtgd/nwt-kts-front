import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { ContextData } from 'src/app/dto/context-data';
import { ChatMessage } from 'src/app/models/chat-message';
import { AuthService } from 'src/app/services/auth/auth.service';
import { getSession, getToken } from 'src/app/util/context';
import * as Stomp from 'stompjs';

@Component({
  selector: 'app-live-chat',
  templateUrl: './live-chat.component.html',
  styleUrls: ['./live-chat.component.css']
})
export class LiveChatComponent implements OnInit, AfterViewInit {
  constructor(
    private authService: AuthService,
  ) { }

  private stompClient!: Stomp.Client;

  @ViewChild('chatBox') chatBox!: ElementRef;
  scrollTop!: number;

  showButton: boolean = false;
  display: boolean = false;
  messages: ChatMessage[] = [];
  newMessage: string = '';

  ngOnInit(): void {
    if (getToken()) {
      this.authService.getWhoAmI();
      const session: ContextData | undefined = getSession();
      if (session !== undefined) {
        if (session.role !== 'ROLE_ADMIN') {
          this.showButton = true;
          this.initializeWebSocketConnection(session.username);
        }
      }
    }
  }

  ngAfterViewInit(): void {
    this.scrollTop = this.chatBox.nativeElement.scrollHeight;
  }


  initializeWebSocketConnection(username: string) {
    this.stompClient = Stomp.over(new SockJS('http://localhost:8080/socket'));
    this.stompClient.connect({}, () => { this.openGlobalSocket(username); });
    this.stompClient.debug = () => { };
  }

  openGlobalSocket(username: string) {
    this.stompClient.subscribe('/support-chat/receive/' + username, (response: { body: string }) => {
      let message: ChatMessage = JSON.parse(response.body);
      message.fromMe = false;
      this.updateChatBox(message);
    });
  }

  sendMessage() {
    if (this.newMessage.length < 2)
      return;
    let message: ChatMessage = {
      content: this.newMessage,
    };
    this.newMessage = '';
    this.stompClient.send('/support-chat/send', { 'Authorization': `Bearer ${getToken()}` }, JSON.stringify(message));
    message.fromMe = true;
    this.updateChatBox(message);
  }

  updateChatBox(message: ChatMessage) {
    this.messages = [...this.messages, message];
    setTimeout(() => {
      this.scrollTop = this.chatBox.nativeElement.scrollHeight;
    }, 10);
  }
}