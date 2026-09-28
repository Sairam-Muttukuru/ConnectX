package com.connectx.settings.dto;

public class UpdateAppearanceRequest {

    private String theme;
    private String accentColor;
    private Boolean compactMode;
    private String messageFontSize;

    public UpdateAppearanceRequest() {
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public String getAccentColor() {
        return accentColor;
    }

    public void setAccentColor(String accentColor) {
        this.accentColor = accentColor;
    }

    public Boolean getCompactMode() {
        return compactMode;
    }

    public void setCompactMode(Boolean compactMode) {
        this.compactMode = compactMode;
    }

    public String getMessageFontSize() {
        return messageFontSize;
    }

    public void setMessageFontSize(String messageFontSize) {
        this.messageFontSize = messageFontSize;
    }
}
