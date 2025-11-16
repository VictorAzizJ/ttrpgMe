'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { characterStorage, sessionStorage } from '@/lib/storage';
import { Character } from '@/types/character';
import { ChatMessage, GameSession, GameState, STARTER_CAMPAIGNS } from '@/types/chat';
import { DiceRoll } from '@/types/dice';
import { buildCampaignIntro } from '@/lib/ai/dm-prompts';
import CharacterSheet from '@/components/character/CharacterSheet';
import DiceRoller from '@/components/dice/DiceRoller';
import DiceLog from '@/components/dice/DiceLog';
import ChatInterface from '@/components/chat/ChatInterface';

export default function PlayPage() {
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [session, setSession] = useState<GameSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [diceRolls, setDiceRolls] = useState<DiceRoll[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [showCampaignSelect, setShowCampaignSelect] = useState(true);

  // Load character and existing session
  useEffect(() => {
    const activeChar = characterStorage.getActive();
    setCharacter(activeChar);

    const existingSession = sessionStorage.get();
    if (existingSession) {
      setSession(existingSession);
      setMessages(existingSession.messages);
      setShowCampaignSelect(false);
    }
  }, []);

  const startNewCampaign = (campaignId: string) => {
    const campaign = STARTER_CAMPAIGNS.find(c => c.id === campaignId);
    if (!campaign) return;

    const initialGameState: GameState = {
      location: 'Starting Location',
      quest_objective: campaign.description,
      active_npcs: [],
      combat_active: false,
    };

    const introMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: buildCampaignIntro(campaignId, character),
      timestamp: new Date().toISOString(),
    };

    const newSession: GameSession = {
      id: crypto.randomUUID(),
      user_id: 'local',
      character_id: character?.id || 'none',
      campaign_name: campaign.name,
      messages: [introMessage],
      game_state: initialGameState,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setSession(newSession);
    setMessages([introMessage]);
    setSelectedCampaign(campaignId);
    setShowCampaignSelect(false);
    sessionStorage.save(newSession);
  };

  const handleSendMessage = async (content: string) => {
    if (!session) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          character,
          gameState: session.game_state,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get DM response');
      }

      const data = await response.json();

      const dmMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toISOString(),
      };

      const newMessages = [...updatedMessages, dmMessage];
      setMessages(newMessages);

      // Update session
      const updatedSession = {
        ...session,
        messages: newMessages,
        updated_at: new Date().toISOString(),
      };
      setSession(updatedSession);
      sessionStorage.save(updatedSession);

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'The DM seems distracted... (Error: Could not generate response. Check console for details.)',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiceRoll = (roll: DiceRoll) => {
    setDiceRolls(prev => [...prev, roll]);

    // Optionally auto-send roll result to DM
    if (session) {
      const rollMessage = `I rolled ${roll.num_dice}${roll.dice_type}${roll.modifier !== 0 ? `+${roll.modifier}` : ''} for ${roll.purpose}: ${roll.total}`;
      handleSendMessage(rollMessage);
    }
  };

  const handleEndSession = () => {
    if (confirm('End this adventure? Your progress will be saved.')) {
      sessionStorage.clear();
      router.push('/');
    }
  };

  const handleNewSession = () => {
    if (confirm('Start a new adventure? This will replace your current session.')) {
      sessionStorage.clear();
      setMessages([]);
      setSession(null);
      setShowCampaignSelect(true);
    }
  };

  // Campaign Selection Screen
  if (showCampaignSelect) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
              Choose Your Adventure
            </h1>
            {character && (
              <p className="text-gray-400">
                Playing as <span className="text-purple-400 font-semibold">{character.name}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {STARTER_CAMPAIGNS.map(campaign => (
              <div
                key={campaign.id}
                onClick={() => startNewCampaign(campaign.id)}
                className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-purple-500 cursor-pointer transition-all hover:scale-105"
              >
                <h3 className="text-xl font-bold mb-2">{campaign.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{campaign.description}</p>
                <div className="flex justify-between text-xs">
                  <span className="text-purple-400">{campaign.difficulty}</span>
                  <span className="text-gray-500">Level {campaign.starting_level}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              ← Back to Home
            </button>
            {!character && (
              <button
                onClick={() => router.push('/character/new')}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
              >
                Create Character First
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main Game Interface
  return (
    <div className="h-screen flex flex-col bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-purple-400">
              {session?.campaign_name || 'Adventure'}
            </h1>
            {character && (
              <p className="text-sm text-gray-400">{character.name} - Level {character.level}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleNewSession}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors text-sm"
            >
              New Adventure
            </button>
            <button
              onClick={handleEndSession}
              className="px-4 py-2 bg-red-900 hover:bg-red-800 rounded transition-colors text-sm"
            >
              End Session
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Character & Dice */}
        <div className="w-80 bg-gray-900 border-r border-gray-800 p-4 overflow-y-auto space-y-4">
          {character ? (
            <CharacterSheet character={character} compact />
          ) : (
            <div className="bg-gray-800 p-4 rounded text-center">
              <p className="text-gray-400 text-sm mb-2">No character selected</p>
              <button
                onClick={() => router.push('/character/new')}
                className="text-purple-400 hover:text-purple-300 text-sm"
              >
                Create Character
              </button>
            </div>
          )}

          <DiceRoller onRoll={handleDiceRoll} compact />

          <DiceLog rolls={diceRolls} maxEntries={5} />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
