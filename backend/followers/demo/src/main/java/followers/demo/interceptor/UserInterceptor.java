package followers.demo.interceptor;

import io.grpc.*;
import org.springframework.stereotype.Component;

@Component
public class UserInterceptor implements ServerInterceptor {
    @Override
    public <Q, R> ServerCall.Listener<Q> interceptCall(
            ServerCall<Q, R> call, Metadata headers, ServerCallHandler<Q, R> next) {
        String userId = headers.get(Metadata.Key.of("user_id", Metadata.ASCII_STRING_MARSHALLER));
        Context ctx = Context.current().withValue(UserContext.USER_ID_KEY, userId);
        return Contexts.interceptCall(ctx, call, headers, next);
    }
}
