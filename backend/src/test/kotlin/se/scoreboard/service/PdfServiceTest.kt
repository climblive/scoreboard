package se.scoreboard.service

import org.junit.jupiter.api.Test
import java.io.File

internal class PdfServiceTest {

    private val pdfService : PdfService = PdfService("https://mysite.tld")

    @Test
    fun testStuff() {
        // Get the logo:
        PdfService::class.java.getResourceAsStream("/test1.pdf").use {
            val testPdf = it.readBytes()
            pdfService.createPdf(testPdf, listOf("DASDFGadasdasdRWFMS", "ERFMasdasdasdasdSF"))
        }
    }

    @Test
    fun testWithoutTemplate() {
        val data = pdfService.createPdf(listOf(
                "DASDFGaasdasdRWFMS",
                "DASDFGadsdasdRWFMS",
                "DASDFGadadasdRWFMS",
                "SDFGadasdasdRWFMS",
                "DAFGadasdasdRWFMS",
                "DASDadasdasdRWFMS",
                "DASDFGasdasdRWFMS",
                "DASDFGaddasdRWFMS",
                "DASDFGadasdasdRWFMS",
                "DASDFGadassdRWFMS",
                "DASDFGadasdasdRWFMS",
                "DASDFGadasdaRWFMS",
                "DASDFGadasdasdMS",
                "ERFMasdasdasdasdSF"
        ))
        File("hej.pdf").writeBytes(data)
    }
}
