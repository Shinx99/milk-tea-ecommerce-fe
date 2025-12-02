<template>
  <!-- Main container for the fixed widget -->
  <div class="chat-widget-container">
    
    <!-- Floating Toggle Button -->
    <button class="floating-button" @click="toggleChat">
      <!-- Icon Chat (Lucide Icon: MessageSquare) -->
      <svg v-if="!chatOpen" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-7 h-7">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <!-- Icon Close (Lucide Icon: X) -->
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-7 h-7">
        <path d="M18 6L6 18M6 6L18 18"></path>
      </svg>
    </button>

    <!-- Chat Box Content (Hiển thị khi chatOpen là true) -->
    <div class="chatbox-wrapper" v-if="chatOpen">
      <!-- Chat Header -->
      <header class="chat-header">
        <h2 class="chat-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          Trợ Lý AI Góc Mèo Lười
        </h2>
      </header>

      <!-- Chat Messages Container -->
      <div class="chat-messages" ref="chatContainer">
        <div v-for="(msg, index) in messages" :key="index" :class="['message-row', msg.sender]">
          <div :class="['message-bubble', msg.sender]">
            <strong class="text-xs font-semibold" v-if="msg.sender === 'user'">Bạn:</strong>
            <strong class="text-xs font-semibold" v-else>AI Mèo Lười:</strong>
            <p class="message-text">{{ msg.text }}</p>
          </div>
        </div>

        <!-- Loading Indicator -->
        <div v-if="loading" class="message-row AI">
          <div class="message-bubble AI loading">
            <strong class="text-sm font-semibold">AI:</strong>
            <div class="dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Input -->
      <div class="chat-input">
        <input
          type="text"
          v-model="input"
          @keyup.enter="sendMessage"
          :disabled="loading"
          placeholder="Nhập tin nhắn..."
          class="input-field"
        />
        <button 
          @click="sendMessage" 
          :disabled="!input.trim() || loading" 
          class="send-button"
        >
          <span v-if="loading">Đang gửi...</span>
          <span v-else>Gửi</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from "@/shared/service/apiClient"; 

export default {
  name: "ChatBox",
  data() {
    return {
      chatOpen: false, // Trạng thái đóng/mở chat
      input: "",
      messages: [
        { sender: 'AI', text: 'Chào bạn! Tôi là trợ lý AI. Tôi có thể giúp gì cho bạn hôm nay?' }
      ],
      loading: false,
    };
  },
  mounted() {
    this.scrollToBottom();
  },
  methods: {
    /**
     * Chuyển đổi trạng thái đóng mở của hộp chat.
     */
    toggleChat() {
      this.chatOpen = !this.chatOpen;
      if (this.chatOpen) {
        this.scrollToBottom(); // Cuộn xuống cuối khi mở
      }
    },

    /**
     * Cuộn xuống cuối hộp chat sau khi DOM được cập nhật.
     */
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.chatContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },

    async sendMessage() {
      if (!this.input.trim() || this.loading) return;

      const userMessage = this.input.trim();
      
      this.messages.push({ sender: "user", text: userMessage });
      this.input = "";
      this.loading = true;
      this.scrollToBottom();

      try {
        // Gọi API trực tiếp
        const response = await apiClient.post("/chat", {
          message: userMessage,
        });

        const geminiReplyText = response.data;
        
        this.messages.push({ sender: "AI", text: geminiReplyText || "Không có phản hồi từ AI." });
          
      } catch (error) {
        console.error("Chat error:", error);
        this.messages.push({
          sender: "AI",
          text: "Xin lỗi, đã xảy ra lỗi hệ thống khi nhận phản hồi.",
        });
      } finally {
        this.loading = false;
        this.scrollToBottom();
      }
    },
  },
};
</script>

<style scoped>
/* ------------------------------------------------ */
/* FIXED WIDGET CONTAINER */
/* ------------------------------------------------ */
.chat-widget-container {
  /* Vị trí cố định ở góc dưới bên phải */
  position: fixed;
  bottom: 20px;
  right: 20px;
  /* Đảm bảo nằm trên các phần tử khác */
  z-index: 1000; 
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-family: 'Inter', sans-serif;
}

/* ------------------------------------------------ */
/* FLOATING BUTTON */
/* ------------------------------------------------ */
.floating-button {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #4f46e5; /* Màu Indigo, giống Zalo/Facebook */
  color: white;
  border: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, background-color 0.2s ease;
  z-index: 1001; /* Đảm bảo nút nằm trên hộp chat */
  
  /* Đẩy nút lên trên hộp chat */
  margin-top: 1rem; 
}

.chatbox-wrapper {
  /* Vị trí của hộp chat (nằm bên trên nút) */
  margin-bottom: 1rem; /* Khoảng cách giữa hộp chat và nút */
  /* Thiết lập kích thước và style chung */
  display: flex;
  flex-direction: column;
  max-width: 360px; /* Chiều rộng hẹp hơn cho widget */
  min-height: 450px;
  max-height: 80vh; /* Giới hạn chiều cao trên thiết bị lớn */
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15); 
  background-color: #ffffff;
  overflow: hidden;
  transition: all 0.3s ease;
}

/* ------------------------------------------------ */
/* CHAT CONTENT STYLES (Existing styles adapted) */
/* ------------------------------------------------ */
.chat-header {
  padding: 1rem;
  background-color: #4f46e5; 
  color: white;
  border-bottom: 1px solid #3d34a4;
}

.chat-title {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.chat-messages {
  flex-grow: 1;
  padding: 1rem;
  overflow-y: auto;
  background-color: #f5f7fa; 
}

.message-row {
  display: flex;
  margin-bottom: 0.75rem;
}

.message-row.user {
  justify-content: flex-end;
}

.message-row.AI {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 85%;
  padding: 0.75rem 1rem;
  border-radius: 18px;
  line-height: 1.5;
  word-wrap: break-word;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  font-size: 0.9rem;
}

.message-bubble strong {
  display: block;
  font-size: 0.65rem;
  margin-bottom: 0.1rem;
  opacity: 0.7;
}

.message-bubble.user {
  background-color: #4f46e5; 
  color: white;
  border-bottom-right-radius: 4px; 
}

.message-bubble.AI {
  background-color: #ffffff;
  color: #333;
  border: 1px solid #e5e5e5;
  border-bottom-left-radius: 4px;
}

.chat-input {
  display: flex;
  padding: 1rem;
  border-top: 1px solid #e0e0e0;
  background-color: #ffffff;
}

.input-field {
  flex-grow: 1;
  padding: 0.6rem 1rem;
  border: 1px solid #ccc;
  border-radius: 20px;
  margin-right: 0.5rem;
  font-size: 0.9rem;
}

.send-button {
  padding: 0.6rem 1.2rem;
  background-color: #10b981; 
  color: white;
  border: none;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.send-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.7;
}

/* Loading Indicator (Hiệu ứng ba chấm) */
.loading {
  display: flex;
  align-items: center;
}
.dots {
  display: inline-flex;
  margin-left: 0.5rem;
}
.dots span {
  width: 7px;
  height: 7px;
  margin: 0 3px;
  background-color: #555;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}
.dots span:nth-child(1) { animation-delay: -0.32s; }
.dots span:nth-child(2) { animation-delay: -0.16s; }
.dots span:nth-child(3) { animation-delay: 0s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
  40% { transform: scale(1.0); opacity: 1; }
}

/* Responsive cho thiết bị di động */
@media (max-width: 400px) {
  .chatbox-wrapper {
    max-width: calc(100vw - 40px);
    max-height: 90vh;
  }
}
</style>