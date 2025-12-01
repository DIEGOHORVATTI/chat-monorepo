export const makeSendTypingIndicator = () => async (_chatId: string, _isTyping: boolean) => {
  // Typing indicator is handled via WebSocket events
  // This is a no-op that just acknowledges the request
  // The actual real-time notification is handled by the WebSocket layer
}
