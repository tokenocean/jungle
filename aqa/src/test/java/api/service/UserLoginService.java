package api.service;

import api.model.User;
import api.pojoobject.MessageFailedLogin;
import api.pojoobject.SuccessLogInUser;
import api.specification.Specifications;
import api.utils.ConstantsApi;

import static io.restassured.RestAssured.given;

public class UserLoginService {

    public MessageFailedLogin postLoginUserWithNotCorrectData(User user) {
        Specifications.installSpecification(Specifications.requestSpecification(),
                Specifications.responseSpecification(500));
        MessageFailedLogin messageFailedLogin = new MessageFailedLogin();
        messageFailedLogin = given()
                .body(user)
                .post(ConstantsApi.postUrlLoginUser)
                .then()
                .log()
                .all()
                .extract()
                .as(MessageFailedLogin.class);
        return messageFailedLogin;
    }

    public String postLoginUserWithCorrectData(User user) {
        Specifications.installSpecification(Specifications.requestSpecification(),
                Specifications.responseSpecification(200));
        SuccessLogInUser successLogInUser = given()
                .body(user)
                .post(ConstantsApi.postUrlLoginUser)
                .then()
                .log()
                .all()
                .extract()
                .body()
                .jsonPath()
                .getObject("user", SuccessLogInUser.class);
        return successLogInUser.getEmail();

    }

}
