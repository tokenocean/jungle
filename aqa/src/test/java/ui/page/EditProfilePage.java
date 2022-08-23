package ui.page;

import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import ui.entity.UserProfile;

public class EditProfilePage extends BasePage {

    private final CharSequence[] charSequencesDeleteAll = {Keys.chord(Keys.CONTROL, Keys.SHIFT, Keys.UP), Keys.DELETE};
    @FindBy(xpath = "//h2[contains(text(), 'Edit Profile')]")
    private WebElement labelEditProfile;
    @FindBy(xpath = "//label[@for='name']")
    private WebElement labelName;
    @FindBy(xpath = "//label[@for='username']")
    private WebElement labelUserName;
    @FindBy(xpath = "//input[@placeholder='Full Name']")
    private WebElement inputlName;
    @FindBy(xpath = "//input[@placeholder='Username']")
    private WebElement inputUsrername;
    @FindBy(xpath = "//input[@placeholder='email@example.com']")
    private WebElement inputEmail;
    @FindBy(xpath = "//input[@placeholder='@twitter']")
    private WebElement inputTwitter;
    @FindBy(xpath = "//input[@placeholder='@instagram']")
    private WebElement inputInstagram;
    @FindBy(xpath = "//input[@placeholder='Vancouver, Canada']")
    private WebElement inputLocation;
    @FindBy(xpath = "//input[@placeholder='example.com']")
    private WebElement inputWebSite;
    @FindBy(xpath = "//textarea[@class='svelte-1tnaf9k']")
    private WebElement inputBio;
    @FindBy(xpath = "//button[contains(text(), 'Save details')]")
    private WebElement buttonSaveDetails;
    @FindBy(xpath = "//div[contains(text(), 'Username taken')]")
    private WebElement messageUsernameTaken;

    @FindBy(xpath = "//*[contains(text(), 'Invalid email')]")
    private WebElement messageInvalidEmail;

    @FindBy(xpath = "//*[contains(text(), 'Profile updated')]")
    private WebElement messageProfileUpdated;

    public String getlabelEditProfileText() {
        return labelEditProfile.getText();
    }

    public String getlabelNameText() {
        return labelName.getText();
    }

    public String getlabelUserNameText() {
        return labelUserName.getText();
    }

    private EditProfilePage clearInputField(WebElement inputField) {
        inputField.sendKeys(charSequencesDeleteAll);
        return this;
    }

    public EditProfilePage clearName() {
        waitForVisibilityOfElement(buttonSaveDetails);
        clearInputField(inputlName);
        return this;
    }

    public EditProfilePage typeName(String name) {
        waitForVisibilityOfElement(buttonSaveDetails);
        inputlName.sendKeys(name);
        return this;
    }

    public EditProfilePage clearUserName() {
        clearInputField(inputUsrername);
        return this;
    }

    public EditProfilePage typeUserName(String username) {
        inputUsrername.sendKeys(username);
        return this;
    }

    public EditProfilePage clearEmail() {
        clearInputField(inputEmail);
        return this;
    }

    public EditProfilePage typeEmail(String email) {
        inputEmail.sendKeys(email);
        return this;
    }

    public EditProfilePage clearTwitter() {
        clearInputField(inputTwitter);
        return this;
    }

    public EditProfilePage typeTwitter(String twitter) {
        inputTwitter.sendKeys(twitter);
        return this;
    }

    public EditProfilePage clearInstagram() {
        clearInputField(inputInstagram);
        return this;
    }

    public EditProfilePage typeInstagram(String instagram) {
        inputInstagram.sendKeys(instagram);
        return this;
    }

    public EditProfilePage clearLocation() {
        clearInputField(inputLocation);
        return this;
    }

    public EditProfilePage typeLocation(String location) {
        inputLocation.sendKeys(location);
        return this;
    }

    public EditProfilePage clearWebSite() {
        clearInputField(inputWebSite);
        return this;
    }

    public EditProfilePage typeWebSite(String webSite) {
        inputWebSite.sendKeys(webSite);
        return this;
    }

    public EditProfilePage clearBio() {
        clearInputField(inputBio);
        return this;
    }

    public EditProfilePage typeBio(String bio) {
        inputBio.sendKeys(bio);
        return this;
    }

    public void clickButtonSaveDetails() {
        waitForElementToBeClickable(buttonSaveDetails);
        buttonSaveDetails.click();

    }

    public String getMessageUsernameTaken() {
        waitForVisibilityOfElement(messageUsernameTaken);
        return messageUsernameTaken.getText();
    }

    public String getMessageInvalidEmail() {
        waitForVisibilityOfElement(messageInvalidEmail);
        return messageInvalidEmail.getText();
    }

    public EditProfilePage editUserProfile(UserProfile userProfile) {
        typeName(userProfile.getUserName());
        typeUserName(userProfile.getUserNameEmailAccount());
        typeEmail(userProfile.getUserEmail());
        typeTwitter(userProfile.getUserTwitter());
        typeInstagram(userProfile.getUserInstagram());
        typeLocation(userProfile.getUserLocation());
        typeWebSite(userProfile.getUserWebsite());
        typeBio(userProfile.getUserBio());
        clickButtonSaveDetails();
        return new EditProfilePage();
    }

    public EditProfilePage clearInputFieldUserProfile() {
        waitForVisibilityOfElement(buttonSaveDetails);
        clearInputField(inputlName);
        clearInputField(inputUsrername);
        clearInputField(inputEmail);
        clearInputField(inputTwitter);
        clearInputField(inputInstagram);
        clearInputField(inputLocation);
        clearInputField(inputWebSite);
        clearInputField(inputBio);
        return this;
    }
}
