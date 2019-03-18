package se.scoreboard.data.domain

import java.io.Serializable
import java.util.*
import javax.persistence.*
import javax.persistence.GenerationType.IDENTITY

@Entity
@Table(name = "tick", uniqueConstraints = arrayOf(UniqueConstraint(columnNames = arrayOf("contender_id", "problem_id"))))
open class Tick (
    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    override var id: Int? = null,

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "timestamp", nullable = false, length = 26)
    open var timestamp: Date? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contender_id", nullable = false)
    @Access(AccessType.PROPERTY)
    open var contender: Contender? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    @Access(AccessType.PROPERTY)
    open var problem: Problem? = null,

    @Column(name = "flash", nullable = false)
    open var isFlash: Boolean = false) : Serializable, AbstractEntity<Int>