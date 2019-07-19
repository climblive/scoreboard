package se.scoreboard.configuration

import com.auth0.jwk.UrlJwkProvider
import com.auth0.jwt.exceptions.JWTVerificationException
import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.interfaces.RSAKeyProvider
import com.github.kittinunf.fuel.httpGet
import java.nio.charset.Charset
import java.security.interfaces.RSAPrivateKey
import java.security.interfaces.RSAPublicKey
import com.google.gson.JsonObject
import com.google.gson.JsonParser
import java.net.URL
import java.util.*
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder.json
import com.google.gson.Gson
import org.slf4j.LoggerFactory


class JwtTest : RSAKeyProvider {
    private var logger = LoggerFactory.getLogger(JwtTest::class.java)

    var jwkProvider: UrlJwkProvider? = null
    var issuer: String? = null

    init {
        val region = "eu-west-1"
        val userPoolId = "eu-west-1_Jftnyms2n"
        val jwksUrl = "https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json"
        this.issuer = "https://cognito-idp.${region}.amazonaws.com/${userPoolId}"
        logger.debug(jwksUrl)
        jwkProvider = UrlJwkProvider(URL(jwksUrl))
        /*logger.debug(jwksUrl)
        val (request, response, result) = jwksUrl.httpGet().timeout(10000).timeoutRead(10000).responseString(Charset.forName("UTF-8"))
        val (string, error) = result
        if (string != null) {
            val parser = JsonParser()
            this.keys = parser.parse(string).asJsonObject.get("keys").asJsonArray
            logger.debug("[jwks] ${keys}")
        }
        logger.debug(jwksUrl)*/
    }

    override fun getPrivateKeyId(): String {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun getPrivateKey(): RSAPrivateKey {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun getPublicKeyById(keyId: String?): RSAPublicKey {
        logger.debug("getPublicKeyById " + keyId)
        return jwkProvider!!.get(keyId).publicKey as RSAPublicKey
    }

    fun validate(token:String) {
        try {
            val algorithm = Algorithm.RSA256(this)
            val verifier = JWT.require(algorithm)
                    .acceptExpiresAt(100000000)
                    .withIssuer(this.issuer)
                    .build() //Reusable verifier instance

            val jwt = verifier.verify(token)
            val payloadString = String(Base64.getDecoder().decode(jwt.payload))
            val gson = Gson()
            val payload = gson.fromJson(payloadString, JwtPayload::class.java)
            logger.debug(payload.toString())
        } catch (exception: JWTVerificationException) {
            //Invalid signature/claims
            throw exception
        }
    }
}

fun main(args: Array<String>) {
    val access_token="eyJraWQiOiJhOFB0NUdVVVFoYlp5ZHNjd2I1N3oweUJlK3NkSzl4bmJ6YXNpNFE4SGxNPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI5YjQ5ZTNiYS0yMDU2LTRhMGEtODgzOS1iZjU4ZDU2NjRkMzMiLCJjb2duaXRvOmdyb3VwcyI6WyJBZG1pbiJdLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0xLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMV9KZnRueW1zMm4iLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiI1NXMzcm12cDh0MjZsbWkwODk4bjlkMWxmbiIsImV2ZW50X2lkIjoiZDI2NjU3ZGQtNjM3ZS00ZTgwLWE1NGYtYTUzMzYwYTZiZWRiIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiBwaG9uZSBvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImF1dGhfdGltZSI6MTU2MTM3NTM2NiwiZXhwIjoxNTYxMzc4OTY2LCJpYXQiOjE1NjEzNzUzNjYsImp0aSI6ImE3NDM0MjI5LTAyZjUtNDQ3Ny05MDU3LWNhMTUxNDk2M2JlYSIsInVzZXJuYW1lIjoiamVzcGVyIn0.cvjbMbHb6unk021JKdWH7g_8d9G_WQ1K72bLqOFkujMHukyV83V2X0vGanEL7iBRrTHir_wntsLe-ue78GohjymDrNU7Rw4oSC-LHGFDXhE0_svyltoDerManF4zOmRJzjuKKtndZvpwBXpYkGh7zBykDCfRFGCsIuS6BCcJ5jk_uRfdlIDbjTXqRi9FXu1aV3BmzDZ7_HJjtrRaZ-SZUQQwIktbrSmqc5jobOtQphzlA4tWfuQpIqPsJcEBbka5JNx0-8etyo1o3WgnkIOFXNdECtH-vnKCgcf-cKX6q-MZ6V43Pc7D3eM-aKIRE-UlS3vAZbcGypAzjRfbp7SznQ"
    JwtTest().validate(access_token)
}
