package se.scoreboard.data.domain

import java.util.*
import javax.persistence.*
import javax.persistence.GenerationType.IDENTITY
import java.io.Serializable

@Entity
@Table(name = "class")
open class CompClass (
    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    override var id: Int? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contest_id", nullable = false)
    open var contest: Contest? = null,

    @Column(name = "name", nullable = false, length = 45)
    open var name: String? = null,

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "time_begin", length = 26)
    open var timeBegin: Date? = null,

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "time_end", length = 26)
    open var timeEnd: Date? = null,

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "compClass")
    open var contenders: MutableSet<Contender> = HashSet(0)) : Serializable, AbstractEntity<Int>