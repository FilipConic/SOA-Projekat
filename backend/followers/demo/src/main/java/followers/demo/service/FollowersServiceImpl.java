package followers.demo.service;

import followers.Followers;
import followers.FollowersServiceGrpc;
import followers.demo.interceptor.UserContext;
import followers.demo.interceptor.UserInterceptor;
import followers.demo.service.impl.UserService;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService(interceptors = {UserInterceptor.class})
public class FollowersServiceImpl extends FollowersServiceGrpc.FollowersServiceImplBase {

    private final UserService userService;

    public FollowersServiceImpl(UserService userService) {
        this.userService = userService;
    }

    @Override
    public void followUser(Followers.FollowUserRequest request, StreamObserver<Followers.FollowUserResponse> responseObserver) {
        String followerId = UserContext.USER_ID_KEY.get();
        String followedId = request.getUserId();
        userService.follow(followerId, followedId);
        responseObserver.onNext(Followers.FollowUserResponse.newBuilder().build());
        responseObserver.onCompleted();
    }

    @Override
    public void unfollowUser(Followers.UnfollowUserRequest request, StreamObserver<Followers.UnfollowUserResponse> responseObserver) {
        String followerId = UserContext.USER_ID_KEY.get();
        String followedId = request.getUserId();
        userService.unfollow(followerId, followedId);
        responseObserver.onNext(Followers.UnfollowUserResponse.newBuilder().build());
        responseObserver.onCompleted();
    }
}
