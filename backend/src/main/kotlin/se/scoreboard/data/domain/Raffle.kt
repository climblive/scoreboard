package se.scoreboard.data.domain

import java.io.Serializable
import java.util.*
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
    @JoinColumn(name = "contest_id", nullable = false)
    open var contest: Contest? = null,

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "raffle")
    open var winners: MutableSet<RaffleWinner> = HashSet(0)) : Serializable, AbstractEntity<Int>