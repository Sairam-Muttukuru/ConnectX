package com.connectx.message.service;

import com.connectx.dashboard.dto.UserSearchResultDto;
import com.connectx.message.dto.ConversationDto;
import com.connectx.message.dto.MessageDto;
import com.connectx.message.dto.SendMessageRequest;

import java.util.List;
import java.util.UUID;

public interface MessageService {

    MessageDto sendMessage(UUID senderId, SendMessageRequest request);

    List<MessageDto> getConversationHistory(UUID currentUserId, UUID partnerId);

    List<ConversationDto> getConversations(UUID currentUserId);

    void markConversationAsRead(UUID currentUserId, UUID partnerId);

    long getUnreadMessagesCount(UUID currentUserId);

    List<UserSearchResultDto> getFriendsToChat(UUID currentUserId);
}
