package se.scoreboard.data.domain

import java.io.Serializable
import javax.persistence.*
import javax.persistence.GenerationType.IDENTITY

@Entity
@Table(name = "raffle")
open class Raffle (
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

    @Column(name = "active", nullable = false)
    open var isActive: Boolean = false,

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "raffle", cascade = [ CascadeType.ALL ])
    open var winners: MutableList<RaffleWinner> = mutableListOf()) : Serializable, AbstractEntity<Int>