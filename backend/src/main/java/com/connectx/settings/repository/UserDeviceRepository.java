package com.connectx.settings.repository;

import com.connectx.settings.entity.UserDevice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserDeviceRepository extends JpaRepository<UserDevice, UUID> {

    List<UserDevice> findAllByUserIdAndActiveTrueOrderByLastActiveDesc(UUID userId);

    Optional<UserDevice> findByUserIdAndDeviceName(UUID userId, String deviceName);

    @Modifying
    @Query("UPDATE UserDevice d SET d.active = false, d.currentSession = false WHERE d.id = :id AND d.userId = :userId")
    void deactivateByIdAndUserId(@Param("id") UUID id, @Param("userId") UUID userId);

    @Modifying
    @Query("UPDATE UserDevice d SET d.active = false, d.currentSession = false WHERE d.userId = :userId AND d.id <> :currentId")
    void deactivateOtherDevices(@Param("userId") UUID userId, @Param("currentId") UUID currentId);

    @Modifying
    @Query("UPDATE UserDevice d SET d.currentSession = false WHERE d.userId = :userId")
    void resetCurrentSessionForUser(@Param("userId") UUID userId);

    void deleteAllByUserId(UUID userId);
}
