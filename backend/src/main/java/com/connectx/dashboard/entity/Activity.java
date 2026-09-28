package com.connectx.dashboard.entity;

import com.connectx.user.entity.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "dashboard_activities",
    indexes = {
        @Index(name = "idx_activity_user_created", columnList = "user_id, created_at")
    }
)
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "actor_name", nullable = false, length = 100)
    private String actorName;

    @Column(name = "actor_avatar", length = 500)
    private String actorAvatar;

    @Column(name = "action_text", nullable = false, length = 255)
    private String actionText;

    @Column(name = "time_ago", length = 50)
    private String timeAgo;

    @Column(name = "activity_type", length = 50)
    private String activityType;

    @Column(name = "icon_color", length = 100)
    private String iconColor;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public Activity() {
    }

    public Activity(User user, String actorName, String actorAvatar, String actionText, String timeAgo, String activityType, String iconColor) {
        this.user = user;
        this.actorName = actorName;
        this.actorAvatar = actorAvatar;
        this.actionText = actionText;
        this.timeAgo = timeAgo;
        this.activityType = activityType;
        this.iconColor = iconColor;
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = Instant.now();
        }
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getActorName() {
        return actorName;
    }

    public void setActorName(String actorName) {
        this.actorName = actorName;
    }

    public String getActorAvatar() {
        return actorAvatar;
    }

    public void setActorAvatar(String actorAvatar) {
        this.actorAvatar = actorAvatar;
    }

    public String getActionText() {
        return actionText;
    }

    public void setActionText(String actionText) {
        this.actionText = actionText;
    }

    public String getTimeAgo() {
        return timeAgo;
    }

    public void setTimeAgo(String timeAgo) {
        this.timeAgo = timeAgo;
    }

    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }

    public String getIconColor() {
        return iconColor;
    }

    public void setIconColor(String iconColor) {
        this.iconColor = iconColor;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
