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
import org.springframework.beans.factory.annotation.Value
import java.awt.Color
import java.awt.image.BufferedImage
import java.io.ByteArrayOutputStream


@Service
class PdfService @Autowired constructor(@Value("\${site.url}") val siteUrl: String) {

    val qrCodeWriter = QRCodeWriter()

    fun createPdf(codes: List<String>): ByteArray? {
        val document = PDDocument.load(javaClass.getResourceAsStream("/template.pdf"))
        val page = document.getPage(0)
        val pageDict = page.cosObject
        document.removePage(0)

        codes.forEach { code ->
            var newPageDict = COSDictionary(pageDict)
            newPageDict.removeItem(COSName.ANNOTS)
            var newPage = PDPage(newPageDict)
            addHeader(document, newPage, code)
            document.addPage(newPage)
        }
        ByteArrayOutputStream().use {
            document.save(it)
            return it.toByteArray()
        }
    }

    private fun addHeader(document: PDDocument, page: PDPage, code: String) {
        val cs = PDPageContentStream(document, page, PDPageContentStream.AppendMode.APPEND, true)
        val outerM = 20f
        val qrM = 2f
        val m = 5f
        val boxW = page.mediaBox.width - outerM * 2
        val boxH = 80
        val boxX = outerM
        val boxY = page.mediaBox.height - boxH - outerM

        val qrSize = boxH - qrM * 2

        cs.setLineWidth(1f)
        cs.setStrokingColor(Color.black)
        cs.moveTo(boxX ,boxY)
        cs.lineTo(boxX + boxW, boxY)
        cs.lineTo(boxX + boxW, boxY + boxH)
        cs.lineTo(boxX, boxY + boxH)
        cs.lineTo(boxX ,boxY)
        cs.closeAndStroke()

        cs.beginText()
        cs.newLineAtOffset(boxX + m, boxY + m)
        cs.setFont( PDType1Font.COURIER, 20f )
        cs.showText(code)
        cs.endText()

        val qrCode = LosslessFactory.createFromImage(document, getQRCode("$siteUrl/$code", 400))
        cs.drawImage(qrCode, boxX + boxW - qrSize - qrM, boxY + qrM, qrSize, qrSize)

        cs.close()
    }

    private fun getQRCode(text: String, dimension: Int): BufferedImage {
        val bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, dimension, dimension)
        return MatrixToImageWriter.toBufferedImage(bitMatrix)
    }
}