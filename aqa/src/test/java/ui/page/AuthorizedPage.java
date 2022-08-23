package ui.page;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.ArrayList;
import java.util.List;

import static ui.utils.ConstantsUi.PROFILE_USER_URL;

public class AuthorizedPage extends BasePage {
    @FindBy(xpath = "//div[@class='text-gray-600']")
    private WebElement userNameEmailAccount;

    @FindBy(xpath = "//div[@class='ml-12']//h3")
    private WebElement userName;

    @FindBy(xpath = "//a[@class='svelte-hptj25'][1]")
    private WebElement userInstagram;

    @FindBy(xpath = "//a[@class='svelte-hptj25'][2]")
    private WebElement userTwitter;

    @FindBy(xpath = "//a[@class='svelte-hptj25'][3]")
    private WebElement userEmail;

    @FindBy(xpath = "//span[@class='svelte-hptj25']//following::span[3]")
    private WebElement userWebsite;

    @FindBy(xpath = "//span[@class='svelte-hptj25']//following::span[4]")
    private WebElement userLocation;

    @FindBy(xpath = "//p[@class='my-4']")
    private WebElement userBio;

    @FindBy(xpath = "//a[text()='Edit Profile']")
    private WebElement buttonEditProfile;

    @FindBy(xpath = "//span[text()='Become an Artist']")
    private WebElement buttonBecameArtist;

    @FindBy(xpath = "//span[text()='Wallet']")
    private WebElement buttonWallet;

    @FindBy(xpath = "//div[@class='truncate']")
    private WebElement buttonBitcoinAdressWallet;

    @FindBy(xpath = "//img[@alt='QR Code']/../div")
    private WebElement qrCodeBitcoinAdressWallet;

    @FindBy(xpath = "//span[text()='Messages']")
    private WebElement buttonMessage;

    @FindBy(xpath = "//span[text()='Settings']")
    private WebElement buttonSettings;

    @FindBy(xpath = "//span[text()='Sign Out']")
    private WebElement buttonSignOut;

    @FindBy(xpath = "//div[text()='Collection']")
    private WebElement buttonCollection;

    @FindBy(xpath = "//div[text()='Offers']")
    private WebElement buttonOffers;

    @FindBy(xpath = "//div[text()='Favorites']")
    private WebElement buttonFavorites;

    @FindBy(xpath = "//div[contains(text(), 'Followers: ')]")
    private WebElement labelFollowersAmount;

    @FindBy(xpath = "//div[contains(text(), 'Following: ')]")
    private WebElement labelFollowingAmount;

    @FindBy(xpath = "//*[contains(text(), 'Profile updated')]")
    private WebElement messageProfileUpdated;


    public String getUserNameEmailAccountText() {
        waitForVisibilityOfElement(userNameEmailAccount);
        return userNameEmailAccount.getText().replaceAll("@", "");
    }

    public String getAccountMenuEmailText() {
        waitForVisibilityOfElement(userNameEmailAccount);
        return userNameEmailAccount.getText();
    }

    public boolean isDisplayedElementsAuthorizedHomePage() {
        waitForVisibilityOfElement(buttonEditProfile);
        List<WebElement> elementsAuthorizedHomePage = new ArrayList<WebElement>();
        elementsAuthorizedHomePage.add(buttonEditProfile);
        elementsAuthorizedHomePage.add(buttonBecameArtist);
        elementsAuthorizedHomePage.add(buttonWallet);
        elementsAuthorizedHomePage.add(buttonMessage);
        elementsAuthorizedHomePage.add(buttonSettings);
        elementsAuthorizedHomePage.add(buttonSignOut);
        elementsAuthorizedHomePage.add(buttonCollection);
        elementsAuthorizedHomePage.add(buttonOffers);
        elementsAuthorizedHomePage.add(labelFollowersAmount);
        elementsAuthorizedHomePage.add(labelFollowingAmount);
        for (WebElement elements : elementsAuthorizedHomePage) {
            if (!elements.isDisplayed()) {
                System.out.println(elements.getLocation());
            }
        }
        return true;
    }

    public String getLabelFollowersAmountText() {
        waitForVisibilityOfElement(labelFollowersAmount);
        return labelFollowersAmount.getText();
    }

    public String getLabelFollowingAmountText() {
        waitForVisibilityOfElement(labelFollowingAmount);
        return labelFollowingAmount.getText();
    }

    public void clickButtonEditProfile() {
        waitForVisibilityOfElement(buttonEditProfile);
        buttonEditProfile.click();
    }

    public boolean isDisplayedButtonBitcoinAddressWallet() {
        waitForVisibilityOfElement(buttonBitcoinAdressWallet);
        return buttonBitcoinAdressWallet.isDisplayed();
    }


    public String getButtonBitcoinAddressWalletText() {
        waitForVisibilityOfElement(buttonBitcoinAdressWallet);
        return buttonBitcoinAdressWallet.getText();
    }

    public void clickButtonBitcoinAddressWallet() {
        waitForElementToBeClickable(buttonBitcoinAdressWallet);
        buttonBitcoinAdressWallet.click();
    }


    public String getQrCodeBitcoinAddressWalletText() {
        waitForVisibilityOfElement(qrCodeBitcoinAdressWallet);
        return qrCodeBitcoinAdressWallet.getText();
    }


    public String getUserNameText() {
        waitForVisibilityOfElement(userNameEmailAccount);
        return userName.getText();
    }

    public String getUserInstagramText() {
        waitForVisibilityOfElement(userNameEmailAccount);
        return userInstagram.getText().replaceAll("@", "");
    }

    public String getUserTwitterText() {
        waitForVisibilityOfElement(userNameEmailAccount);
        return userTwitter.getText().replaceAll("@", "");
    }

    public String getUserEmailText() {
        return userEmail.getText();
    }

    public String getUserWebsiteText() {
        waitForVisibilityOfElement(userNameEmailAccount);
        return userWebsite.getText();
    }

    public String getUserLocationText() {
        waitForVisibilityOfElement(userNameEmailAccount);
        return userLocation.getText();
    }

    public String getUserBioText() {
        waitForVisibilityOfElement(userNameEmailAccount);
        return userBio.getText();
    }

    public String getMessageProfileUpdatedText() {
        waitForVisibilityOfElement(messageProfileUpdated);
        getCurrentUrl(PROFILE_USER_URL);
        return messageProfileUpdated.getText();
    }
}
