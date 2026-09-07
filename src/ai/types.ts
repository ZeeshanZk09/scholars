/**
 * AI Provider Abstraction
 * 
 * This module defines the interface for AI providers, allowing the application
 * to switch between providers (OpenRouter, OpenAI, etc.) without changing
 * the rest of the codebase.
 * 
 * All provider communication happens server-side. API keys and secrets are
 * never exposed to the browser.
 */

// Base AI Provider interface
export interface AIProvider {
  name: string;
  model: string;
  sendMessage(messages: AIMessage[], tools?: AITool[]): Promise<AIResponse>;
  getTokenCount(messages: AIMessage[]): number;
}

// Message roles for AI communication
export type MessageRole = "system" | "user" | "assistant" | "tool";

export interface AIMessage {
  role: MessageRole;
  content: string;
  toolCalls?: AIToolCall[];
  toolResults?: AIToolResult[];
}

export interface AIToolCall {
  id: string;
  name: string;
  arguments: string; // JSON string
}

export interface AIToolResult {
  toolCallId: string;
  name: string;
  content: string | object;
  error?: string;
}

// AI Response structure
export interface AIResponse {
  success: boolean;
  content: string;
  toolCalls?: AIToolCall[];
  model?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason?: string;
}

// AI Provider Configuration
export interface AIProviderConfig {
  provider: keyof AIProviderMap;
  model: string;
  apiKey?: string;
  baseURL?: string;
}

export type AIProviderMap = {
  openrouter: OpenRouterProviderConfig;
  openai: OpenAIProviderConfig;
};

// Provider-specific configurations (kept server-side)
export interface OpenRouterProviderConfig {
  apiKey: string;
  baseURL?: string;
}

export interface OpenAIProviderConfig {
  apiKey: string;
  organization?: string;
}

// Tool execution result
export interface ToolExecutionResult {
  success: boolean;
  content: string;
  error?: string;
  data?: unknown;
}

// Configuration for the AI assistant
export interface AIAssistantConfig {
  name: string;
  description: string;
  instructions: string;
  enabled: boolean;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

// Suggested prompts for the assistant
export type SuggestedPrompt = {
  id: string;
  label: string;
  description?: string;
  onSelect?: (context: ConversationContext) => void;
};

// Conversation context
export interface ConversationContext {
  sessionId: string;
  userId?: string; // undefined for anonymous users
  messages: AIMessage[];
  toolRegistry: ToolRegistry;
  metadata?: {
    [key: string]: unknown;
  };
}

// Tool registry - maps tool names to their implementations
export interface ToolRegistry {
  [key: string]: {
    execute: (args: Record<string, unknown>) => Promise<ToolExecutionResult>;
    description: string;
    acceptsWriteOperations: boolean;
    requiredConfirmation: boolean;
    schema?: z.ZodTypeAny;
  };
}

// Zod schemas for tool argument validation
export interface ToolSchemas {
  [key: string]: z.ZodTypeAny;
}

// Operation type for tool registry
export type ToolOperation = "read" | "write" | "info";

// Tool metadata
export interface ToolMetadata {
  name: string;
  operation: ToolOperation;
  description: string;
  requiresConfirmation: boolean;
  category: "read" | "write" | "info" | "lead";
}

// AI tool result for frontend rendering
export interface AIToolResultForFrontend {
  type: "course-card" | "program-card" | "admission-status" | "fee-info" | "text" | "action-buttons" | "form" | "confirmation" | "success" | "error";
  content: unknown;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
    submission?: boolean;
  };
}

// UI message types for the chat
export type ChatMessageType = "text" | "course-card" | "program-card" | "admission-status" | "fee-info" | "action-buttons" | "form" | "confirmation" | "success" | "error";

// Chat message structure
export interface ChatMessage {
  id: string;
  role: MessageRole;
  type: ChatMessageType;
  content: string;
  toolResult?: AIToolResultForFrontend;
  timestamp: Date;
  metadata?: {
    [key: string]: unknown;
  };
}

// Error handling for AI operations
export enum AIErrorCode {
  PROVIDER_UNAVAILABLE = "AI_PROVIDER_UNAVAILABLE",
  RATE_LIMITED = "AI_RATE_LIMITED",
  VALIDATION_ERROR = "AI_VALIDATION_ERROR",
  TOOL_EXECUTION_FAILED = "AI_TOOL_EXECUTION_FAILED",
  CONTEXT_TOO_LARGE = "AI_CONTEXT_TOO_LARGE",
  NETWORK_ERROR = "AI_NETWORK_ERROR",
  UNKNOWN_ERROR = "AI_UNKNOWN_ERROR",
}

export interface AIError {
  code: AIErrorCode;
  message: string;
  retryable: boolean;
  details?: unknown;
}

// Confirmation requirement for write operations
export type ConfirmationResponse = "yes" | "no" | "cancel";

// Persistence options for conversations
export type ConversationPersistence = "none" | "session" | "permanent";

// Configuration for conversation persistence
export interface ConversationConfig {
  persistence: ConversationPersistence;
  maxMessages: number;
  maxContextTokens: number;
  expireAfterHours?: number;
}