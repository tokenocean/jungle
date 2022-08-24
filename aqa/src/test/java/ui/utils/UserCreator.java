package ui.utils;

import ui.entity.User;

public class UserCreator {

    public static final String USER_NAME_EMAIL = "aliaksandr.zasinets@gmail.com";
    public static final String PASSWORD = "q2v^F9t5!mLj7x6Zo7";

    public static User createDefaultUser() {
        return new User(USER_NAME_EMAIL, PASSWORD);
    }

    public static User createIncorrectCredentialsUser() {
        return new User(RandomUi.generateRandomAsciiString(), RandomUi.generateRandomAsciiString());
    }
}
