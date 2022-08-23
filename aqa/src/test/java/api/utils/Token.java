package api.utils;

import api.model.User;
import api.pojoobject.Root;
import api.specification.Specifications;
import static io.restassured.RestAssured.given;

public class Token extends CreateUser {


   protected static String getToken(){
        Specifications.installSpecification(Specifications.requestSpecification(),
                Specifications.responseSpecification(200));
        User user = createNewUserCorrectEmailPassword();
        Root root = given()
                .body(user)
                .post(ConstantsApi.postUrlLoginUser)
                .then()
                .log()
                .all()
                .extract()
                .body()
                .as(Root.class);
        return root.getJwt_token();
    }
}
