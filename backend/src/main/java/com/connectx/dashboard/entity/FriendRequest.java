package com.connectx.dashboard.entity;

import com.connectx.user.entity.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "friend_requests",
    indexes = {
        @Index(name = "idx_friend_req_receiver", columnList = "receiver_id, status"),
        @Index(name = "idx_friend_req_sender", columnList = "sender_id, status")
    }
)
public class FriendRequest {

    public enum RequestStatus {
        PENDING,
        ACCEPTED,
        DECLINED,
        CANCELLED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private RequestStatus status = RequestStatus.PENDING;

    @Column(name = "mutual_friends_count")
    private Integer mutualFriendsCount = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public FriendRequest() {
    }

    public FriendRequest(User sender, User receiver, Integer mutualFriendsCount) {
        this.sender = sender;
        this.receiver = receiver;
        this.mutualFriendsCount = mutualFriendsCount != null ? mutualFriendsCount : 0;
        this.status = RequestStatus.PENDING;
    }

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        if (this.createdAt == null) {
            this.createdAt = now;
        }
        this.updatedAt = now;
        if (this.status == null) {
            this.status = RequestStatus.PENDING;
        }
        if (this.mutualFriendsCount == null) {
            this.mutualFriendsCount = 0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public User getReceiver() {
        return receiver;
    }

    public void setReceiver(User receiver) {
        this.receiver = receiver;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public Integer getMutualFriendsCount() {
        return mutualFriendsCount;
    }

    public void setMutualFriendsCount(Integer mutualFriendsCount) {
        this.mutualFriendsCount = mutualFriendsCount;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
