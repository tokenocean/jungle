package ui.page;

import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import ui.driver.DriverSingleton;

public class BasePage {
    protected final int WAIT_TIMEOUT_SECONDS = 10;
    protected WebDriver driver;

    protected BasePage() {
        driver = DriverSingleton.getDriver();
        PageFactory.initElements(driver, this);

    }

    protected boolean waitForElementToBeNotVisible(WebElement webElement) {
        boolean isWebElementNotVisible = false;
        try {
            isWebElementNotVisible = new WebDriverWait(driver, WAIT_TIMEOUT_SECONDS).until(ExpectedConditions
                    .invisibilityOf(webElement));
        } catch (TimeoutException e) {
            isWebElementNotVisible = true;
        }
        return isWebElementNotVisible;
    }

    protected BasePage getCurrentUrl(String url) {
       try {
           String currentUrl = driver.getCurrentUrl();
           if (!currentUrl.equals(url)) {
               Assert.assertTrue(false,"Wrong site page!");
           }
       } catch (IllegalStateException e){
           e.printStackTrace();
       }
       return this;
    }

    protected WebElement waitForElementToBeClickable(WebElement webElement) {
        return new WebDriverWait(driver, WAIT_TIMEOUT_SECONDS).until(ExpectedConditions.elementToBeClickable(webElement));
    }

    protected WebElement waitForVisibilityOfElement(WebElement webElement) {
        return new WebDriverWait(driver, WAIT_TIMEOUT_SECONDS).until(ExpectedConditions
                .visibilityOf(webElement));
    }
}
