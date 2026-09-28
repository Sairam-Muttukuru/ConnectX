package com.connectx.message.repository;

import com.connectx.message.entity.Message;
import com.connectx.message.entity.MessageStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {

    @Query("SELECT m FROM Message m " +
           "JOIN FETCH m.sender s " +
           "JOIN FETCH m.recipient r " +
           "WHERE (s.id = :u1 AND r.id = :u2) OR (s.id = :u2 AND r.id = :u1) " +
           "ORDER BY m.createdAt ASC")
    List<Message> findConversationHistory(@Param("u1") UUID u1, @Param("u2") UUID u2);

    @Query("SELECT m FROM Message m " +
           "JOIN FETCH m.sender s " +
           "JOIN FETCH m.recipient r " +
           "WHERE s.id = :userId OR r.id = :userId " +
           "ORDER BY m.createdAt DESC")
    List<Message> findAllByUserIdOrderByCreatedAtDesc(@Param("userId") UUID userId);

    long countByRecipientIdAndStatusNot(UUID recipientId, MessageStatus status);

    long countBySenderIdAndRecipientIdAndStatusNot(UUID senderId, UUID recipientId, MessageStatus status);

    @Modifying
    @Query("UPDATE Message m SET m.status = :status, m.readAt = :readAt " +
           "WHERE m.sender.id = :senderId AND m.recipient.id = :recipientId AND m.status <> :status")
    int markConversationAsRead(
            @Param("senderId") UUID senderId,
            @Param("recipientId") UUID recipientId,
            @Param("status") MessageStatus status,
            @Param("readAt") Instant readAt);

    @Query(value = "SELECT m FROM Message m " +
                   "WHERE (m.sender.id = :u1 AND m.recipient.id = :u2) OR (m.sender.id = :u2 AND m.recipient.id = :u1) " +
                   "ORDER BY m.createdAt DESC LIMIT 1")
    Optional<Message> findLatestMessageBetween(@Param("u1") UUID u1, @Param("u2") UUID u2);
}
