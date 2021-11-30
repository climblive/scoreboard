package se.scoreboard.data.domain

import java.io.Serializable
import java.time.OffsetDateTime
import javax.persistence.*
import javax.persistence.GenerationType.IDENTITY

@Entity
@Table(name = "tick", uniqueConstraints = arrayOf(UniqueConstraint(columnNames = arrayOf("contender_id", "problem_id"))))
open class Tick (
    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    override var id: Int? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", nullable = false)
    open var organizer: Organizer? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contest_id", nullable = false)
    open var contest: Contest? = null,

    @Column(name = "timestamp", nullable = false, length = 26)
    open var timestamp: OffsetDateTime? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contender_id", nullable = false)
    @Access(AccessType.PROPERTY)
    open var contender: Contender? = null,

    @ManyToOne(fetch = FetchType.EAGER) // TODO: WHy????
    @JoinColumn(name = "problem_id", nullable = false)
    @Access(AccessType.PROPERTY)
    open var problem: Problem? = null,

    @Column(name = "flash", nullable = false)
    open var isFlash: Boolean = false) : Serializable, AbstractEntity<Int>
