import { ContactMessage } from '../types';
import { StorageService } from './storageService';

export class ContactService {
  static getMessages(): ContactMessage[] {
    const messages = StorageService.getMessages();
    return messages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  static sendMessage(name: string, email: string, subject: string, message: string): ContactMessage {
    const messages = StorageService.getMessages();
    const newMessage: ContactMessage = {
      id: 'msg-' + Date.now(),
      name,
      email,
      subject,
      message,
      status: 'unread',
      created_at: new Date().toISOString(),
    };
    messages.unshift(newMessage);
    StorageService.saveMessages(messages);
    return newMessage;
  }

  static updateMessageStatus(id: string, status: 'unread' | 'read' | 'replied'): void {
    const messages = StorageService.getMessages();
    const msg = messages.find(m => m.id === id);
    if (msg) {
      msg.status = status;
      StorageService.saveMessages(messages);
    }
  }

  static replyToMessage(id: string, replyContent: string): void {
    const messages = StorageService.getMessages();
    const msg = messages.find(m => m.id === id);
    if (msg) {
      msg.status = 'replied';
      msg.reply_content = replyContent;
      msg.replied_at = new Date().toISOString();
      StorageService.saveMessages(messages);
      StorageService.addLog('Inquiry Replied', `Replied to inquiry from "${msg.name}" <${msg.email}>`);
    }
  }

  static deleteMessage(id: string): void {
    let messages = StorageService.getMessages();
    messages = messages.filter(m => m.id !== id);
    StorageService.saveMessages(messages);
  }
}
