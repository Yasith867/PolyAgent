import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles, Bot, User, Loader2 } from "lucide-react";
import type { AiChat } from "@shared/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import ReactMarkdown from "react-markdown";

interface ChatInterfaceProps {
  portfolioId?: number;
}

export function ChatInterface({ portfolioId = 1 }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [streamingMessage, setStreamingMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: chats = [], isLoading } = useQuery<AiChat[]>({
    queryKey: ["/api/ai-chats", portfolioId],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      setIsStreaming(true);
      setStreamingMessage("");
      
      const response = await fetch("/api/ai-agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolioId, message }),
      });

      if (!response.ok) throw new Error("Failed to send message");
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6));
            if (event.content) {
              fullResponse += event.content;
              setStreamingMessage(fullResponse);
            }
            if (event.done) {
              setIsStreaming(false);
              setStreamingMessage("");
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      }

      return fullResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai-chats", portfolioId] });
      setInput("");
    },
    onError: () => {
      setIsStreaming(false);
      setStreamingMessage("");
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chats, streamingMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    sendMessageMutation.mutate(input.trim());
  };

  const suggestedQuestions = [
    "What's my portfolio risk level?",
    "Find yield opportunities on Polygon",
    "Analyze MATIC price trends",
    "Recommend DeFi strategies for me",
  ];

  return (
    <Card className="flex flex-col h-full" data-testid="card-ai-chat">
      <CardHeader className="flex flex-row items-center justify-between gap-1 border-b shrink-0">
        <CardTitle className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-primary/10">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          AI Agent
        </CardTitle>
        <Badge variant="secondary" className="bg-chart-2/10 text-chart-2">
          <div className="w-1.5 h-1.5 rounded-full bg-chart-2 mr-1.5 animate-pulse" />
          Online
        </Badge>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {chats.length === 0 && !isStreaming && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">PolyAgent AI Assistant</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                  Ask me anything about your portfolio, DeFi strategies on Polygon, or market analysis.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md mx-auto">
                  {suggestedQuestions.map((question) => (
                    <Button
                      key={question}
                      variant="outline"
                      size="sm"
                      className="text-left h-auto py-2 px-3"
                      onClick={() => setInput(question)}
                      data-testid={`btn-suggestion-${question.slice(0, 10).replace(/\s/g, "-").toLowerCase()}`}
                    >
                      <span className="text-xs">{question}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`flex gap-3 ${chat.role === "user" ? "justify-end" : ""}`}
                data-testid={`chat-message-${chat.id}`}
              >
                {chat.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    chat.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {chat.role === "user" ? (
                    <p className="text-sm whitespace-pre-wrap">{chat.content}</p>
                  ) : (
                    <div className="text-sm prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0.5 prose-strong:text-foreground">
                      <ReactMarkdown>{chat.content}</ReactMarkdown>
                    </div>
                  )}
                  <p className={`text-xs mt-1 ${chat.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {chat.createdAt && formatDistanceToNow(new Date(chat.createdAt), { addSuffix: true })}
                  </p>
                </div>
                {chat.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isStreaming && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                  {streamingMessage ? (
                    <div className="text-sm prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0.5 prose-strong:text-foreground">
                      <ReactMarkdown>{streamingMessage}</ReactMarkdown>
                    </div>
                  ) : (
                    <span className="flex items-center gap-2 text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Thinking...
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="p-4 border-t shrink-0">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your portfolio, strategies, or market..."
              className="min-h-[44px] max-h-[120px] resize-none"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={isStreaming}
              data-testid="input-chat-message"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isStreaming}
              data-testid="button-send-message"
            >
              {isStreaming ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
