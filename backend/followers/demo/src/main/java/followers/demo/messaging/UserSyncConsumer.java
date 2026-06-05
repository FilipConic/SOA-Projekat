package followers.demo.messaging;

import java.time.LocalDateTime;

import org.springframework.amqp.core.ExchangeTypes;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

import followers.demo.dto.UserDTO;
import followers.demo.dto.UserSyncResponseEvent;
import followers.demo.model.User;
import followers.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserSyncConsumer {

    private final UserRepository userRepository;
    private final RabbitTemplate rabbitTemplate;

    @RabbitListener(bindings = @QueueBinding(
        value    = @Queue(name = "user-sync-queue", durable = "true"),
        exchange = @Exchange(name = "user-exchange", type = ExchangeTypes.TOPIC),
        key      = "user.sync.routing"
    ))
    public void handleUserSync(UserDTO event, @Header(name = "sagaId", required = false) String sagaId) {
        log.info("Primljen event za sinhronizaciju korisnika. ID: {}, Username: {}, Avatar: {}",
                event.getId(), event.getUsername(), event.getAvatar());

        String actualSagaId = (sagaId != null && !sagaId.trim().isEmpty()) ? sagaId : "NO_SAGA_ID";

        try {
            User user = userRepository.findById(event.getId())
                    .orElseGet(() -> {
                        User newUser = new User();
                        newUser.setId(event.getId());
                        return newUser;
                    });

            if (event.getUsername() != null) {
                user.setUsername(event.getUsername());
            }
            if (event.getAvatar() != null) {
                user.setAvatar(event.getAvatar());
            }

            userRepository.save(user);
            log.info("Korisnik ID: {} uspešno sinhronizovan u Neo4j.", user.getId());

            sendResponse(actualSagaId, event.getId(), "SUCCESS", null);

        } catch (Exception e) {
            log.error("Greška prilikom sinhronizacije korisnika u Followers servisu", e);
            sendResponse(actualSagaId, event.getId(), "FAILED", e.getMessage());
        }
    }

    private void sendResponse(String sagaId, String userId, String status, String errorMessage) {
        UserSyncResponseEvent response = new UserSyncResponseEvent(
                sagaId,
                userId,
                status,
                errorMessage,
                LocalDateTime.now()
        );

        rabbitTemplate.convertAndSend("user-saga-exchange", "user.sync.reply", response);
        log.info("Poslat odgovor za Sagu [{}]. Status: {}", sagaId, status);
    }
}