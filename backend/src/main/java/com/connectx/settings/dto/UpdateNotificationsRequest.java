package com.connectx.settings.dto;

public class UpdateNotificationsRequest {

    private Boolean emailDirectMessages;
    private Boolean emailMentions;
    private Boolean emailConnections;
    private Boolean emailWeeklyDigest;
    private Boolean pushSounds;
    private Boolean pushMessagePreview;
    private Boolean pushNewConnections;
    private Boolean pushGroupUpdates;
    private String notificationRingtone;

    public UpdateNotificationsRequest() {
    }

    public Boolean getEmailDirectMessages() {
        return emailDirectMessages;
    }

    public void setEmailDirectMessages(Boolean emailDirectMessages) {
        this.emailDirectMessages = emailDirectMessages;
    }

    public Boolean getEmailMentions() {
        return emailMentions;
    }

    public void setEmailMentions(Boolean emailMentions) {
        this.emailMentions = emailMentions;
    }

    public Boolean getEmailConnections() {
        return emailConnections;
    }

    public void setEmailConnections(Boolean emailConnections) {
        this.emailConnections = emailConnections;
    }

    public Boolean getEmailWeeklyDigest() {
        return emailWeeklyDigest;
    }

    public void setEmailWeeklyDigest(Boolean emailWeeklyDigest) {
        this.emailWeeklyDigest = emailWeeklyDigest;
    }

    public Boolean getPushSounds() {
        return pushSounds;
    }

    public void setPushSounds(Boolean pushSounds) {
        this.pushSounds = pushSounds;
    }

    public Boolean getPushMessagePreview() {
        return pushMessagePreview;
    }

    public void setPushMessagePreview(Boolean pushMessagePreview) {
        this.pushMessagePreview = pushMessagePreview;
    }

    public Boolean getPushNewConnections() {
        return pushNewConnections;
    }

    public void setPushNewConnections(Boolean pushNewConnections) {
        this.pushNewConnections = pushNewConnections;
    }

    public Boolean getPushGroupUpdates() {
        return pushGroupUpdates;
    }

    public void setPushGroupUpdates(Boolean pushGroupUpdates) {
        this.pushGroupUpdates = pushGroupUpdates;
    }

    public String getNotificationRingtone() {
        return notificationRingtone;
    }

    public void setNotificationRingtone(String notificationRingtone) {
        this.notificationRingtone = notificationRingtone;
    }
}
