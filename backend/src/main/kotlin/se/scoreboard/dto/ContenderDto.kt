package se.scoreboard.dto

import java.time.OffsetDateTime

data class ContenderDto (
    var id: Int?,
    var compClassId: Int? = null,
    var contestId: Int? = null,
    var registrationCode: String? = null,
    var name: String? = null,
    var entered: OffsetDateTime? = null,
    var disqualified: Boolean,
    var finalPlacing: Int?) {

    constructor() : this(null, null, null, null, null, null, false, null)
}
