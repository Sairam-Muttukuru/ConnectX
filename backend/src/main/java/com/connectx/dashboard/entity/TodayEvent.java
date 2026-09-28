package com.connectx.dashboard.entity;

import com.connectx.user.entity.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "dashboard_today_events",
    indexes = {
        @Index(name = "idx_today_events_user", columnList = "user_id")
    }
)
public class TodayEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "title", nullable = false, length = 150)
    private String title;

    @Column(name = "event_time", nullable = false, length = 100)
    private String eventTime;

    @Column(name = "icon_type", length = 50)
    private String iconType;

    @Column(name = "color_class", length = 150)
    private String colorClass;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public TodayEvent() {
    }

    public TodayEvent(User user, String title, String eventTime, String iconType, String colorClass) {
        this.user = user;
        this.title = title;
        this.eventTime = eventTime;
        this.iconType = iconType;
        this.colorClass = colorClass;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getEventTime() {
        return eventTime;
    }

    public void setEventTime(String eventTime) {
        this.eventTime = eventTime;
    }

    public String getIconType() {
        return iconType;
    }

    public void setIconType(String iconType) {
        this.iconType = iconType;
    }

    public String getColorClass() {
        return colorClass;
    }

    public void setColorClass(String colorClass) {
        this.colorClass = colorClass;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
