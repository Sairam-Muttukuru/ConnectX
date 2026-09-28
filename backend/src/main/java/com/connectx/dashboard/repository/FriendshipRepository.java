package com.connectx.dashboard.repository;

import com.connectx.dashboard.entity.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, UUID> {

    List<Friendship> findByUserId(UUID userId);

    long countByUserId(UUID userId);

    @Query("SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END FROM Friendship f WHERE f.user.id = :u1 AND f.friend.id = :u2")
    boolean existsFriendship(@Param("u1") UUID u1, @Param("u2") UUID u2);

    Optional<Friendship> findByUserIdAndFriendId(UUID userId, UUID friendId);
}
