package se.scoreboard.data.domain

import java.io.Serializable
import javax.persistence.*
import javax.persistence.GenerationType.IDENTITY

@Entity
@Table(name = "contest")
open class Contest (
    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    override var id: Int? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = true)
    open var location: Location? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", nullable = false)
    open var organizer: Organizer? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "series_id", nullable = true)
    open var series: Series? = null,

    @Column(name = "protected", nullable = false)
    open var isProtected: Boolean = false,

    @Column(name = "name", nullable = false, length = 64)
    open var name: String? = null,

    @Column(name = "description", length = 65535)
    open var description: String? = null,

    @Column(name = "final_enabled", nullable = false)
    open var isFinalEnabled: Boolean = false,

    @Column(name = "qualifying_problems", nullable = false)
    open var qualifyingProblems: Int = 0,

    @Column(name = "finalists", nullable = false)
    open var finalists: Int = 0,

    @Column(name = "rules", length = 65535)
    open var rules: String? = null,

    @Column(name = "grace_period", nullable = false)
    open var gracePeriod: Int = 0,

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "contest")
    open var problems: MutableList<Problem> = mutableListOf(),

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "contest")
    open var contenders: MutableList<Contender> = mutableListOf(),

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "contest")
    open var compClasses: MutableList<CompClass> = mutableListOf(),

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "contest")
    open var raffles: MutableList<Raffle> = mutableListOf()) : Serializable, AbstractEntity<Int>
