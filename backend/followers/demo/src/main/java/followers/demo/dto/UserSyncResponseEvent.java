package followers.demo.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSyncResponseEvent {
    private String sagaId;        
    
    private String userId;        
    
    private String status;        
    
    private String reason;        
    
    private LocalDateTime timestamp;
}
