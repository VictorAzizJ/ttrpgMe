'use client';

import { ChatMessage as ChatMessageType } from '@/types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isDM = message.role === 'assistant';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-semibold ${isDM ? 'text-purple-400' : 'text-blue-400'}`}>
            {isDM ? '🎭 Dungeon Master' : '🗡️ You'}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>

        <div
          className={`p-4 rounded-lg ${
            isUser
              ? 'bg-blue-900 text-blue-50'
              : 'bg-gray-800 text-gray-100 border border-purple-500/30'
          }`}
        >
          {message.dice_roll && (
            <div className="mb-2 p-2 bg-black/30 rounded text-sm">
              <span className="font-semibold">🎲 Rolled {message.dice_roll.notation}:</span>
              <span className="ml-2 text-xl font-bold text-green-400">
                {message.dice_roll.result}
              </span>
            </div>
          )}

          <div className="whitespace-pre-wrap">{message.content}</div>
        </div>
      </div>
    </div>
  );
}
