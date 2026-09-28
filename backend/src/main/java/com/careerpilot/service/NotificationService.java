package com.careerpilot.service;

import com.careerpilot.domain.Notification;
import com.careerpilot.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadStatusFalse(userId);
    }

    @Transactional
    public void markAsRead(Long userId, Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            if (n.getUserId().equals(userId)) {
                n.setReadStatus(true);
                notificationRepository.save(n);
            }
        });
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> list = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        list.forEach(n -> n.setReadStatus(true));
        notificationRepository.saveAll(list);
    }

    @Transactional
    public void deleteNotification(Long userId, Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            if (n.getUserId().equals(userId)) {
                notificationRepository.delete(n);
            }
        });
    }

    @Transactional
    public Notification createNotification(Long userId, String type, String title, String message, String actionUrl) {
        Notification notification = Notification.builder()
                .userId(userId)
                .type(type)
                .title(title)
                .message(message)
                .readStatus(false)
                .actionUrl(actionUrl)
                .build();
        return notificationRepository.save(notification);
    }
}
