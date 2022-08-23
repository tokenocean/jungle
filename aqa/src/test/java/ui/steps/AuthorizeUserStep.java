package ui.steps;

import ui.entity.User;
import ui.page.HomePage;

public class AuthorizeUserStep {

    public static HomePage SignIn(User user) {
        return new HomePage()
                .clickSignIn()
                .authorize(user);
    }
}
