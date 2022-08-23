package ui.page;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.List;
import java.util.stream.Collectors;

public class MarketPage extends BasePage {

    private final By NAME_NFT_MARKET = By.xpath("//h1[@class='text-xl break-all overflow-y-hidden max-h-14']");
    @FindBy(xpath = "//h2[contains(text(), 'Market')]")
    private WebElement labelMarket;

    public List<String> getNameNftMarket(String nameNft) {
        waitForVisibilityOfElement(labelMarket);
        List<WebElement> elementsNameNftMarket = driver.findElements(NAME_NFT_MARKET);
        return elementsNameNftMarket.stream().map(WebElement::getText)
                .filter(elementName -> elementName.startsWith(nameNft)).collect(Collectors.toList());

    }
}
