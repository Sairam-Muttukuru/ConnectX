package com.connectx.dashboard.repository;

import com.connectx.dashboard.entity.TodayEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TodayEventRepository extends JpaRepository<TodayEvent, UUID> {

    List<TodayEvent> findByUserIdOrderByCreatedAtAsc(UUID userId);
}
