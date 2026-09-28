package com.connectx.settings.dto;

public class UpdatePrivacyRequest {

    private Boolean privateAccount;
    private Boolean showOnlineStatus;
    private Boolean showReadReceipts;
    private String allowDirectMessages;
    private Boolean searchEngineIndexing;

    public UpdatePrivacyRequest() {
    }

    public Boolean getPrivateAccount() {
        return privateAccount;
    }

    public void setPrivateAccount(Boolean privateAccount) {
        this.privateAccount = privateAccount;
    }

    public Boolean getShowOnlineStatus() {
        return showOnlineStatus;
    }

    public void setShowOnlineStatus(Boolean showOnlineStatus) {
        this.showOnlineStatus = showOnlineStatus;
    }

    public Boolean getShowReadReceipts() {
        return showReadReceipts;
    }

    public void setShowReadReceipts(Boolean showReadReceipts) {
        this.showReadReceipts = showReadReceipts;
    }

    public String getAllowDirectMessages() {
        return allowDirectMessages;
    }

    public void setAllowDirectMessages(String allowDirectMessages) {
        this.allowDirectMessages = allowDirectMessages;
    }

    public Boolean getSearchEngineIndexing() {
        return searchEngineIndexing;
    }

    public void setSearchEngineIndexing(Boolean searchEngineIndexing) {
        this.searchEngineIndexing = searchEngineIndexing;
    }
}
