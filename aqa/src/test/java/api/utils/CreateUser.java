package api.utils;

import api.model.User;
import org.apache.commons.lang3.RandomStringUtils;

public class CreateUser {

    public static String setUserName() {
        String userName = RandomStringUtils.randomAlphabetic(10);
        return userName;
    }

    public static String setUserPassword() {
        String userPassword = RandomStringUtils.randomAlphanumeric(10);
        return userPassword;
    }

    public static String setNotValidEmptyUserName() {
        String userName = "";
        return userName;
    }

    public static String setNotValidEmptyPassword() {
        String userPassword = "";
        return userPassword;
    }

    public static String setUserEmail() {
        String userEmail = RandomStringUtils.randomAlphabetic(10) + "@gmail.com";
        return userEmail;
    }

    public User createNewUserNotValidNamePasswordRandomValues() {
        return new User(CreateUser.setUserName(),
                CreateUser.setUserPassword());
    }

    public User createNewUserNotValidEmptyNamePassword() {
        return new User(CreateUser.setNotValidEmptyUserName(),
                CreateUser.setNotValidEmptyPassword());
    }

    public User createNewUserNotValidEmailPasswordRandomValues() {
        return new User(CreateUser.setUserEmail(),
                CreateUser.setUserPassword());
    }

    public  static User createNewUserCorrectEmailPassword() {
        return new User(ConstantsApi.USER_EMAIL,
                ConstantsApi.PASSWORD);
    }
}
