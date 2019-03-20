package se.scoreboard.dto

import java.util.*

data class ContenderDto (
    var id: Int?,
    var compClassId: Int? = null,
    var contestId: Int? = null,
    var registrationCode: String? = null,
    var name: String? = null,
    var entered: Date? = null) {

    constructor() : this(null, null, null, null, null, null)
}
