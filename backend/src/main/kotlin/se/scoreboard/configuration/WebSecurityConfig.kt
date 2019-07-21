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

@Configuration
@EnableWebSecurity
class WebSecurityConfig : WebSecurityConfigurerAdapter() {

    @Autowired
    private var userDetailsService: UserDetailsService? = null

    @Autowired
    private var authenticationEntryPoint: MyBasicAuthenticationEntryPoint? = null

    @Throws(Exception::class)
    override fun configure(http: HttpSecurity) {
        http
            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeRequests()
            .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            .antMatchers(HttpMethod.PATCH, "/**").denyAll()
            .antMatchers(HttpMethod.TRACE, "/**").denyAll()
            .antMatchers("/api/user/login").permitAll()
            .antMatchers("/api/live/websocket").permitAll()
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
            .httpBasic()
            .authenticationEntryPoint(this.authenticationEntryPoint)
            .and().csrf().disable()
    }

    @Bean
    fun passwordEncoder(): PasswordEncoder {
        return MyPasswordEncoder()
    }
}
