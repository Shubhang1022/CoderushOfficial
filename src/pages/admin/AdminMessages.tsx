import React, { useState } from 'react';
import { Mail, Trash2, MessageSquare, Send, ExternalLink, CornerDownRight, CheckCircle2, X } from 'lucide-react';
import { ContactService } from '../../services/contactService';
import { ContactMessage } from '../../types';

export const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>(ContactService.getMessages());
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');

  const refreshMessages = () => {
    setMessages(ContactService.getMessages());
  };

  const handleMarkStatus = (id: string, status: 'unread' | 'read' | 'replied') => {
    ContactService.updateMessageStatus(id, status);
    refreshMessages();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete message?')) {
      ContactService.deleteMessage(id);
      refreshMessages();
    }
  };

  const handleStartReply = (msg: ContactMessage) => {
    setReplyingId(msg.id);
    setReplyText(msg.reply_content || `Dear ${msg.name},\n\nThank you for reaching out to CodeRush.\n\nBest regards,\nCodeRush Team`);
  };

  const handleCancelReply = () => {
    setReplyingId(null);
    setReplyText('');
  };

  const handleSaveReply = (msg: ContactMessage, sendViaMailApp: boolean = false) => {
    if (!replyText.trim()) return;

    ContactService.replyToMessage(msg.id, replyText.trim());

    if (sendViaMailApp) {
      const subject = encodeURIComponent(`Re: ${msg.subject}`);
      const body = encodeURIComponent(replyText.trim());
      window.open(`mailto:${msg.email}?subject=${subject}&body=${body}`, '_blank');
    }

    setReplyingId(null);
    setReplyText('');
    refreshMessages();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Inquiries Inbox</h1>
          <p className="text-xs text-text-muted">Review inquiries and reply directly to students, sponsors, and partners.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-mono font-semibold bg-brand-blue/20 text-brand-cyan border border-brand-blue/30">
            {messages.filter(m => m.status === 'unread').length} Unread
          </span>
          <span className="px-3 py-1.5 rounded-full text-xs font-mono font-semibold bg-white/5 text-text-muted border border-white/10">
            {messages.length} Total Messages
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {messages.length > 0 ? (
          messages.map((msg) => {
            const isReplying = replyingId === msg.id;

            return (
              <div
                key={msg.id}
                className={`card-dark rounded-3xl p-6 border transition-all space-y-4 ${
                  msg.status === 'unread'
                    ? 'border-brand-blue/50 bg-[#0E1524] shadow-glow-blue/10'
                    : msg.status === 'replied'
                    ? 'border-emerald-500/30 bg-[#0A121A]'
                    : 'border-white/10'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-heading font-bold text-white text-base">{msg.name}</span>
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-xs text-brand-cyan font-mono hover:underline flex items-center gap-1"
                      >
                        &lt;{msg.email}&gt;
                      </a>
                    </div>
                    <span className="text-xs text-text-muted font-mono">{new Date(msg.created_at).toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={msg.status}
                      onChange={(e) => handleMarkStatus(msg.id, e.target.value as any)}
                      className={`border text-xs rounded-xl px-3 py-1.5 font-semibold ${
                        msg.status === 'unread'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : msg.status === 'replied'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-white/5 text-text-muted border-white/10'
                      }`}
                    >
                      <option value="unread" className="bg-[#0F1623] text-white">Unread</option>
                      <option value="read" className="bg-[#0F1623] text-white">Read</option>
                      <option value="replied" className="bg-[#0F1623] text-white">Replied</option>
                    </select>

                    <button
                      onClick={() => handleStartReply(msg)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-blue text-white shadow-glow-blue hover:bg-brand-glow transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Reply
                    </button>

                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                      title="Delete Inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Body Row */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-white">Subject: {msg.subject}</div>
                  <p className="text-xs text-text-secondary leading-relaxed bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                    {msg.message}
                  </p>
                </div>

                {/* Official Reply Box if Already Replied */}
                {msg.reply_content && !isReplying && (
                  <div className="p-4 rounded-2xl bg-brand-blue/10 border border-brand-blue/30 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-brand-cyan">
                      <span className="flex items-center gap-1.5">
                        <CornerDownRight className="w-4 h-4 text-brand-cyan" />
                        Official Response Sent
                      </span>
                      {msg.replied_at && (
                        <span className="text-[10px] text-text-muted font-mono">
                          {new Date(msg.replied_at).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white leading-relaxed whitespace-pre-line">
                      {msg.reply_content}
                    </p>
                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={() => handleStartReply(msg)}
                        className="text-[11px] font-semibold text-brand-cyan hover:underline flex items-center gap-1"
                      >
                        Edit / Resend Reply →
                      </button>
                    </div>
                  </div>
                )}

                {/* Inline Reply Editor */}
                {isReplying && (
                  <div className="p-5 rounded-2xl bg-[#080B12] border border-brand-blue/40 space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <h4 className="text-xs font-bold text-white flex items-center gap-2">
                        <Send className="w-3.5 h-3.5 text-brand-cyan" />
                        Replying to {msg.name} ({msg.email})
                      </h4>
                      <button onClick={handleCancelReply} className="p-1 text-text-muted hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-text-secondary">Your Reply Message</label>
                      <textarea
                        rows={4}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your response to the sender..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-blue leading-relaxed"
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => handleSaveReply(msg, true)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 hover:bg-brand-cyan/30 transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Send via Email App & Save
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleCancelReply}
                          className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 text-white hover:bg-white/10"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveReply(msg, false)}
                          className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-brand-blue text-white shadow-glow-blue hover:bg-brand-glow transition-all"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Save Reply & Mark Replied
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 card-dark rounded-3xl space-y-2">
            <Mail className="w-8 h-8 text-text-muted mx-auto" />
            <p className="text-xs text-text-muted">No messages in inbox.</p>
          </div>
        )}
      </div>
    </div>
  );
};
