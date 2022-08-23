package ui.page;

import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import ui.entity.User;

import static ui.utils.ConstantsUi.LOGIN_URL;

public class LoginPage extends BasePage {

    private final CharSequence[] charSequencesDeleteAll = {Keys.chord(Keys.SHIFT, Keys.HOME), Keys.DELETE};

    @FindBy(xpath = "//label[text()='Email or username']")
    private WebElement labelEmailUsername;

    @FindBy(xpath = "//label[text()='Password']")
    private WebElement labelPassword;

    @FindBy(xpath = "//input[@data-cy='user']")
    private WebElement inputUsername;

    @FindBy(xpath = "//input[@data-cy='password']")
    private WebElement inputPassword;

    @FindBy(xpath = "//button[@type='submit']")
    private WebElement buttonSubmit;

    @FindBy(xpath = "//div[@class='flex-grow mr-2']")
    private WebElement messageFailedLogin;


    public LoginPage typeEmailUsername(String username) {
        waitForElementToBeClickable(inputUsername);
        inputUsername.sendKeys(username);
        return this;
    }

    public LoginPage typePassword(String password) {
        waitForElementToBeClickable(inputPassword);
        inputPassword.sendKeys(password);
        return this;
    }

    public void clickButtonSubmit() {
        getCurrentUrl(LOGIN_URL);
        waitForElementToBeClickable(buttonSubmit);
        buttonSubmit.click();
    }

    public LoginPage clearEmailUsername() {
        clearInputField(inputUsername);
        return this;
    }

    public LoginPage clearPassword() {
        clearInputField(inputPassword);
        return this;
    }

    private LoginPage clearInputField(WebElement inputField) {
        inputField.sendKeys(charSequencesDeleteAll);
        return this;
    }

    public String getMessageFailedUserNameOrPassword() {
        waitForVisibilityOfElement(messageFailedLogin);
        return messageFailedLogin.getText();
    }

    public HomePage authorize(User user) {
        waitForElementToBeClickable(inputUsername);
        inputUsername.sendKeys(user.getUsernameEmail());
        inputPassword.sendKeys(user.getPassword());
        buttonSubmit.click();
        return new HomePage();
    }
}
