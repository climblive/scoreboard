package se.scoreboard.configuration

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder


@Configuration
@EnableWebSecurity
class WebSecurityConfig : WebSecurityConfigurerAdapter() {

    @Autowired
    private var userDetailsService: UserDetailsService? = null

    @Throws(Exception::class)
    override fun configure(http: HttpSecurity) {
        http
            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeRequests()
            .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            .antMatchers("/api/user/login").permitAll()
            .antMatchers("/api-docs").permitAll()
            .antMatchers("/resource/**").permitAll()
            .antMatchers("/api/user/**").hasRole("ADMIN")
            .antMatchers(HttpMethod.GET, "/api/**").hasAnyRole("CONTENDER", "ADMIN")
            .antMatchers(HttpMethod.PUT, "/api/contender/**").hasAnyRole("CONTENDER", "ADMIN")
            .antMatchers(HttpMethod.POST, "/api/tick").hasAnyRole("CONTENDER", "ADMIN")
            .antMatchers(HttpMethod.PUT, "/api/tick/**").hasAnyRole("CONTENDER", "ADMIN")
            .antMatchers(HttpMethod.DELETE, "/api/tick/**").hasAnyRole("CONTENDER", "ADMIN")
            .antMatchers("/api/**").hasRole("ADMIN")
            .anyRequest().authenticated()
            .and()
            .httpBasic()
            .and().csrf().disable()
    }

    @Bean
    fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder()
    }
}