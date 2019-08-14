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
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.authentication.AuthenticationManager
import se.scoreboard.data.repo.SeriesRepository


@Configuration
@EnableWebSecurity
class WebSecurityConfig @Autowired constructor(
        private val jwtTokenProvider: JwtTokenProvider) : WebSecurityConfigurerAdapter() {

    @Bean
    @Throws(Exception::class)
    override fun authenticationManagerBean(): AuthenticationManager {
        return super.authenticationManagerBean()
    }

    @Throws(Exception::class)
    override fun configure(http: HttpSecurity) {
        http
            .httpBasic().disable()
            .csrf().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeRequests()
            .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            .antMatchers(HttpMethod.PATCH, "/**").denyAll()
            .antMatchers(HttpMethod.TRACE, "/**").denyAll()
            .antMatchers("/api/user/login").permitAll()
            .antMatchers("/api/live/websocket").permitAll()
            .antMatchers("/api/contest/*/scoreboard").permitAll()
            .antMatchers(HttpMethod.GET, "/api/contest/*").permitAll()
            .antMatchers("/*").permitAll()
            .antMatchers("/scoreboard/*").permitAll()
            .antMatchers("/**/*.ico").permitAll()
            .antMatchers("/**/*.jpg").permitAll()
            .antMatchers("/**/*.jpeg").permitAll()
            .antMatchers("/**/*.png").permitAll()
            .antMatchers("/**/*.gif").permitAll()
            .antMatchers("/resource/**").permitAll()
            .antMatchers("/static/**").permitAll()
            .antMatchers("/v2/api-docs").permitAll()
            .antMatchers("/swagger-resources/**").permitAll()
            .antMatchers("/swagger-ui.html").permitAll()
            .antMatchers("/webjars/**").permitAll()
            .antMatchers("/admin/**").permitAll()
            .antMatchers("/api/admin/**").hasRole("ADMIN")
            .antMatchers(HttpMethod.POST, "/api/user/**").hasRole("ADMIN")
            .antMatchers(HttpMethod.PUT, "/api/user/**").hasRole("ADMIN")
            .antMatchers(HttpMethod.DELETE, "/api/user/**").hasRole("ADMIN")
            .anyRequest().authenticated()
            .and()
            .apply(JwtConfigurer(jwtTokenProvider))
    }
}
