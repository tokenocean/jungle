package ui;

import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import ui.page.AuthorizedPage;
import ui.page.EditProfilePage;
import ui.steps.AuthorizeUserProfileStep;
import ui.utils.RandomUi;
import ui.utils.UserProfileCreator;

public class EditProfilePageTest extends BaseTest {

    @BeforeMethod
    public void openPageEditProfile() {
        AuthorizeUserProfileStep.AuthorizedUserProfile();
        new AuthorizedPage()
                .clickButtonEditProfile();
    }

    @Test
    public void testEditProfileEmptyCredentials() {
        String expectedMessageUsernameTaken = "Username taken";
        String expectLabelEditProfile = "Edit Profile";
        String expectedLabelName = "Name";
        String expectedLabelUsername = "Username";


        EditProfilePage editProfilePage = new EditProfilePage();
        editProfilePage
                .clearInputFieldUserProfile()
                .clickButtonSaveDetails();

        Assert.assertEquals(expectLabelEditProfile, editProfilePage.getlabelEditProfileText());
        Assert.assertEquals(expectedLabelName, editProfilePage.getlabelNameText());
        Assert.assertEquals(expectedLabelUsername, editProfilePage.getlabelUserNameText());
        Assert.assertEquals(expectedMessageUsernameTaken, editProfilePage.getMessageUsernameTaken());
    }

    @Test
    public void testEditProfileWithCorrectCredentials() {
        String expectedResultMessageProfileUpdated = "Profile updated";

        EditProfilePage editProfilePage = new EditProfilePage();
        editProfilePage
                .clearInputFieldUserProfile()
                .editUserProfile(UserProfileCreator.createUserProfileWithCorrectCredentials())
                .clickButtonSaveDetails();
        AuthorizedPage authorizedPage = new AuthorizedPage();

        Assert.assertEquals(expectedResultMessageProfileUpdated, authorizedPage.getMessageProfileUpdatedText());
        Assert.assertEquals(RandomUi.NAME, authorizedPage.getUserNameText(),"User NAME");
        Assert.assertEquals(RandomUi.USER_EMAIL, authorizedPage.getUserEmailText(),"User EMAIL");
        Assert.assertEquals(RandomUi.USER_TWITTER, authorizedPage.getUserTwitterText(),"User TWITTER");
        Assert.assertEquals(RandomUi.USER_INSTAGRAM, authorizedPage.getUserInstagramText(),"User INSTAGRAM");
        Assert.assertEquals(RandomUi.USER_LOCATION, authorizedPage.getUserLocationText(),"User LOCATION");
        Assert.assertEquals(RandomUi.USER_WEBSITE, authorizedPage.getUserWebsiteText(),"User WEBSITE");
        Assert.assertEquals(RandomUi.USER_BIO, authorizedPage.getUserBioText(),"User BIO");

    }


    @Test
    public void testEditProfileWithInCorrectEmail() {
        String expectedResultMessageInvalidEmail = "Invalid email";

        EditProfilePage editProfilePage = new EditProfilePage();
        editProfilePage
                .clearInputFieldUserProfile()
                .editUserProfile(UserProfileCreator.createUserProfileWithInCorrectEmail())
                .clickButtonSaveDetails();

        Assert.assertEquals(expectedResultMessageInvalidEmail, editProfilePage.getMessageInvalidEmail(),"User EMAIL");

    }
}
