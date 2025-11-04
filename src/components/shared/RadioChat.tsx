import { useState, useRef, useEffect } from 'react';
import { Grip, ChevronUp, Radio, Send, Volume2, SkipForward, SkipBack, Play, Pause, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { ScrollArea } from '../ui/scroll-area';
import { getTopStations, registerClick, type RadioStation } from '../../utils/radioBrowserApi';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function RadioChat() {
  const [position, setPosition] = useState({ x: window.innerWidth - 420, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const audioRef = useRef<HTMLAudioElement>(null);

  // Radio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [isLoadingStation, setIsLoadingStation] = useState(false);
  const [radioStations, setRadioStations] = useState<RadioStation[]>([]);
  const [isLoadingStations, setIsLoadingStations] = useState(true);

  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Hey! I'm TaTTTy, your tattoo concierge. Need help navigating the site or have tattoo questions? I'm here for you.", 
      timestamp: new Date() 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentStation = radioStations[currentStationIndex];

  // Load radio stations on mount
  useEffect(() => {
    loadRadioStations();
  }, []);

  const loadRadioStations = async () => {
    setIsLoadingStations(true);
    try {
      // Get top 100 quality stations (120kbps minimum, sorted by votes)
      const stations = await getTopStations(100, 120);
      
      if (stations.length === 0) {
        console.error('No radio stations available');
        return;
      }
      
      setRadioStations(stations);
      console.log(`Loaded ${stations.length} quality radio stations`);
    } catch (error) {
      console.error('Failed to load radio stations:', error);
      // TODO: Show user-friendly error popup here (not toast)
    } finally {
      setIsLoadingStations(false);
    }
  };

  // Drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === dragRef.current || (e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true);
      startPos.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y
      };
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - startPos.current.x,
        y: e.clientY - startPos.current.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  // Radio controls
  const togglePlay = async () => {
    if (!audioRef.current || !currentStation) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoadingStation(true);
      try {
        // Get the best available stream URL
        const streamUrl = currentStation.url_resolved || currentStation.url;
        
        if (!streamUrl) {
          throw new Error('No stream URL available');
        }
        
        // Reset audio element before loading new source
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current.load();
        
        // Set new source and load
        audioRef.current.src = streamUrl;
        audioRef.current.load();
        
        // Wait for audio to be ready
        await new Promise((resolve, reject) => {
          const onCanPlay = () => {
            audioRef.current?.removeEventListener('canplay', onCanPlay);
            audioRef.current?.removeEventListener('error', onError);
            resolve(true);
          };
          const onError = (e: Event) => {
            audioRef.current?.removeEventListener('canplay', onCanPlay);
            audioRef.current?.removeEventListener('error', onError);
            reject(new Error('Failed to load stream'));
          };
          
          audioRef.current?.addEventListener('canplay', onCanPlay);
          audioRef.current?.addEventListener('error', onError);
          
          // Timeout after 10 seconds
          setTimeout(() => {
            audioRef.current?.removeEventListener('canplay', onCanPlay);
            audioRef.current?.removeEventListener('error', onError);
            reject(new Error('Stream load timeout'));
          }, 10000);
        });
        
        await audioRef.current.play();
        setIsPlaying(true);
        
        // Register click with Radio Browser API (helps mark station as popular)
        await registerClick(currentStation.stationuuid);
        
        console.log(`Playing: ${currentStation.name}`);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error('Radio play error:', errorMsg);
        // Auto-skip to next station if current one fails
        changeStation('next');
      } finally {
        setIsLoadingStation(false);
      }
    }
  };

  const changeStation = (direction: 'next' | 'prev') => {
    if (radioStations.length === 0) return;
    
    const newIndex = direction === 'next'
      ? (currentStationIndex + 1) % radioStations.length
      : (currentStationIndex - 1 + radioStations.length) % radioStations.length;
    
    setCurrentStationIndex(newIndex);
    
    // If currently playing, auto-play the new station
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      
      // Small delay then auto-play new station
      setTimeout(() => {
        togglePlay();
      }, 300);
    } else {
      console.log(`Switched to ${radioStations[newIndex].name}`);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100;
    }
  };

  // Chat functionality
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate AI response (replace with actual API call later)
    setTimeout(() => {
      const responses = [
        "I can help you with that! What specific tattoo style are you interested in?",
        "Great question! Have you checked out our generator page? Click 'Generate' in the menu to get started.",
        "For tattoo care tips, make sure to keep it clean and moisturized. Want me to show you some examples?",
        "Looking for inspiration? Try our AI generator to create unique designs!",
        "Need help with tattoo ideas? I can guide you through our generator features."
      ];
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isMinimized) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
        }}
      >
        <Button
          onClick={() => setIsMinimized(false)}
          size="lg"
          className="rounded-full w-16 h-16 shadow-2xl"
          style={{
            backgroundColor: '#57f1d6',
            color: '#0C0C0D',
          }}
        >
          <Radio className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div
      ref={dragRef}
      onMouseDown={handleMouseDown}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999,
        cursor: isDragging ? 'grabbing' : 'default',
        width: isExpanded ? '380px' : '60px',
        transition: isDragging ? 'none' : 'width 0.3s ease',
      }}
    >
      <Card className="shadow-2xl backdrop-blur-xl bg-[#1a1a1a]/95 border-2" style={{ borderColor: '#57f1d6' }}>
        {/* Header */}
        <div className="p-3 border-b border-border/50 flex items-center justify-between drag-handle" style={{ cursor: 'grab' }}>
          <div className="flex items-center gap-2">
            <Grip className="w-4 h-4 text-accent drag-handle" />
            {isExpanded && (
              <span className="text-sm text-accent">TaTTTy Assistant</span>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-7 w-7 p-0"
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
              className="h-7 w-7 p-0"
            >
              ×
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="flex flex-col h-[calc(100vh-200px)] max-h-[600px]">
            {/* Radio Player Section */}
            <div className="p-4 border-b border-border/50 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-accent" />
                  <span className="text-sm text-accent">Radio</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loadRadioStations}
                  disabled={isLoadingStations}
                  className="h-7 w-7 p-0"
                  title="Refresh stations"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoadingStations ? 'animate-spin' : ''}`} />
                </Button>
              </div>

              {isLoadingStations ? (
                <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#2a2a2a' }}>
                  <div className="text-sm text-muted-foreground">Loading quality stations...</div>
                </div>
              ) : !currentStation ? (
                <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#2a2a2a' }}>
                  <div className="text-sm text-muted-foreground">No stations available</div>
                </div>
              ) : (
                <>
                  {/* Station Info */}
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#2a2a2a' }}>
                    <div className="text-sm mb-1 truncate" title={currentStation.name}>
                      {currentStation.name}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span>{currentStation.countrycode}</span>
                      <span>·</span>
                      <span>{currentStation.bitrate}kbps</span>
                      {currentStation.codec && (
                        <>
                          <span>·</span>
                          <span>{currentStation.codec}</span>
                        </>
                      )}
                    </div>
                    {currentStation.tags && (
                      <div className="text-xs text-accent/70 mt-1 truncate" title={currentStation.tags}>
                        {currentStation.tags.split(',').slice(0, 3).join(', ')}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => changeStation('prev')}
                  disabled={isLoadingStations || radioStations.length === 0}
                  className="h-9 w-9 p-0"
                >
                  <SkipBack className="w-4 h-4" />
                </Button>
                
                <Button
                  size="sm"
                  onClick={togglePlay}
                  disabled={isLoadingStation || isLoadingStations || radioStations.length === 0}
                  className="h-10 w-10 p-0 rounded-full"
                  style={{ backgroundColor: '#57f1d6', color: '#0C0C0D' }}
                >
                  {isLoadingStation ? (
                    <div className="w-4 h-4 border-2 border-[#0C0C0D] border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => changeStation('next')}
                  disabled={isLoadingStations || radioStations.length === 0}
                  className="h-9 w-9 p-0"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <Slider
                  value={volume}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-8">{volume[0]}%</span>
              </div>

              {/* Hidden Audio Element */}
              <audio
                ref={audioRef}
                preload="none"
                crossOrigin="anonymous"
                onError={(e) => {
                  // Extract safe error info (avoid circular JSON structure)
                  const errorInfo = {
                    type: e.type,
                    target: e.currentTarget?.tagName,
                    currentSrc: audioRef.current?.currentSrc,
                    error: audioRef.current?.error?.message || 'Unknown error'
                  };
                  console.error('Radio play error:', errorInfo.error);
                  changeStation('next');
                }}
              />
            </div>

            {/* Chat Section */}
            <div className="flex-1 flex flex-col min-h-0">
              {/* Chat Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-accent text-[#0C0C0D]'
                            : 'bg-[#2a2a2a]'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-60 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Chat Input */}
              <div className="p-3 border-t border-border/50">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask TaTTTy anything..."
                    className="flex-1 text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    style={{ backgroundColor: '#57f1d6', color: '#0C0C0D' }}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
