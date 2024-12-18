package se.scoreboard.service

import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Test
import se.scoreboard.createRegistrationCode
import java.io.File

internal class PdfServiceTest {

    private val pdfService : PdfService = PdfService("https://mysite.tld")

    @AfterEach
    internal fun tearDown() {
        File("out.pdf").delete()
    }

    @Test
    fun withoutTemplate() {
        val data = pdfService.createPdf((0..10).map { createRegistrationCode(8) })
        File("out.pdf").writeBytes(data)
    }
}
