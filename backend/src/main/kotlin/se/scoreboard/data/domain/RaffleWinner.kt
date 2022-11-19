package se.scoreboard.data.domain

import java.io.Serializable
import java.time.OffsetDateTime
import javax.persistence.*
import javax.persistence.GenerationType.IDENTITY

@Entity
@Table(name = "raffle_winner", uniqueConstraints = arrayOf(UniqueConstraint(columnNames = arrayOf("raffle_id", "contender_id"))))
open class RaffleWinner (
    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    override var id: Int? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", nullable = false)
    open var organizer: Organizer? = null,

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "raffle_id", nullable = false)
    @Access(AccessType.PROPERTY)
    open var raffle: Raffle? = null,

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "contender_id", nullable = false)
    @Access(AccessType.PROPERTY)
    open var contender: Contender? = null,

    @Column(name = "timestamp", nullable = false, length = 26)
    open var timestamp: OffsetDateTime? = null) : Serializable, AbstractEntity<Int>
