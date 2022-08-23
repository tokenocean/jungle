package ui;

import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import ui.page.AuthorizedPage;
import ui.page.HomePage;
import ui.page.LoginPage;
import ui.utils.RandomUi;
import ui.utils.UserCreator;

public class LoginPageTest extends BaseTest {

    @BeforeMethod
    public void openSignInPage() {
        new HomePage()
                .clickSignIn();
    }


    @Test
    public void testLoginWithEmptyCredentials() {
        String expectedErrorMessage = "Login failed";

        LoginPage loginPage = new LoginPage();
        loginPage.typeEmailUsername(RandomUi.generateRandomAsciiString())
                .clearEmailUsername()
                .typePassword(RandomUi.generateRandomAsciiString())
                .clearPassword()
                .clickButtonSubmit();
        Assert.assertEquals(expectedErrorMessage, loginPage.getMessageFailedUserNameOrPassword());
    }

    @Test
    public void testLoginWithEmptyPasswordCredentials() {
        String expectedErrorMessage = "Please enter your password";

        LoginPage loginPage = new LoginPage();
        loginPage.typeEmailUsername(RandomUi.generateRandomAsciiString())
                .typePassword(RandomUi.generateRandomAsciiString())
                .clearPassword()
                .clickButtonSubmit();
        Assert.assertEquals(expectedErrorMessage, loginPage.getMessageFailedUserNameOrPassword());
    }


    @Test
    public void testLoginWithEmptyUsernameEmailCredentials() {
        String expectedErrorMessage = "Please enter your Raretoshi username or email address";

                LoginPage loginPage = new LoginPage();
        loginPage.typeEmailUsername(RandomUi.generateRandomAsciiString())
                .clearEmailUsername()
                .typePassword(RandomUi.generateRandomAsciiString())
                .clickButtonSubmit();

        Assert.assertEquals(expectedErrorMessage, loginPage.getMessageFailedUserNameOrPassword());
    }

    @Test
    public void testLoginWithIncorrectCredentials() {
        String expectedErrorMessage = "Login failed";

        LoginPage loginPage = new LoginPage();
        loginPage.authorize(UserCreator.createIncorrectCredentialsUser());

        Assert.assertEquals(expectedErrorMessage, loginPage.getMessageFailedUserNameOrPassword());
    }

    @Test
    public void testLoginFormWithCorrectEmailCredentials() {
        String expectedAuthorisedUserEmail = "aliaksandr.zasinets@gmail.com";
        AuthorizedPage authorizedPage = new AuthorizedPage();

        LoginPage loginPage = new LoginPage();
        loginPage.authorize(UserCreator.createDefaultUser());
        new HomePage()
                .clickButtonAuthorizedUser();

        Assert.assertEquals(expectedAuthorisedUserEmail, authorizedPage.getAccountMenuEmailText());
    }
}
