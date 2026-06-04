package purchase.interceptor;

import io.grpc.*;
import net.devh.boot.grpc.server.interceptor.GrpcGlobalServerInterceptor;
import org.springframework.stereotype.Component;

@Component
@GrpcGlobalServerInterceptor
public class UserInterceptor implements ServerInterceptor {
    private static final Metadata.Key<String> USER_ID_METADATA =
            Metadata.Key.of("user_id", Metadata.ASCII_STRING_MARSHALLER);

    @Override
    public <ReqT, RespT> ServerCall.Listener<ReqT> interceptCall(
            ServerCall<ReqT, RespT> call,
            Metadata headers,
            ServerCallHandler<ReqT, RespT> next) {

        String userId = headers.get(USER_ID_METADATA);
        Context ctx = Context.current().withValue(UserContext.USER_ID_KEY, userId);
        return Contexts.interceptCall(ctx, call, headers, next);
    }
}
