package se.scoreboard.configuration

import com.google.gson.annotations.SerializedName

data class JwtPayload(
        val username:String,
        @SerializedName("cognito:groups")
        val cognito_groups:List<String>,
        val sub:String,
        val version:Int,
        val client_id:String,
        val event_id:String,
        val token_use:String,
        val scope:String,
        val auth_time:Long,
        val exp:Long,
        val iat:Long,
        val jti:String
        ) {


    /*{"sub":"9b49e3ba-2056-4a0a-8839-bf58d5664d33",
        "cognito:groups":["Admin"],
        "iss":"https:\/\/cognito-idp.eu-west-1.amazonaws.com\/eu-west-1_Jftnyms2n",
        "version":2,
        "client_id":"55s3rmvp8t26lmi0898n9d1lfn",
        "event_id":"d26657dd-637e-4e80-a54f-a53360a6bedb",
        "token_use"
        :"access","scope":
        "aws.cognito.signin.user.admin phone openid profile email",
        "auth_time":1561375366,
        "exp":1561378966,
        "iat":1561375366,
        "jti":"a7434229-02f5-4477-9057-ca1514963bea"
        ,"":"jesper"}
    c*/
}
