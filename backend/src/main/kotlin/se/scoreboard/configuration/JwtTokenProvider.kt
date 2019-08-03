package se.scoreboard.configuration

import com.auth0.jwk.UrlJwkProvider
import com.auth0.jwt.JWT
import com.auth0.jwt.JWTVerifier
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.exceptions.JWTVerificationException
import com.auth0.jwt.interfaces.RSAKeyProvider
import com.google.gson.Gson
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.stereotype.Component
import java.net.URL
import java.security.interfaces.RSAPrivateKey
import java.security.interfaces.RSAPublicKey
import java.util.*
import javax.servlet.http.HttpServletRequest


@Component
class JwtTokenProvider @Autowired constructor(
        @Value("\${amazon.cognito.region}")
        private var region: String,
        @Value("\${amazon.cognito.user-pool-id}")
        private var userPoolId: String) : RSAKeyProvider {
    private var logger = LoggerFactory.getLogger(JwtTokenProvider::class.java)

    companion object {
        private var REGISTRATION_CODE_LENGTH = 8
    }

    private lateinit var jwkProvider: UrlJwkProvider
    private lateinit var issuer: String
    private lateinit var verifier: JWTVerifier

    @Autowired
    private val userDetailsService: UserDetailsService? = null

    init {
        val jwksUrl = "https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json"
        this.issuer = "https://cognito-idp.${region}.amazonaws.com/${userPoolId}"
        jwkProvider = UrlJwkProvider(URL(jwksUrl))

        val algorithm = Algorithm.RSA256(this)
        verifier = JWT.require(algorithm)
                .acceptExpiresAt(100000000)
                .withIssuer(this.issuer)
                .build()
    }

    override fun getPrivateKeyId(): String = TODO()

    override fun getPrivateKey(): RSAPrivateKey = TODO()

    override fun getPublicKeyById(keyId: String?): RSAPublicKey {
        return jwkProvider.get(keyId).publicKey as RSAPublicKey
    }

    fun getAuthentication(token: String): Authentication {
        val userDetails = this.userDetailsService!!.loadUserByUsername(getUsername(token))
        return UsernamePasswordAuthenticationToken(userDetails, "", userDetails.authorities)
    }

    fun getUsername(token: String): String {
        if (isRegistrationCode(token)) {
            return token
        }

        val gson = Gson()

        val payloadString = String(Base64.getDecoder().decode(verifier.verify(token).payload))
        val payload = gson.fromJson(payloadString, JwtPayload::class.java)
        return payload.username
    }

    fun resolveToken(req: HttpServletRequest): String? {
        val bearerToken = req.getHeader("Authorization")
        return if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            bearerToken.substring(7, bearerToken.length)
        } else null
    }

    fun validateToken(token: String): Boolean {
        if (isRegistrationCode(token)) {
            return true
        }

        try {
            verifier.verify(token)
            return true
        } catch (e: JWTVerificationException) {
            return false
        }
    }

    fun isRegistrationCode(token: String) = token.length == REGISTRATION_CODE_LENGTH
}