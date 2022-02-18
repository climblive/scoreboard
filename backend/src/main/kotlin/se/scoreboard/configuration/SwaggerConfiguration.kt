package se.scoreboard.configuration

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.info.BuildProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.domain.Pageable
import springfox.documentation.builders.PathSelectors
import springfox.documentation.builders.RequestHandlerSelectors
import springfox.documentation.service.ApiInfo
import springfox.documentation.service.ApiKey
import springfox.documentation.service.AuthorizationScope
import springfox.documentation.service.SecurityReference
import springfox.documentation.spi.DocumentationType
import springfox.documentation.spi.service.contexts.SecurityContext
import springfox.documentation.spring.web.plugins.Docket
import springfox.documentation.swagger2.annotations.EnableSwagger2
import java.time.OffsetDateTime
import java.util.*


@Configuration
@EnableSwagger2
class SwaggerConfiguration {
    @Autowired
    private lateinit var buildProperties: BuildProperties

    @Bean
    fun docket(): Docket {
        return Docket(DocumentationType.SWAGGER_2)
                .select()
                    .apis(RequestHandlerSelectors.basePackage("se.scoreboard.api"))
                    .paths(PathSelectors.any())
                .build()
                .apiInfo(getApiInfo())
                .pathMapping("/")
                .directModelSubstitute(OffsetDateTime::class.java, String::class.java)
                .enableUrlTemplating(false)
                .securitySchemes(listOf(apiKey()))
                .securityContexts(Arrays.asList(securityContext()))
                .ignoredParameterTypes(Pageable::class.java)
    }

    private fun getApiInfo(): ApiInfo {
        return ApiInfo(
                "ClimbLive API",
                null,
                buildProperties.version,
                null,
                null,
                null,
                null,
                Collections.emptyList()
        )
    }

    private fun apiKey(): ApiKey {
        return ApiKey("apiKey", "Authorization", "header")
    }

    private fun securityContext(): SecurityContext {
        return SecurityContext.builder().securityReferences(defaultAuth())
                .forPaths(PathSelectors.any()).build()
    }

    private fun defaultAuth(): List<SecurityReference> {
        val authorizationScope = AuthorizationScope(
                "global", "accessEverything")
        val authorizationScopes = arrayOfNulls<AuthorizationScope>(1)
        authorizationScopes[0] = authorizationScope
        return listOf(SecurityReference("apiKey",
                authorizationScopes))
    }
}
