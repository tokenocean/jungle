package ui.steps;

import ui.page.AuthorizedPage;
import ui.page.HomePage;
import ui.utils.UserCreator;

public class AuthorizeUserProfileStep {

    public static AuthorizedPage AuthorizedUserProfile() {
        return new HomePage()
                 .clickSignIn()
                .authorize(UserCreator.createDefaultUser())
                .clickButtonAuthorizedUser();
    }
}
