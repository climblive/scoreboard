package se.scoreboard.dto

import javax.persistence.Column

data class ProblemDto (
    var id: Int?,
    var contestId: Int?,
    var number: Int,
    var holdColorPrimary: String?,
    var holdColorSecondary: String?,
    var name: String?,
    var description: String?,
    var points: Int,
    var flashBonus: Int?) {

    constructor() : this(null, null, Int.MAX_VALUE, null, null, null, null, Int.MAX_VALUE, null)
}
