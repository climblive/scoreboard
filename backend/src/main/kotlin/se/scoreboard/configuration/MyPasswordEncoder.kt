package se.scoreboard.configuration

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import java.lang.IllegalArgumentException

class MyPasswordEncoder: PasswordEncoder {

    companion object {
        const val REGCODE = "REGCODE:"
        const val BCRYPT = "BCRYPT:"

        fun createPassword(passwordType: String, password: String): String {
            return passwordType + password
        }
    }

    private val passwordEncoder = BCryptPasswordEncoder()

    override fun encode(rawPassword: CharSequence?): String {
        println("MyPasswordEncoder.encode" + rawPassword)
        return passwordEncoder.encode(rawPassword)
    }

    override fun matches(rawPassword: CharSequence?, encodedPassword: String?): Boolean {
        println("MyPasswordEncoder.matches " + rawPassword + " " + encodedPassword)
        if(encodedPassword!!.startsWith(REGCODE)) {
            return encodedPassword.substring(REGCODE.length).equals(rawPassword)
        } else if(encodedPassword.startsWith(BCRYPT)) {
            println("MyPasswordEncoder bcrypt [" + encodedPassword.substring(BCRYPT.length) + "]")
            return passwordEncoder.matches(rawPassword, encodedPassword.substring(BCRYPT.length))
        } else {
            throw IllegalArgumentException("Illegal password " + encodedPassword)
        }
    }
}