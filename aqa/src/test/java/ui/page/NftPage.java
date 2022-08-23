package ui.page;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class NftPage extends BasePage {

    @FindBy(xpath = "//h1[@class='text-3xl font-black primary-color']")
    private WebElement nameNft;

    public String getUserNameNft() {
        waitForVisibilityOfElement(nameNft);
        return nameNft.getText();
    }

}
