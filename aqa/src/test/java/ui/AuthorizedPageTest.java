package ui;

import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import ui.page.AuthorizedPage;
import ui.steps.AuthorizeUserProfileStep;

public class AuthorizedPageTest extends BaseTest {

    @BeforeMethod
    public void openPageAuthorizeUserProfile() {
        AuthorizeUserProfileStep.AuthorizedUserProfile();

    }

    @Test
    public void testBitcoinQrAddressWallet() {
        AuthorizedPage authorizedPage = new AuthorizedPage();
        authorizedPage.clickButtonBitcoinAddressWallet();
        Assert.assertTrue(authorizedPage.isDisplayedButtonBitcoinAddressWallet());
        Assert.assertEquals(authorizedPage.getButtonBitcoinAddressWalletText(), authorizedPage.getQrCodeBitcoinAddressWalletText());
    }

    @Test
    public void testIsDisplayedElementsAuthorizedPage() {
        AuthorizedPage authorizedPage = new AuthorizedPage();
        Assert.assertTrue(authorizedPage.isDisplayedElementsAuthorizedHomePage());

    }

    @Test
    public void testFollowersFollowingAmount() {
        String expectedResultFollowersAmount = "Followers: 0";
        String expectedResultFollowingAmount = "Following: 0";

        AuthorizedPage authorizedPage = new AuthorizedPage();

        Assert.assertEquals(expectedResultFollowersAmount, authorizedPage.getLabelFollowersAmountText());
        Assert.assertEquals(expectedResultFollowingAmount, authorizedPage.getLabelFollowingAmountText());
    }
}
