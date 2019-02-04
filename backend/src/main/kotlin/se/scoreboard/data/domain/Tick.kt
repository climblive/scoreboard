package se.scoreboard.data.domain

// Generated Feb 3, 2019 9:58:01 PM by Hibernate Tools 5.2.11.Final

import java.util.*
import javax.persistence.*
import javax.persistence.GenerationType.IDENTITY

/**
 * Tick generated by hbm2java
 */
@Entity
@Table(name = "tick")
class Tick : java.io.Serializable {

    @get:Id
    @get:GeneratedValue(strategy = IDENTITY)
    @get:Column(name = "id", unique = true, nullable = false)
    var id: Int? = null
    @get:Version
    @get:Temporal(TemporalType.TIMESTAMP)
    @get:Column(name = "timestamp", nullable = false, length = 26)
    var timestamp: Date? = null
    @get:ManyToOne(fetch = FetchType.LAZY)
    @get:JoinColumn(name = "contender_id", nullable = false)
    var contender: Contender? = null
    @get:ManyToOne(fetch = FetchType.LAZY)
    @get:JoinColumn(name = "problem_id", nullable = false)
    var problem: Problem? = null
    @get:Column(name = "flash", nullable = false)
    var isFlash: Boolean = false

    constructor()

    constructor(contender: Contender, problem: Problem, flash: Boolean) {
        this.contender = contender
        this.problem = problem
        this.isFlash = flash
    }

}
