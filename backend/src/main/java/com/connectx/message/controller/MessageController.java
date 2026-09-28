package com.connectx.message.controller;

import com.connectx.common.ApiResponse;
import com.connectx.dashboard.dto.UserSearchResultDto;
import com.connectx.message.dto.ConversationDto;
import com.connectx.message.dto.MessageDto;
import com.connectx.message.dto.SendMessageRequest;
import com.connectx.message.dto.WsMessagePayload;
import com.connectx.message.service.MessageService;
import com.connectx.message.websocket.ChatWebSocketHandler;
import com.connectx.security.CustomUserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;
    private final ChatWebSocketHandler chatWebSocketHandler;

    public MessageController(
            MessageService messageService,
            ChatWebSocketHandler chatWebSocketHandler) {
        this.messageService = messageService;
        this.chatWebSocketHandler = chatWebSocketHandler;
    }

    private UUID getUserId(CustomUserPrincipal principal) {
        if (principal == null) {
            throw new AccessDeniedException("User must be authenticated");
        }
        return principal.getId();
    }

    @GetMapping("/conversations")
    public ResponseEntity<ApiResponse<List<ConversationDto>>> getConversations(
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        UUID currentUserId = getUserId(principal);
        List<ConversationDto> conversations = messageService.getConversations(currentUserId);
        return ResponseEntity.ok(ApiResponse.success("Conversations retrieved successfully", conversations));
    }

    @GetMapping("/history/{partnerId}")
    public ResponseEntity<ApiResponse<List<MessageDto>>> getConversationHistory(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable UUID partnerId) {
        UUID currentUserId = getUserId(principal);
        List<MessageDto> history = messageService.getConversationHistory(currentUserId, partnerId);
        return ResponseEntity.ok(ApiResponse.success("Message history retrieved successfully", history));
    }

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<MessageDto>> sendMessage(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @Valid @RequestBody SendMessageRequest request) {
        UUID senderId = getUserId(principal);
        MessageDto saved = messageService.sendMessage(senderId, request);

        // Real-time broadcast to recipient if online
        if (chatWebSocketHandler.isUserOnline(request.getRecipientId())) {
            chatWebSocketHandler.sendToUser(request.getRecipientId(), WsMessagePayload.newMessage(saved));
        }

        return ResponseEntity.ok(ApiResponse.success("Message sent successfully", saved));
    }

    @PostMapping("/read/{partnerId}")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable UUID partnerId) {
        UUID currentUserId = getUserId(principal);
        messageService.markConversationAsRead(currentUserId, partnerId);

        // Notify partner via WebSocket
        if (chatWebSocketHandler.isUserOnline(partnerId)) {
            chatWebSocketHandler.sendToUser(partnerId, WsMessagePayload.messagesRead(currentUserId));
        }

        return ResponseEntity.ok(ApiResponse.success("Messages marked as read", null));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        UUID currentUserId = getUserId(principal);
        long count = messageService.getUnreadMessagesCount(currentUserId);
        return ResponseEntity.ok(ApiResponse.success("Unread messages count retrieved", count));
    }

    @GetMapping("/friends")
    public ResponseEntity<ApiResponse<List<UserSearchResultDto>>> getFriendsToChat(
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        UUID currentUserId = getUserId(principal);
        List<UserSearchResultDto> friends = messageService.getFriendsToChat(currentUserId);
        return ResponseEntity.ok(ApiResponse.success("Friends to chat retrieved successfully", friends));
    }
}
