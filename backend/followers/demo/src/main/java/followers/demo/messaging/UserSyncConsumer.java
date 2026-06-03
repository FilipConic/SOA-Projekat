package followers.demo.messaging;

import followers.demo.dto.UserDTO;
import followers.demo.model.User;
import followers.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserSyncConsumer {

    private final UserRepository userRepository;

    @RabbitListener(queues = "user-sync-queue")
    public void handleUserSync(UserDTO event) {
        log.info("Primljen event za sinhronizaciju korisnika: {}", event.getUsername());
        try {
            User user = userRepository.findById(event.getId())
                    .orElse(new User());

            user.setId(event.getId());
            user.setUsername(event.getUsername());
            user.setAvatar(event.getAvatar());

            userRepository.save(user);
            log.info("Korisnik {} uspešno sinhronizovan u Neo4j.", user.getUsername());
        } catch (Exception e) {
            log.error("Greška prilikom sinhronizacije korisnika u Followers servisu", e);
            throw e;
        }
    }
}