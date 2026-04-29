import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { ChatMessage } from '../models/chat-message.model';

interface ChatApiResponse {
  reply: string;
}

interface ChatRequest {
  message: string;
  conversationHistory: { role: string; content: string }[];
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private storageKey = 'chat_history';
  private apiUrl = `${environment.apiUrl}/chat`;

  private messagesSubject = new BehaviorSubject<ChatMessage[]>(
    this.loadMessages(),
  );
  
  private loadingSubject = new BehaviorSubject<boolean>(false);

  messages$ = this.messagesSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Send user message to API
   */
  sendMessage(text: string) {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    const updatedMessages = [...this.messagesSubject.value, userMessage];
    this.messagesSubject.next(updatedMessages);
    this.saveMessages(updatedMessages);

    // Call backend API
    this.callChatApi(text, updatedMessages);
  }

  /**
   * Call backend chat API
   */
  private callChatApi(message: string, currentMessages: ChatMessage[]) {
    this.loadingSubject.next(true);

    // Prepare conversation history (last 10 messages for context)
    const conversationHistory = currentMessages
      .slice(-11, -1) // Exclude the last user message we just added
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }));

    const request: ChatRequest = {
      message: message.trim(),
      conversationHistory
    };

    this.http.post<ChatApiResponse>(this.apiUrl, request)
      .pipe(
        catchError(error => {
          console.error('Chat API error:', error);
          const errorMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'assistant',
            content: 'Sorry, I am temporarily unavailable. Please try again later or contact your Support Coordinator for assistance.',
            timestamp: new Date(),
          };
          const messagesWithError = [...this.messagesSubject.value, errorMessage];
          this.messagesSubject.next(messagesWithError);
          this.saveMessages(messagesWithError);
          return of({ reply: '' });
        }),
        finalize(() => {
          this.loadingSubject.next(false);
        })
      )
      .subscribe(response => {
        if (response.reply) {
          const botMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'assistant',
            content: response.reply,
            timestamp: new Date(),
          };

          const updatedMessages = [...this.messagesSubject.value, botMessage];
          this.messagesSubject.next(updatedMessages);
          this.saveMessages(updatedMessages);
        }
      });
  }

  /**
   * Save to localStorage
   */
  private saveMessages(messages: ChatMessage[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(messages));
  }

  /**
   * Load stored messages
   */
  private loadMessages(): ChatMessage[] {
    const data = localStorage.getItem(this.storageKey);

    return data ? JSON.parse(data) : [];
  }
}
