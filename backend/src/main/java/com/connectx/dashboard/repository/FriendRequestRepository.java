package com.connectx.dashboard.repository;

import com.connectx.dashboard.entity.FriendRequest;
import com.connectx.dashboard.entity.FriendRequest.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, UUID> {

    List<FriendRequest> findByReceiverIdAndStatusOrderByCreatedAtDesc(UUID receiverId, RequestStatus status);

    List<FriendRequest> findBySenderIdAndStatusOrderByCreatedAtDesc(UUID senderId, RequestStatus status);

    long countByReceiverIdAndStatus(UUID receiverId, RequestStatus status);

    Optional<FriendRequest> findBySenderIdAndReceiverIdAndStatus(UUID senderId, UUID receiverId, RequestStatus status);

    @Query("SELECT fr FROM FriendRequest fr WHERE (fr.sender.id = :u1 AND fr.receiver.id = :u2) OR (fr.sender.id = :u2 AND fr.receiver.id = :u1)")
    List<FriendRequest> findExistingBetween(@Param("u1") UUID u1, @Param("u2") UUID u2);
}
