package ui;

import org.testng.annotations.Test;
import ui.page.HomePage;
import ui.page.MarketPage;
import ui.page.NftPage;
import ui.utils.RandomUi;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertNotEquals;

public class NftSearchResultTest extends BaseTest {


    @Test
    public void testSearchWithEmptyQuery() {

        String expectedMessageSearchNothingMatched = "Nothing matched that search string";
        HomePage homePage = new HomePage();

        homePage
                .typeSearchQuery(RandomUi.generateRandomAsciiString())
                .clearSearchField()
                .clickButtonSearch();

        assertEquals(expectedMessageSearchNothingMatched, homePage.getMessageSearchNothingMatched());

    }

    @Test
    public void testSearchWithIncorrectQuery() {

        String expectedMessageSearchNothingMatched = "Nothing matched that search string";
        HomePage homePage = new HomePage();

        homePage
                .typeSearchQuery(RandomUi.generateRandomAsciiString())
                .clickButtonSearch();

        assertEquals(expectedMessageSearchNothingMatched, homePage.getMessageSearchNothingMatched());

    }

    @Test
    public void testSearchWithResultNameMatchedQuery() {

        String inputUserCorrectSearchQuery = "[THE BOT‘s CAT]";
        HomePage homePage = new HomePage();

        homePage
                .clearSearchField()
                .typeSearchQuery(inputUserCorrectSearchQuery)
                .clickButtonSearch();

        NftPage nftPage = new NftPage();

        assertEquals(homePage.getUserInputSearchQuery(), nftPage.getUserNameNft(),"Exact search match with NFT name");

    }

    @Test
    public void testSearchWithResultPartPresentNameNft() {

        String inputUserCorrectPartSearchQueryIsPresentNft = "CAT";
        int resultPartSearchQueryIsPresentNft;

        new HomePage()
                .clearSearchField()
                .typeSearchQuery(inputUserCorrectPartSearchQueryIsPresentNft)
                .clickButtonSearch();

        MarketPage marketPage = new MarketPage();
        resultPartSearchQueryIsPresentNft = marketPage.getNameNftMarket(inputUserCorrectPartSearchQueryIsPresentNft).size();

        System.out.println("Amount of NFT " + resultPartSearchQueryIsPresentNft);
        assertNotEquals(resultPartSearchQueryIsPresentNft, 0,
                "Amount of NFT matches by searching for part of the real NFT name");

    }

    @Test
    public void testSearchWithResultHashTagPartPresentNameNft() {

        String inputUserCorrectPartSearchQueryIsPresentNft = "#CAT";
        int resultPartSearchQueryIsPresentNft;

        new HomePage()
                .clearSearchField()
                .typeSearchQuery(inputUserCorrectPartSearchQueryIsPresentNft)
                .clickButtonSearch();

        MarketPage marketPage = new MarketPage();
        resultPartSearchQueryIsPresentNft = marketPage.getNameNftMarket(inputUserCorrectPartSearchQueryIsPresentNft).size();

        System.out.println("Amount of NFT " + resultPartSearchQueryIsPresentNft);
        assertNotEquals(resultPartSearchQueryIsPresentNft, 0,
                "Amount of NFT matches by searching for the hashtag of part of the name of the real NFT");

    }
}
