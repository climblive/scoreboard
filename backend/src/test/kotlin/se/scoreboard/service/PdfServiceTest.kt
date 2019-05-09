package se.scoreboard.service

import org.junit.Test
import java.io.File

internal class PdfServiceTest {

    private val pdfService : PdfService = PdfService("https://clmb.live")

    @Test
    fun testStuff() {
        // Get the logo:
        PdfService::class.java.getResourceAsStream("/test1.pdf").use {
            val testPdf = it.readBytes()
            val data = pdfService.createPdf(testPdf, listOf("DASDFGadasdasdRWFMS", "ERFMasdasdasdasdSF"))
            //File("hej.pdf").writeBytes(data!!)
        }
    }
}