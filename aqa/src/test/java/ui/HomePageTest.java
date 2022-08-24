package ui;

import org.testng.Assert;
import org.testng.annotations.Test;
import ui.page.HomePage;

public class HomePageTest extends BaseTest {


    @Test
    public void testIsDisplayedButtonHomePage() {
        HomePage homePage = new HomePage();

        homePage.scrollPageDown();

        Assert.assertTrue(homePage.isDisplayedImageLogo());
        Assert.assertTrue(homePage.isDisplayedButtonStartExploring());
        Assert.assertTrue(homePage.isDisplayedButtonSignIn());
        Assert.assertTrue(homePage.isDisplayedButtonMarket());
        Assert.assertTrue(homePage.isDisplayedButtonActivity());
        Assert.assertTrue(homePage.isDisplayedButtonBlog());
        Assert.assertTrue(homePage.isDisplayedButtonHelp());
        Assert.assertTrue(homePage.isDisplayedButtonViewArtwork());
        Assert.assertTrue(homePage.isDisplayedButtonViewGallery());
        Assert.assertTrue(homePage.isDisplayedButtonViewMore());

    }

    @Test
    public void testIsDisplayedImageNameCardArtwork() {
        HomePage homePage = new HomePage();

        Assert.assertTrue(homePage.isDisplayedImageCardArtwork());
        Assert.assertTrue(homePage.isDisplayedNameCardArtworkRecentActivity());
        Assert.assertTrue(homePage.isDisplayedNameCardArtworkLatestPieces());

    }

    @Test
    public void testTextLabelHomePage() {
        String expectedResultNameLogo = "Raretoshi" + "\n" + "digital art";
        String expectedResultDescriptionLogo = "Upload, collect, and transact rare digital art on the Liquid Network";
        String expectedResultNameInputPlaceholder = "Search...";
        String expectedResultLabelRecentActivity = "Recent Activity";
        String expectedResultLabelLatestPieces = "Latest Pieces";

        HomePage homePage = new HomePage();

        Assert.assertEquals(expectedResultNameLogo, homePage.getNameLogo());
        Assert.assertEquals(expectedResultDescriptionLogo, homePage.getDescriptionLogo());
        Assert.assertEquals(expectedResultNameInputPlaceholder, homePage.getTextInputSearchPlaceholder());
        Assert.assertEquals(expectedResultLabelRecentActivity, homePage.getTextLabelRecentActivity());
        Assert.assertEquals(expectedResultLabelLatestPieces, homePage.getTexLabelLatestPieces());

    }
}
