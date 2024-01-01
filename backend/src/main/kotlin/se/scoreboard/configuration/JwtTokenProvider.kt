package se.scoreboard.configuration

import com.auth0.jwk.JwkProvider
import com.auth0.jwk.JwkProviderBuilder
import com.auth0.jwt.JWT
import com.auth0.jwt.JWTVerifier
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.exceptions.JWTVerificationException
import com.auth0.jwt.interfaces.RSAKeyProvider
import com.google.gson.Gson
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Component
import se.scoreboard.SlackNotifier
import se.scoreboard.data.domain.Organizer
import se.scoreboard.data.domain.User
import se.scoreboard.data.repo.ContenderRepository
import se.scoreboard.data.repo.OrganizerRepository
import se.scoreboard.data.repo.UserRepository
import java.net.URL
import java.security.interfaces.RSAPrivateKey
import java.security.interfaces.RSAPublicKey
import java.util.*
import java.util.concurrent.TimeUnit
import jakarta.servlet.http.HttpServletRequest
import javax.transaction.Transactional


@Component
    class JwtTokenProvider @Autowired constructor(
        @Value("\${amazon.cognito.region}")
        private var region: String,
        @Value("\${amazon.cognito.user-pool-id}")
        private var userPoolId: String,
        private val userRepository: UserRepository,
        private val organizerRepository: OrganizerRepository,
        private val contenderRepository: ContenderRepository,
        private val slackNotifier: SlackNotifier) : RSAKeyProvider {

    enum class AuthMethod {
        BEARER,
        REGCODE
    }

    data class Authorization(val method: AuthMethod, val data: String)

    private var jwkProvider: JwkProvider
    private var issuer: String
    private var verifier: JWTVerifier

    @Autowired
    private val userDetailsService: UserDetailsService? = null

    init {
        val jwksUrl = "https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json"
        this.issuer = "https://cognito-idp.${region}.amazonaws.com/${userPoolId}"

        jwkProvider = JwkProviderBuilder(URL(jwksUrl))
            .cached(10, 24, TimeUnit.HOURS)
            .rateLimited(false)
            .build();

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

    fun getUserAuthentication(token: String): Authentication {
        val username: String = getUsername(token)

        val userDetails = try {
            this.userDetailsService!!.loadUserByUsername(username)
        } catch (e: UsernameNotFoundException) {
            createUser(username)
        }

        return UsernamePasswordAuthenticationToken(userDetails, "", userDetails.authorities)
    }

    fun getContenderAuthentication(regcode: String): Authentication? {
        val contender = contenderRepository.findByRegistrationCode(regcode)

        return if (contender != null) {
            val principal = MyUserPrincipal(contender)
            return UsernamePasswordAuthenticationToken(principal, "", principal.authorities)
        } else null
    }

    fun getUsername(token: String): String {
        val payloadString = String(Base64.getDecoder().decode(verifier.verify(token).payload))
        val payload = Gson().fromJson(payloadString, JwtPayload::class.java)
        return payload.username
    }

    fun resolveAuthorization(req: HttpServletRequest): Authorization? {
        val header = req.getHeader("Authorization")

        if (header != null) {
            if (header.startsWith("Bearer ")) {
                return Authorization(AuthMethod.BEARER, header.substring(7, header.length))
            } else if (header.startsWith("Regcode ")) {
                return Authorization(AuthMethod.REGCODE, header.substring(8, header.length))
            } else {
                return null
            }
        }

        return null
    }

    fun validateToken(token: String): Boolean {
        try {
            verifier.verify(token)
            return true
        } catch (e: JWTVerificationException) {
            return false
        }
    }

    @Transactional
    private fun createUser(username: String) : UserDetails {
        var user = User(null, username.replaceFirstChar(Char::titlecase), username, false)
        var organizer = Organizer(null, "My Organizer", null)
        user.organizers.add(organizer)

        organizer = organizerRepository.save(organizer)
        user = userRepository.save(user)
        slackNotifier.newUser(user)

        return MyUserPrincipal(user, "ROLE_ORGANIZER", listOf(organizer?.id!!))
    }
}
