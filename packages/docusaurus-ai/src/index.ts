export interface PluginOptions {
    chatUrl?: string;
}

import { DocusaurusContext, ThemeConfig } from "@docusaurus/types";
const PLUGIN_NAME = "@ahelmy/docusaurus-ai";


export default function DocusaurusAIPlugin(
  context: DocusaurusContext,
  options?: PluginOptions,
): any {
  const chatUrl = options?.chatUrl || "/api/predict";
  return {
    name: PLUGIN_NAME,
    injectHtmlTags() {
        return {
            postBodyTags: [
              `
              <style> 
                .chat-button {
                  position: fixed;
                  bottom: 20px;
                  right: 20px;
                  width: 60px;
                  height: 60px;
                  border-radius: 50%;
                  background: var(--ifm-color-primary);
                  border: none;
                  cursor: pointer;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                  font-size: 24px;
                  transition: transform 0.3s ease;
                  z-index: 1000;
                }

                .chat-button:hover {
                  transform: scale(1.1);
                }
                
                .chat-container {
                  position: fixed;
                  bottom: 100px;
                  right: 20px;
                  width: 350px;
                  height: 500px;
                  background: #ffffff;
                  border-radius: 12px;
                  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
                  display: flex;
                  flex-direction: column;
                  z-index: 1000;
                }

                .chat-header {
                  padding: 15px;
                  background: var(--ifm-color-primary);
                  border-radius: 12px 12px 0 0;
                  color: white;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                }

                .chat-header h3 {
                  margin: 0;
                  font-size: 16px;
                }

                .close-button {
                  background: none;
                  border: none;
                  color: white;
                  font-size: 24px;
                  cursor: pointer;
                  padding: 0;
                }

                .messages-container {
                  flex: 1;
                  padding: 20px;
                  overflow-y: auto;
                  background: #f5f5f5;
                }

                .message {
                  margin: 8px 0;
                  padding: 10px 15px;
                  border-radius: 15px;
                  max-width: 80%;
                  word-wrap: break-word;
                }

                .user-message {
                  background: var(--ifm-color-primary-lightest);
                  color: white;
                  margin-left: auto;
                }

                .bot-message {
                  background: white;
                  color: #213547;
                  margin-right: auto;
                }

                .loading {
                  background: #e0e0e0;
                }

                .input-area {
                  padding: 15px;
                  border-top: 1px solid #eee;
                  display: flex;
                  gap: 10px;
                }

                .chat-input {
                  flex: 1;
                  padding: 8px 12px;
                  border: 1px solid #ddd;
                  border-radius: 20px;
                  outline: none;
                  font-size: 14px;
                }

                .send-button {
                  padding: 8px 15px;
                  background: var(--ifm-color-primary);
                  color: white;
                  border: none;
                  border-radius: 20px;
                  cursor: pointer;
                }

                .send-button:hover {
                  background: var(--ifm-color-primary);
                }

                .disclaimer {
                  font-size: .75rem;
                  text-align: center;
                  color: gray;
                }

                @media (prefers-color-scheme: light) {
                  .chat-button {
                    background: var(--ifm-color-primary);
                    color: white;
                  }
                  
                  .chat-container {
                    background: white;
                  }
                }
              </style>
              `,
              `              
              <script>
                function createChatButton() {
                  const button = document.createElement('button');
                  button.className = 'chat-button';
                  button.innerHTML = '✨';
                  return button;
                }

                function createChatContainer() {
                  const container = document.createElement('div');
                  container.className = 'chat-container';
                  container.style.display = 'none';

                  container.innerHTML = '<div class="chat-header"><h3>AI Assistant</h3><button class="close-button">×</button></div><div class="messages-container"></div><div class="input-area"><input type="text" placeholder="Type your message..." class="chat-input"><button class="send-button">Send</button></div><span class="disclaimer">AI assistant can make mistakes. Check important info</span>';

                  return container;
                }

                function createMessage(text, sender) {
                  const messageDiv = document.createElement('div');
                  messageDiv.className = "message "+sender+"-message";
                  messageDiv.textContent = text;
                  return messageDiv;
                }

                function createLoadingMessage() {
                  const loadingMessage = document.createElement('div');
                  loadingMessage.className = 'message bot-message loading';
                  loadingMessage.textContent = '...';
                  return loadingMessage;
                }
                class ChatBot {
                  constructor() {
                    this.messages = [];
                    this.isOpen = false;
                    this.init();
                  }

                  init() {
                    this.button = createChatButton();
                    this.container = createChatContainer();
                    
                    document.body.appendChild(this.button);
                    document.body.appendChild(this.container);
                    
                    this.messagesContainer = this.container.querySelector('.messages-container');
                    this.attachEventListeners();
                  }

                  attachEventListeners() {
                    this.button.addEventListener('click', () => this.toggleChat());
                    this.container.querySelector('.close-button').addEventListener('click', () => this.toggleChat());

                    const input = this.container.querySelector('.chat-input');
                    const sendButton = this.container.querySelector('.send-button');

                    const sendMessage = () => {
                      const message = input.value.trim();
                      if (message) {
                        this.addMessage(message, 'user');
                        this.handleBotResponse(message);
                        input.value = '';
                      }
                    };

                    sendButton.addEventListener('click', sendMessage);
                    input.addEventListener('keypress', (e) => {
                      if (e.key === 'Enter') {
                        sendMessage();
                      }
                    });
                  }

                  toggleChat() {
                    this.isOpen = !this.isOpen;
                    this.container.style.display = this.isOpen ? 'flex' : 'none';
                    if (this.isOpen) {
                      this.container.querySelector('.chat-input').focus();
                    }
                  }

                  addMessage(text, sender) {
                    const messageElement = createMessage(text, sender);
                    this.messagesContainer.appendChild(messageElement);
                    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
                  }

                  handleBotResponse(message) {
                    const loadingMessage = createLoadingMessage();
                    this.messagesContainer.appendChild(loadingMessage);

                    fetch('${chatUrl}?q=' + message)
                      .then((response) => response.json())
                      .then((data) => {
                          this.addMessage(data.result, 'bot');
                      }).catch((error)=>{
                        this.addMessage('Sorry, I am not available right now. Please try again later.', 'bot');
                      }).finally(() => {
                        loadingMessage.remove();
                      });
                  }
                }
                new ChatBot();
              </script>`
            ]
        };
    },
    async postBuild() {
      // Hook to process docs after build.
    },
    async loadContent() {
        // Hook to process docs during build.
    },
  };
}

