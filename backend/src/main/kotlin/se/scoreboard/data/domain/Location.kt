package se.scoreboard.data.domain

// Generated Feb 3, 2019 9:58:01 PM by Hibernate Tools 5.2.11.Final

import java.util.*
import javax.persistence.*
import javax.persistence.GenerationType.IDENTITY

/**
 * Location generated by hbm2java
 */
@Entity
@Table(name = "location")
class Location : java.io.Serializable {

    @get:Id
    @get:GeneratedValue(strategy = IDENTITY)
    @get:Column(name = "id", unique = true, nullable = false)
    var id: Int? = null
    @get:Column(name = "name", nullable = false, length = 32)
    var name: String? = null
    @get:Column(name = "longitude", nullable = false, length = 8)
    var longitude: String? = null
    @get:Column(name = "latitude", nullable = false, length = 8)
    var latitude: String? = null
    @get:OneToMany(fetch = FetchType.LAZY, mappedBy = "location")
    var contests: Set<Contest> = HashSet(0)

    constructor()

    constructor(name: String, longitude: String, latitude: String) {
        this.name = name
        this.longitude = longitude
        this.latitude = latitude
    }

    constructor(name: String, longitude: String, latitude: String, contests: Set<Contest>) {
        this.name = name
        this.longitude = longitude
        this.latitude = latitude
        this.contests = contests
    }

}
