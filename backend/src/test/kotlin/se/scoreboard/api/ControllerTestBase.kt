package se.scoreboard.api

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.junit.jupiter.api.*
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.core.io.ClassPathResource
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import javax.sql.DataSource


@Disabled
@SpringBootTest
@ExtendWith(SpringExtension::class)
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation::class)
class ControllerTestBase
{
    @Autowired lateinit var mockMvc: MockMvc
    @Autowired lateinit var mapper: ObjectMapper
    private var isPopulated: Boolean = false

    @Autowired private lateinit var dataSource: DataSource

    @BeforeEach
    fun populateOnce() {
        if (isPopulated) {
            return
        }

        val populator = ResourceDatabasePopulator()
        populator.addScript(ClassPathResource("/data.sql"))
        populator.execute(dataSource)
        isPopulated = true
    }

    final inline fun <reified T> get(path: String, expectedStatus: HttpStatus): T {
        val mvcResult = mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get(path)
                    .accept(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Regcode ABCD1234"))
                .andExpect(status().`is`(expectedStatus.value()))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andReturn()

        return mapper.readValue<T>(mvcResult.response.contentAsString)
    }

    final inline fun <reified T> post(path: String, body: Any, expectedStatus: HttpStatus): T {
        val mvcResult = mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post(path)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(body))
                .accept(MediaType.APPLICATION_JSON)
                .header("Authorization", "Regcode ABCD1234"))
                .andExpect(status().`is`(expectedStatus.value()))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andReturn()

        return mapper.readValue<T>(mvcResult.response.contentAsString)
    }

    final inline fun <reified T> put(path: String, body: Any, expectedStatus: HttpStatus): T {
        val mvcResult = mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put(path)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(body))
                .accept(MediaType.APPLICATION_JSON)
                .header("Authorization", "Regcode ABCD1234"))
                .andExpect(status().`is`(expectedStatus.value()))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andReturn()

        return mapper.readValue<T>(mvcResult.response.contentAsString)
    }

    final inline fun <reified T> delete(path: String, expectedStatus: HttpStatus) {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete(path)
                .accept(MediaType.APPLICATION_JSON)
                .header("Authorization", "Regcode ABCD1234"))
                .andExpect(status().`is`(expectedStatus.value()))
    }
}
