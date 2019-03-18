package se.scoreboard.data.domain

import java.util.*
import javax.persistence.*
import javax.persistence.GenerationType.IDENTITY
import java.io.Serializable

@Entity
@Table(name = "contest")
open class Contest (
    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    override var id: Int? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    open var location: Location? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", nullable = false)
    open var organizer: Organizer? = null,

    @Column(name = "name", nullable = false, length = 64)
    open var name: String? = null,

    @Column(name = "description", length = 65535)
    open var description: String? = null,

    @Column(name = "qualifying_problems", nullable = false)
    open var qualifyingProblems: Int = 0,

    @Column(name = "rules", length = 65535)
    open var rules: String? = null,

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "contest")
    open var problems: MutableSet<Problem> = HashSet(0),

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "contest")
    open var contenders: MutableSet<Contender> = HashSet(0),

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "contest")
    open var compClasses: MutableSet<CompClass> = HashSet(0)) : Serializable, AbstractEntity<Int>
