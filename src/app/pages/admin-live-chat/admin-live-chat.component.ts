import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as SockJS from 'sockjs-client';
import { User } from 'src/app/dto/user-brief';
import { ChatMessage } from 'src/app/models/chat-message';
import { AdminService } from 'src/app/services/admin/admin.service';
import { getToken } from 'src/app/util/context';
import * as Stomp from 'stompjs';

@Component({
  selector: 'app-admin-live-chat',
  templateUrl: './admin-live-chat.component.html',
  styleUrls: ['./admin-live-chat.component.css']
})
export class AdminLiveChatComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private adminService: AdminService,
  ) { }

  private stompClient!: Stomp.Client;

  @ViewChild('adminChatBox') chatBox!: ElementRef;
  scrollTop: number = 0;

  messages: { [username: string]: ChatMessage[] } = { '': [] };
  newMessage: string = '';

  currentChat: string = '';
  usersInfo: User[] = []


  ngOnInit(): void {
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection() {
    this.stompClient = Stomp.over(new SockJS('http://localhost:8080/socket'));
    this.stompClient.connect({}, () => { this.openGlobalSocket(); });
    this.stompClient.debug = () => { };
  }

  openGlobalSocket() {
    this.stompClient.subscribe('/support-chat/admin', (response: { body: string }) => {
      let message: ChatMessage = JSON.parse(response.body);
      console.log(message);

      message.fromMe = false;
      if (message.chatWith) {
        let username = message.chatWith;
        if (!(username in this.messages)) {
          this.adminService.getUserInfo(username).subscribe({
            next: (data) => { if (data.body) this.usersInfo.push(data.body) },
            error: (error) => console.error(error.error)
          });
          this.messages[username] = [];
        }
        this.messages[username] = [...this.messages[username], message];
      }
      this.updateChatBox();
    });
  }

  sendMessage() {
    if (this.newMessage.length < 2)
      return;
    let message: ChatMessage = {
      chatWith: this.currentChat,
      content: this.newMessage,
    };
    this.newMessage = '';
    this.stompClient.send('/support-chat/admin/send', { 'Authorization': `Bearer ${getToken()}` }, JSON.stringify(message));
    message.fromMe = true;
    this.messages[this.currentChat] = [...this.messages[this.currentChat], message];
    this.updateChatBox();
  }

  updateChatBox() {
    setTimeout(() => {
      this.scrollTop = this.chatBox.nativeElement.scrollHeight;
    }, 10);
  }

}
