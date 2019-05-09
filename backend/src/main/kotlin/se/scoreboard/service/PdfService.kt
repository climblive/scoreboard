package se.scoreboard.service

import org.apache.pdfbox.pdmodel.PDDocument
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.apache.pdfbox.pdmodel.PDPageContentStream
import org.apache.pdfbox.pdmodel.font.PDType1Font
import org.apache.pdfbox.pdmodel.PDPage
import org.apache.pdfbox.cos.COSName
import org.apache.pdfbox.cos.COSDictionary
import com.google.zxing.client.j2se.MatrixToImageWriter
import com.google.zxing.BarcodeFormat
import com.google.zxing.qrcode.QRCodeWriter
import org.apache.pdfbox.pdmodel.graphics.image.LosslessFactory
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject
import org.springframework.beans.factory.annotation.Value
import java.awt.Color
import java.awt.image.BufferedImage
import java.io.ByteArrayOutputStream
import javax.imageio.ImageIO


@Service
class PdfService @Autowired constructor(@Value("\${site.url}") val siteUrl: String) {

    val qrCodeWriter = QRCodeWriter()

    fun createPdf(pdfTemplate: ByteArray, codes: List<String>): ByteArray {
        val document = PDDocument.load(pdfTemplate)
        val page = document.getPage(0)
        val pageDict = page.cosObject
        document.removePage(0)

        // Get the logo:
        var logo:BufferedImage? = null
        PdfService::class.java.getResourceAsStream("/logo.png").use {
            logo = ImageIO.read(it)
        }
        val logoObject = LosslessFactory.createFromImage(document, logo)

        codes.forEach { code ->
            var newPageDict = COSDictionary(pageDict)
            newPageDict.removeItem(COSName.ANNOTS)
            var newPage = PDPage(newPageDict)
            addHeader(document, logoObject, newPage, code)
            document.addPage(newPage)
        }
        ByteArrayOutputStream().use {
            document.save(it)
            return it.toByteArray()
        }
    }

    private fun addHeader(document: PDDocument, logo: PDImageXObject, page: PDPage, code: String) {
        val cs = PDPageContentStream(document, page, PDPageContentStream.AppendMode.PREPEND, true)
        val outerM = 20f
        val qrM = 2f
        val m = 5f
        val boxW = page.mediaBox.width - outerM * 2
        val boxH = 80
        val boxX = outerM
        val boxY = page.mediaBox.height - boxH - outerM

        val qrSize = boxH - qrM * 2

        val logoH = boxH - m * 2
        val logoW = logoH * logo.width / logo.height

        cs.setLineWidth(1f)
        cs.setStrokingColor(Color.black)
        cs.setNonStrokingColor(Color.black)
        cs.moveTo(boxX ,boxY)
        cs.lineTo(boxX + boxW, boxY)
        cs.lineTo(boxX + boxW, boxY + boxH)
        cs.lineTo(boxX, boxY + boxH)
        cs.lineTo(boxX ,boxY)
        cs.closeAndStroke()

        cs.beginText()
        cs.newLineAtOffset(boxX + logoW + m * 3, boxY + m * 3)
        cs.setFont( PDType1Font.COURIER, 20f )
        cs.showText(code)
        cs.endText()

        cs.beginText()
        cs.newLineAtOffset(boxX + logoW + m * 3, boxY + m * 3 + 20)
        cs.setFont( PDType1Font.HELVETICA, 10f )
        cs.showText("Din aktiveringskod på " + siteUrl + ":")
        cs.endText()

        cs.drawImage(logo, boxX + m, boxY + m, logoW, logoH)

        val qrCode = LosslessFactory.createFromImage(document, getQRCode("$siteUrl/$code", 400))
        cs.drawImage(qrCode, boxX + boxW - qrSize - qrM, boxY + qrM, qrSize, qrSize)

        cs.close()
    }

    private fun getQRCode(text: String, dimension: Int): BufferedImage {
        val bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, dimension, dimension)
        return MatrixToImageWriter.toBufferedImage(bitMatrix)
    }
}