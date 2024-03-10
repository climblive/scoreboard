package se.scoreboard.dto

import com.fasterxml.jackson.annotation.JsonProperty
import java.time.OffsetDateTime

data class ContenderDto (
    var id: Int?,
    var compClassId: Int? = null,
    var contestId: Int? = null,
    var registrationCode: String? = null,
    var name: String? = null,
    var club: String? = null,
    var entered: OffsetDateTime? = null,
    @JsonProperty("disqualified")
    var disqualified: Boolean) {

    constructor() : this(null, null, null, null, null, null, null, false)
}
