package se.scoreboard.configuration

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Configuration
import se.scoreboard.security.CustomPermissionEvaluator
import org.springframework.security.access.expression.method.DefaultMethodSecurityExpressionHandler
import org.springframework.security.access.expression.method.MethodSecurityExpressionHandler
import org.springframework.security.config.annotation.method.configuration.GlobalMethodSecurityConfiguration
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
class MethodSecurityConfig @Autowired constructor(
        val permissionEvaluator: CustomPermissionEvaluator) : GlobalMethodSecurityConfiguration() {

    override fun createExpressionHandler(): MethodSecurityExpressionHandler {
        val expressionHandler = DefaultMethodSecurityExpressionHandler()
        expressionHandler.setPermissionEvaluator(permissionEvaluator)
        return expressionHandler
    }
}