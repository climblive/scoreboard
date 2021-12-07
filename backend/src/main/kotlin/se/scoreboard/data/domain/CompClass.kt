package se.scoreboard.data.domain

import java.io.Serializable
import java.time.OffsetDateTime
import java.util.*
import javax.persistence.*
import javax.persistence.GenerationType.IDENTITY

@Entity
@Table(name = "comp_class")
open class CompClass (
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

    @Column(name = "contest_id", insertable = false, updatable = false)
    open var contestId: Int? = null,

    @Column(name = "name", nullable = false, length = 45)
    open var name: String? = null,

    @Column(name = "description", length = 255)
    open var description: String? = null,

    @Column(name = "color", length = 7, nullable = true)
    open var color: String? = null,

    @Column(name = "time_begin", length = 26, nullable = false)
    open var timeBegin: OffsetDateTime? = null,

    @Column(name = "time_end", length = 26, nullable = false)
    open var timeEnd: OffsetDateTime? = null,

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "compClass")
    open var contenders: MutableSet<Contender> = HashSet(0)) : Serializable, AbstractEntity<Int>
