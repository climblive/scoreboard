package se.scoreboard.validation

class RgbColorValidator() {
    companion object {
        fun validate(color: String): Boolean {
            return color.matches(Regex("^#[0-9a-fA-F]{6}$"))
        }
    }
}