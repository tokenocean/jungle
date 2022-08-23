package ui;

import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import ui.driver.DriverSingleton;
import ui.page.HomePage;

public class BaseTest {

    @BeforeMethod
    public void openHomePageTest() {
        new HomePage().openPage();
    }

    @AfterMethod (alwaysRun = true)
    public void finishTest() {
        DriverSingleton.closeDriver();
    }

}
