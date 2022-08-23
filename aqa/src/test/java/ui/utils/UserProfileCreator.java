package ui.utils;

import ui.entity.UserProfile;

public class UserProfileCreator {

    public static UserProfile createUserProfileWithCorrectCredentials() {
        return new UserProfile(
                RandomUi.NAME,
                RandomUi.USER_NAME,
                RandomUi.USER_INSTAGRAM,
                RandomUi.USER_TWITTER,
                RandomUi.USER_EMAIL,
                RandomUi.USER_WEBSITE,
                RandomUi.USER_LOCATION,
                RandomUi.USER_BIO);
    }

    public static UserProfile createUserProfileWithInCorrectEmail() {
        return new UserProfile(
                RandomUi.NAME,
                RandomUi.USER_NAME,
                RandomUi.USER_INSTAGRAM,
                RandomUi.USER_TWITTER,
                RandomUi.USER_INCORRECT_EMAIL,
                RandomUi.USER_WEBSITE,
                RandomUi.USER_LOCATION,
                RandomUi.USER_BIO);
    }
}
