package se.scoreboard.configuration

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder

class MyPasswordEncoder: PasswordEncoder {

    enum class PasswordType(val prefix: String) {
        REGCODE("REGCODE:"),
        BCRYPT("BCRYPT:")
    }

    companion object {
        fun createPassword(passwordType: PasswordType, password: String): String {
            return passwordType.prefix + password
        }
    }

    private val passwordEncoder = BCryptPasswordEncoder()

    override fun encode(rawPassword: CharSequence?): String {
        return passwordEncoder.encode(rawPassword)
    }

    override fun matches(rawPassword: CharSequence?, encodedPassword: String?): Boolean {
        if (encodedPassword!!.startsWith(PasswordType.REGCODE.prefix)) {
            return encodedPassword.substring(PasswordType.REGCODE.prefix.length).equals(rawPassword)
        } else {
            return passwordEncoder.matches(rawPassword, encodedPassword.substring(PasswordType.BCRYPT.prefix.length))
        }
    }
}
