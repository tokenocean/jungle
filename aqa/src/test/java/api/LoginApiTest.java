package api;

import api.model.User;
import api.pojoobject.MessageFailedLogin;
import api.service.UserLoginService;
import api.utils.ConstantsApi;
import api.utils.CreateUser;
import org.testng.Assert;
import org.testng.annotations.Test;

public class LoginApiTest extends CreateUser {

    @Test
    public void testLoginUserEmptyNamePassword() {
        String expectedErrorMessage = "Login failed";
        User user = createNewUserNotValidEmptyNamePassword();
        MessageFailedLogin messageFailedLogin = new UserLoginService().postLoginUserWithNotCorrectData(user);
        Assert.assertEquals(expectedErrorMessage, messageFailedLogin.getMessage());

    }

    @Test
    public void testLoginUserNotValidNamePasswordRandomValues() {
        String expectedErrorMessage = "Login failed";
        User user = createNewUserNotValidNamePasswordRandomValues();
        MessageFailedLogin messageFailedLogin = new UserLoginService().postLoginUserWithNotCorrectData(user);
        Assert.assertEquals(expectedErrorMessage, messageFailedLogin.getMessage());

    }

    @Test
    public void testLoginUserNotValidEmailPasswordRandomValues() {
        String expectedErrorMessage = "Login failed";
        User user = createNewUserNotValidEmailPasswordRandomValues();
        MessageFailedLogin messageFailedLogin = new UserLoginService().postLoginUserWithNotCorrectData(user);
        Assert.assertEquals(expectedErrorMessage, messageFailedLogin.getMessage());

    }

    @Test
    public void testLoginUserUserCorrectEmailPassword() {
        UserLoginService userLoginService = new UserLoginService();
        String expectedEmailUserLogin = ConstantsApi.USER_EMAIL;
        User user = createNewUserCorrectEmailPassword();
        String resultAuthUserEmail = userLoginService.postLoginUserWithCorrectData(user);
        Assert.assertEquals(expectedEmailUserLogin, resultAuthUserEmail);

    }
}
