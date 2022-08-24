package api.utils;

import org.apache.commons.lang3.RandomStringUtils;

class RandomApi {
    public static final String NAME = RandomStringUtils.randomAlphabetic(2, 10);
    public static final String USER_NAME = RandomStringUtils.randomAlphabetic(2, 10);
    public static final String USER_INSTAGRAM = RandomStringUtils.randomAlphabetic(2, 10);
    public static final String USER_TWITTER = RandomStringUtils.randomAlphabetic(2, 10);
    public static final String USER_WEBSITE = RandomStringUtils.randomAlphabetic(2, 10);
    public static final String USER_LOCATION = RandomStringUtils.randomAlphabetic(2, 10);
    public static final String USER_BIO = RandomStringUtils.randomAlphabetic(10, 100);
    public static final String USER_EMAIL = RandomStringUtils.randomAlphabetic(10) + "@gmail.com";
    public static final String USER_INCORRECT_EMAIL = RandomStringUtils.randomAscii(15);
}
