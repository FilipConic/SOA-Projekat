package followers.demo.service;
import followers.Followers;
import followers.FollowersServiceGrpc;
import followers.demo.service.impl.UserService;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.springframework.beans.factory.annotation.Autowired;


@GrpcService
public class FollowersServiceImpl extends FollowersServiceGrpc.FollowersServiceImplBase {

    @Autowired
    private UserService userService;

    @Override
    public void followUser(Followers.FollowUserRequest request, StreamObserver<Followers.FollowUserResponse> responseObserver) {
        String followerId = request.getUser().getUserId();
        String followedId = request.getUserId();

        userService.follow(followerId, followedId);

        responseObserver.onNext(Followers.FollowUserResponse.newBuilder().build());
        responseObserver.onCompleted();
    }

    @Override
    public void unfollowUser(Followers.UnfollowUserRequest request, StreamObserver<Followers.UnfollowUserResponse> responseObserver) {
        String followerId = request.getUser().getUserId();
        String followedId = request.getUserId();

        userService.unfollow(followerId, followedId);

        responseObserver.onNext(Followers.UnfollowUserResponse.newBuilder().build());
        responseObserver.onCompleted();
    }
}