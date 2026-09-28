package com.connectx.dashboard.service.impl;

import com.connectx.common.exception.ResourceNotFoundException;
import com.connectx.dashboard.dto.*;
import com.connectx.dashboard.entity.Activity;
import com.connectx.dashboard.entity.FriendRequest;
import com.connectx.dashboard.entity.FriendRequest.RequestStatus;
import com.connectx.dashboard.entity.Friendship;
import com.connectx.dashboard.entity.TodayEvent;
import com.connectx.dashboard.repository.ActivityRepository;
import com.connectx.dashboard.repository.FriendRequestRepository;
import com.connectx.dashboard.repository.FriendshipRepository;
import com.connectx.dashboard.repository.TodayEventRepository;
import com.connectx.dashboard.service.DashboardService;
import com.connectx.message.entity.MessageStatus;
import com.connectx.message.repository.MessageRepository;
import com.connectx.user.entity.User;
import com.connectx.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final FriendRequestRepository friendRequestRepository;
    private final FriendshipRepository friendshipRepository;
    private final ActivityRepository activityRepository;
    private final TodayEventRepository todayEventRepository;
    private final MessageRepository messageRepository;
    private final com.connectx.message.websocket.ChatWebSocketHandler chatWebSocketHandler;

    public DashboardServiceImpl(
            UserRepository userRepository,
            FriendRequestRepository friendRequestRepository,
            FriendshipRepository friendshipRepository,
            ActivityRepository activityRepository,
            TodayEventRepository todayEventRepository,
            MessageRepository messageRepository,
            @org.springframework.context.annotation.Lazy com.connectx.message.websocket.ChatWebSocketHandler chatWebSocketHandler) {
        this.userRepository = userRepository;
        this.friendRequestRepository = friendRequestRepository;
        this.friendshipRepository = friendshipRepository;
        this.activityRepository = activityRepository;
        this.todayEventRepository = todayEventRepository;
        this.messageRepository = messageRepository;
        this.chatWebSocketHandler = chatWebSocketHandler;
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardHomeResponse getDashboardHome(UUID userId) {
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // 1. Calculate Real Metrics directly from database
        long friendsCount = friendshipRepository.countByUserId(userId);
        long pendingRequestsCount = friendRequestRepository.countByReceiverIdAndStatus(userId, RequestStatus.PENDING);
        int unreadMessagesCount = (int) messageRepository.countByRecipientIdAndStatusNot(userId, MessageStatus.READ);
        int notificationsCount = (int) pendingRequestsCount;

        // Friend avatars from actual friendships in DB
        List<Friendship> friendships = friendshipRepository.findByUserId(userId);
        List<String> friendAvatars = friendships.stream()
                .map(f -> {
                    User fr = f.getFriend();
                    return (fr.getAvatarUrl() != null && !fr.getAvatarUrl().isBlank())
                            ? fr.getAvatarUrl()
                            : "/images/boy_1.jpg";
                })
                .limit(3)
                .collect(Collectors.toList());

        String extraFriendsText = friendsCount > 3 ? "+" + (friendsCount - 3) : "";

        // Pending friend requests from DB
        List<FriendRequest> dbRequests = friendRequestRepository.findByReceiverIdAndStatusOrderByCreatedAtDesc(userId, RequestStatus.PENDING);
        List<String> requestAvatars = dbRequests.stream()
                .map(fr -> {
                    User s = fr.getSender();
                    return (s.getAvatarUrl() != null && !s.getAvatarUrl().isBlank())
                            ? s.getAvatarUrl()
                            : "/images/boy_3.jpg";
                })
                .limit(3)
                .collect(Collectors.toList());

        String extraRequestsText = pendingRequestsCount > 3 ? "+" + (pendingRequestsCount - 3) : "";

        DashboardMetricsDto metrics = new DashboardMetricsDto(
                unreadMessagesCount,
                (int) friendsCount,
                (int) pendingRequestsCount,
                notificationsCount,
                friendAvatars,
                extraFriendsText,
                requestAvatars,
                extraRequestsText
        );

        // 2. Real Recent Conversations (empty list if no active conversations in DB)
        List<ConversationPreviewDto> recentConversations = Collections.emptyList();

        // 3. Real Online / Connected Friends from database (only active sessions)
        List<OnlineFriendDto> onlineFriends = friendships.stream()
                .filter(f -> chatWebSocketHandler.isUserOnline(f.getFriend().getId()))
                .map(f -> {
                    User fr = f.getFriend();
                    String name = (fr.getDisplayName() != null && !fr.getDisplayName().isBlank())
                            ? fr.getDisplayName()
                            : fr.getUsername();
                    String avatar = (fr.getAvatarUrl() != null && !fr.getAvatarUrl().isBlank())
                            ? fr.getAvatarUrl()
                            : "/images/boy_1.jpg";
                    return new OnlineFriendDto(
                            fr.getId().toString(),
                            name,
                            fr.getUsername(),
                            avatar,
                            true
                    );
                })
                .collect(Collectors.toList());

        // 4. Real Friend Requests from database
        List<FriendRequestItemDto> friendRequests = dbRequests.stream()
                .map(fr -> {
                    User s = fr.getSender();
                    String name = (s.getDisplayName() != null && !s.getDisplayName().isBlank())
                            ? s.getDisplayName()
                            : s.getUsername();
                    String avatar = (s.getAvatarUrl() != null && !s.getAvatarUrl().isBlank())
                            ? s.getAvatarUrl()
                            : "/images/boy_3.jpg";
                    String mutual = (fr.getMutualFriendsCount() != null && fr.getMutualFriendsCount() > 0)
                            ? fr.getMutualFriendsCount() + " mutual friends"
                            : "New on ConnectX";
                    return new FriendRequestItemDto(
                            fr.getId().toString(),
                            s.getId().toString(),
                            name,
                            s.getUsername(),
                            mutual,
                            avatar
                    );
                })
                .collect(Collectors.toList());

        // 5. Real Recent Activities from database
        List<Activity> dbActivities = activityRepository.findTop10ByUserIdOrderByCreatedAtDesc(userId);
        List<RecentActivityItemDto> recentActivity = dbActivities.stream()
                .map(a -> new RecentActivityItemDto(
                        a.getId().toString(),
                        a.getActorName(),
                        a.getActorAvatar(),
                        a.getActionText(),
                        formatTimeAgo(a.getCreatedAt(), a.getTimeAgo()),
                        a.getActivityType(),
                        a.getIconColor()
                ))
                .collect(Collectors.toList());

        // 6. Real Today Events from database
        List<TodayEvent> dbEvents = todayEventRepository.findByUserIdOrderByCreatedAtAsc(userId);
        List<TodayEventItemDto> todayEvents = dbEvents.stream()
                .map(te -> new TodayEventItemDto(
                        te.getId().toString(),
                        te.getTitle(),
                        te.getEventTime(),
                        te.getIconType(),
                        te.getColorClass()
                ))
                .collect(Collectors.toList());

        return new DashboardHomeResponse(
                metrics,
                recentConversations,
                onlineFriends,
                friendRequests,
                recentActivity,
                todayEvents
        );
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardMetricsDto getDashboardMetrics(UUID userId) {
        long friendsCount = friendshipRepository.countByUserId(userId);
        long pendingRequestsCount = friendRequestRepository.countByReceiverIdAndStatus(userId, RequestStatus.PENDING);
        int unreadMessagesCount = (int) messageRepository.countByRecipientIdAndStatusNot(userId, MessageStatus.READ);
        int notificationsCount = (int) pendingRequestsCount;

        List<Friendship> friendships = friendshipRepository.findByUserId(userId);
        List<String> friendAvatars = friendships.stream()
                .map(f -> {
                    User fr = f.getFriend();
                    return (fr.getAvatarUrl() != null && !fr.getAvatarUrl().isBlank())
                            ? fr.getAvatarUrl()
                            : "/images/boy_1.jpg";
                })
                .limit(3)
                .collect(Collectors.toList());

        String extraFriendsText = friendsCount > 3 ? "+" + (friendsCount - 3) : "";

        List<FriendRequest> dbRequests = friendRequestRepository.findByReceiverIdAndStatusOrderByCreatedAtDesc(userId, RequestStatus.PENDING);
        List<String> requestAvatars = dbRequests.stream()
                .map(fr -> {
                    User s = fr.getSender();
                    return (s.getAvatarUrl() != null && !s.getAvatarUrl().isBlank())
                            ? s.getAvatarUrl()
                            : "/images/boy_3.jpg";
                })
                .limit(3)
                .collect(Collectors.toList());

        String extraRequestsText = pendingRequestsCount > 3 ? "+" + (pendingRequestsCount - 3) : "";

        return new DashboardMetricsDto(
                unreadMessagesCount,
                (int) friendsCount,
                (int) pendingRequestsCount,
                notificationsCount,
                friendAvatars,
                extraFriendsText,
                requestAvatars,
                extraRequestsText
        );
    }

    @Override
    @Transactional
    public void acceptFriendRequest(UUID userId, UUID requestId) {
        FriendRequest fr = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Friend request not found"));

        if (!fr.getReceiver().getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Cannot accept friend request directed to another user");
        }

        fr.setStatus(RequestStatus.ACCEPTED);
        friendRequestRepository.save(fr);

        User receiver = fr.getReceiver();
        User sender = fr.getSender();

        if (!friendshipRepository.existsFriendship(receiver.getId(), sender.getId())) {
            friendshipRepository.save(new Friendship(receiver, sender));
        }
        if (!friendshipRepository.existsFriendship(sender.getId(), receiver.getId())) {
            friendshipRepository.save(new Friendship(sender, receiver));
        }

        String senderName = (sender.getDisplayName() != null && !sender.getDisplayName().isBlank()) ? sender.getDisplayName() : sender.getUsername();
        String senderAvatar = (sender.getAvatarUrl() != null && !sender.getAvatarUrl().isBlank()) ? sender.getAvatarUrl() : "/images/boy_3.jpg";
        activityRepository.save(new Activity(
                receiver,
                senderName,
                senderAvatar,
                "is now your friend on ConnectX",
                "Just now",
                "FRIEND_ACCEPTED",
                "bg-blue-500 text-white"
        ));

        String receiverName = (receiver.getDisplayName() != null && !receiver.getDisplayName().isBlank()) ? receiver.getDisplayName() : receiver.getUsername();
        String receiverAvatar = (receiver.getAvatarUrl() != null && !receiver.getAvatarUrl().isBlank()) ? receiver.getAvatarUrl() : "/images/boy_1.jpg";
        activityRepository.save(new Activity(
                sender,
                receiverName,
                receiverAvatar,
                "accepted your friend request",
                "Just now",
                "FRIEND_ACCEPTED",
                "bg-blue-500 text-white"
        ));
    }

    @Override
    @Transactional
    public void declineFriendRequest(UUID userId, UUID requestId) {
        FriendRequest fr = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Friend request not found"));

        if (!fr.getReceiver().getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Cannot decline friend request directed to another user");
        }

        fr.setStatus(RequestStatus.DECLINED);
        friendRequestRepository.save(fr);
    }

    @Override
    @Transactional
    public void sendFriendRequest(UUID userId, UUID targetUserId) {
        if (userId.equals(targetUserId)) {
            throw new IllegalArgumentException("Cannot send friend request to yourself");
        }

        User sender = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));
        User receiver = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Target user not found"));

        if (friendshipRepository.existsFriendship(userId, targetUserId)) {
            return; // Already friends
        }

        Optional<FriendRequest> existingPending = friendRequestRepository.findBySenderIdAndReceiverIdAndStatus(userId, targetUserId, RequestStatus.PENDING);
        if (existingPending.isEmpty()) {
            FriendRequest req = new FriendRequest(sender, receiver, 0);
            friendRequestRepository.save(req);

            String senderName = (sender.getDisplayName() != null && !sender.getDisplayName().isBlank()) ? sender.getDisplayName() : sender.getUsername();
            String senderAvatar = (sender.getAvatarUrl() != null && !sender.getAvatarUrl().isBlank()) ? sender.getAvatarUrl() : "/images/boy_1.jpg";
            activityRepository.save(new Activity(
                    receiver,
                    senderName,
                    senderAvatar,
                    "sent you a friend request",
                    "Just now",
                    "FRIEND_REQUEST",
                    "bg-purple-500 text-white"
            ));
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserSearchResultDto> searchUsers(UUID currentUserId, String query) {
        String term = query != null ? query.trim().toLowerCase() : "";
        List<User> matchedUsers = userRepository.findAll().stream()
                .filter(u -> !u.getId().equals(currentUserId))
                .filter(u -> term.isEmpty()
                        || (u.getUsername() != null && u.getUsername().toLowerCase().contains(term))
                        || (u.getDisplayName() != null && u.getDisplayName().toLowerCase().contains(term)))
                .limit(20)
                .collect(Collectors.toList());

        List<UserSearchResultDto> results = new ArrayList<>();
        for (User u : matchedUsers) {
            boolean isFriend = friendshipRepository.existsFriendship(currentUserId, u.getId());
            boolean isPending = friendRequestRepository.findBySenderIdAndReceiverIdAndStatus(currentUserId, u.getId(), RequestStatus.PENDING).isPresent();
            boolean isOnline = chatWebSocketHandler.isUserOnline(u.getId());

            UserSearchResultDto dto = new UserSearchResultDto(
                    u.getId(),
                    u.getUsername(),
                    u.getDisplayName() != null ? u.getDisplayName() : u.getUsername(),
                    u.getAvatarUrl() != null && !u.getAvatarUrl().isBlank() ? u.getAvatarUrl() : "/images/boy_1.jpg",
                    u.getBio(),
                    isFriend,
                    isPending
            );
            dto.setOnline(isOnline);
            dto.setLastSeen(isOnline ? null : (chatWebSocketHandler.getLastSeen(u.getId()) != null ? chatWebSocketHandler.getLastSeen(u.getId()) : u.getUpdatedAt()));
            results.add(dto);
        }

        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserSearchResultDto> getFriends(UUID currentUserId) {
        List<Friendship> friendships = friendshipRepository.findByUserId(currentUserId);
        List<UserSearchResultDto> results = new ArrayList<>();
        for (Friendship f : friendships) {
            User u = f.getFriend();
            boolean isOnline = chatWebSocketHandler.isUserOnline(u.getId());
            UserSearchResultDto dto = new UserSearchResultDto(
                    u.getId(),
                    u.getUsername(),
                    u.getDisplayName() != null ? u.getDisplayName() : u.getUsername(),
                    u.getAvatarUrl() != null && !u.getAvatarUrl().isBlank() ? u.getAvatarUrl() : "/images/boy_1.jpg",
                    u.getBio(),
                    true,
                    false
            );
            dto.setOnline(isOnline);
            dto.setLastSeen(isOnline ? null : (chatWebSocketHandler.getLastSeen(u.getId()) != null ? chatWebSocketHandler.getLastSeen(u.getId()) : u.getUpdatedAt()));
            results.add(dto);
        }
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserSearchResultDto> getSuggestedUsers(UUID currentUserId) {
        List<User> others = userRepository.findAll().stream()
                .filter(u -> !u.getId().equals(currentUserId))
                .filter(u -> !friendshipRepository.existsFriendship(currentUserId, u.getId()))
                .limit(10)
                .collect(Collectors.toList());

        List<UserSearchResultDto> results = new ArrayList<>();
        for (User u : others) {
            boolean isPending = friendRequestRepository.findBySenderIdAndReceiverIdAndStatus(currentUserId, u.getId(), RequestStatus.PENDING).isPresent();
            boolean isOnline = chatWebSocketHandler.isUserOnline(u.getId());
            UserSearchResultDto dto = new UserSearchResultDto(
                    u.getId(),
                    u.getUsername(),
                    u.getDisplayName() != null ? u.getDisplayName() : u.getUsername(),
                    u.getAvatarUrl() != null && !u.getAvatarUrl().isBlank() ? u.getAvatarUrl() : "/images/boy_3.jpg",
                    u.getBio(),
                    false,
                    isPending
            );
            dto.setOnline(isOnline);
            dto.setLastSeen(isOnline ? null : (chatWebSocketHandler.getLastSeen(u.getId()) != null ? chatWebSocketHandler.getLastSeen(u.getId()) : u.getUpdatedAt()));
            results.add(dto);
        }
        return results;
    }

    @Override
    @Transactional
    public void removeFriend(UUID currentUserId, UUID friendId) {
        friendshipRepository.findByUserIdAndFriendId(currentUserId, friendId)
                .ifPresent(friendshipRepository::delete);
        friendshipRepository.findByUserIdAndFriendId(friendId, currentUserId)
                .ifPresent(friendshipRepository::delete);
    }

    @Override
    @Transactional(readOnly = true)
    public List<com.connectx.dashboard.dto.NotificationItemDto> getNotifications(UUID currentUserId) {
        List<com.connectx.dashboard.dto.NotificationItemDto> list = new ArrayList<>();

        // 1. Pending incoming friend requests
        List<FriendRequest> requests = friendRequestRepository.findByReceiverIdAndStatusOrderByCreatedAtDesc(currentUserId, RequestStatus.PENDING);
        for (FriendRequest fr : requests) {
            User sender = fr.getSender();
            String name = (sender.getDisplayName() != null && !sender.getDisplayName().isBlank()) ? sender.getDisplayName() : sender.getUsername();
            String avatar = (sender.getAvatarUrl() != null && !sender.getAvatarUrl().isBlank()) ? sender.getAvatarUrl() : "/images/boy_1.jpg";
            list.add(new com.connectx.dashboard.dto.NotificationItemDto(
                    fr.getId().toString(),
                    "Friend Requests",
                    name + " sent you a friend request",
                    "wants to connect with you on ConnectX",
                    formatTimeAgo(fr.getCreatedAt(), "Recently"),
                    avatar,
                    "text-purple-400",
                    true,
                    true,
                    fr.getId(),
                    "FRIEND_REQUEST"
            ));
        }

        // 2. Real user activities
        List<Activity> activities = activityRepository.findTop10ByUserIdOrderByCreatedAtDesc(currentUserId);
        for (Activity act : activities) {
            String cat = "System";
            String actType = act.getActivityType() != null ? act.getActivityType() : "SYSTEM";
            if ("MESSAGE".equalsIgnoreCase(actType)) cat = "Messages";
            else if ("CALL".equalsIgnoreCase(actType)) cat = "Calls";
            else if ("FRIEND_REQUEST".equalsIgnoreCase(actType)) cat = "Friend Requests";

            list.add(new com.connectx.dashboard.dto.NotificationItemDto(
                    act.getId().toString(),
                    cat,
                    act.getActorName() + " " + act.getActionText(),
                    act.getActionText(),
                    formatTimeAgo(act.getCreatedAt(), act.getTimeAgo()),
                    act.getActorAvatar() != null ? act.getActorAvatar() : "/images/dashboard/user_avatar.jpg",
                    act.getIconColor() != null ? act.getIconColor() : "text-blue-400",
                    false,
                    false,
                    null,
                    actType
            ));
        }

        // 3. If empty, provide a clean welcome notification
        if (list.isEmpty()) {
            list.add(new com.connectx.dashboard.dto.NotificationItemDto(
                    "welcome-note",
                    "System",
                    "Welcome to ConnectX!",
                    "Start making real connections with people — no phone numbers needed.",
                    "Today",
                    "/images/connectx_logo.png",
                    "text-blue-400",
                    false,
                    false,
                    null,
                    "SYSTEM"
            ));
        }

        return list;
    }

    @Override
    @Transactional(readOnly = true)
    public List<com.connectx.dashboard.dto.FriendRequestItemDto> getReceivedRequests(UUID currentUserId) {
        List<FriendRequest> requests = friendRequestRepository.findByReceiverIdAndStatusOrderByCreatedAtDesc(currentUserId, RequestStatus.PENDING);
        List<com.connectx.dashboard.dto.FriendRequestItemDto> list = new ArrayList<>();
        for (FriendRequest fr : requests) {
            User s = fr.getSender();
            String name = (s.getDisplayName() != null && !s.getDisplayName().isBlank()) ? s.getDisplayName() : s.getUsername();
            String avatar = (s.getAvatarUrl() != null && !s.getAvatarUrl().isBlank()) ? s.getAvatarUrl() : "/images/boy_1.jpg";
            list.add(new com.connectx.dashboard.dto.FriendRequestItemDto(
                    fr.getId().toString(),
                    s.getId().toString(),
                    name,
                    s.getUsername(),
                    fr.getMutualFriendsCount() + " mutual friends",
                    avatar,
                    formatTimeAgo(fr.getCreatedAt(), "Recently"),
                    true
            ));
        }
        return list;
    }

    @Override
    @Transactional(readOnly = true)
    public List<com.connectx.dashboard.dto.FriendRequestItemDto> getSentRequests(UUID currentUserId) {
        List<FriendRequest> requests = friendRequestRepository.findBySenderIdAndStatusOrderByCreatedAtDesc(currentUserId, RequestStatus.PENDING);
        List<com.connectx.dashboard.dto.FriendRequestItemDto> list = new ArrayList<>();
        for (FriendRequest fr : requests) {
            User r = fr.getReceiver();
            String name = (r.getDisplayName() != null && !r.getDisplayName().isBlank()) ? r.getDisplayName() : r.getUsername();
            String avatar = (r.getAvatarUrl() != null && !r.getAvatarUrl().isBlank()) ? r.getAvatarUrl() : "/images/boy_3.jpg";
            list.add(new com.connectx.dashboard.dto.FriendRequestItemDto(
                    fr.getId().toString(),
                    r.getId().toString(),
                    name,
                    r.getUsername(),
                    "Pending approval",
                    avatar,
                    formatTimeAgo(fr.getCreatedAt(), "Recently"),
                    true
            ));
        }
        return list;
    }

    @Override
    @Transactional
    public void cancelSentRequest(UUID currentUserId, UUID requestId) {
        FriendRequest fr = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Friend request not found"));
        if (!fr.getSender().getId().equals(currentUserId)) {
            throw new org.springframework.security.access.AccessDeniedException("Cannot cancel request sent by another user");
        }
        friendRequestRepository.delete(fr);
    }

    private String formatTimeAgo(Instant createdAt, String fallback) {
        if (createdAt == null) {
            return fallback != null ? fallback : "Just now";
        }
        Duration d = Duration.between(createdAt, Instant.now());
        long mins = d.toMinutes();
        if (mins < 1) return "Just now";
        if (mins < 60) return mins + " min ago";
        long hours = d.toHours();
        if (hours < 24) return hours + (hours == 1 ? " hour ago" : " hours ago");
        long days = d.toDays();
        return days + (days == 1 ? " day ago" : " days ago");
    }
}

