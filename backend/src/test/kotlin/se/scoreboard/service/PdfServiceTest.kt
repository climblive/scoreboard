package se.scoreboard.service

import org.junit.Test
import java.io.File

internal class PdfServiceTest {

    private val pdfService : PdfService = PdfService("https://clmb.live")

    @Test
    fun testStuff() {
        val data = pdfService.createPdf(ByteArray(0), listOf("DASDFGRWFMS", "ERFMDSF"))
        File("hej.pdf").writeBytes(data!!)
    }

}