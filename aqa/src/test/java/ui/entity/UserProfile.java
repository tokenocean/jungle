package ui.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class UserProfile {
    private final String userName;
    private final String userNameEmailAccount;
    private final String userInstagram;
    private final String userTwitter;
    private final String userEmail;
    private final String userWebsite;
    private final String userLocation;
    private final String userBio;

}
