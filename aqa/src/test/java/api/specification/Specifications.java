package api.specification;


import api.utils.ConstantsApi;
import api.utils.Token;
import io.restassured.RestAssured;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.builder.ResponseSpecBuilder;
import io.restassured.specification.RequestSpecification;
import io.restassured.specification.ResponseSpecification;

import static io.restassured.http.ContentType.JSON;
import static java.util.concurrent.TimeUnit.SECONDS;
import static org.hamcrest.Matchers.lessThanOrEqualTo;

public class Specifications extends Token {

    public static RequestSpecification requestSpecification() {
        return new RequestSpecBuilder()
                .setBaseUri(ConstantsApi.BASE_URL)
                .setContentType(JSON)
                .setAccept(JSON)
                .build();
    }

    public static RequestSpecification requestSpecificationAuthUser() {
        return new RequestSpecBuilder()
                .setBaseUri(ConstantsApi.BASE_URL)
                .addHeader("Authorization", "Bearer "+Token.getToken())
                .setContentType(JSON)
                .setAccept(JSON)
                .build();
    }

    public static ResponseSpecification responseSpecification(int statusCode) {
        return new ResponseSpecBuilder()
                .expectContentType(JSON)
                .expectStatusCode(statusCode)
                .expectResponseTime(lessThanOrEqualTo(3L), SECONDS)
                .build();
    }

    public static void installSpecification(RequestSpecification request, ResponseSpecification response) {
        RestAssured.requestSpecification = request;
        RestAssured.responseSpecification = response;
    }

}
