package se.scoreboard.data.domain

import java.io.Serializable
import java.time.OffsetDateTime
import javax.persistence.*
import javax.persistence.GenerationType.IDENTITY

@Entity
@Table(name = "contender", uniqueConstraints = arrayOf(UniqueConstraint(columnNames = arrayOf("registration_code"))))
open class Contender (
    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    override var id: Int? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", nullable = false)
    open var organizer: Organizer? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contest_id", nullable = false, updatable = false)
    open var contest: Contest? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = true, insertable = true, updatable = true)
    open var compClass: CompClass? = null,

    @Column(name = "registration_code", unique = true, nullable = false, length = 16)
    open var registrationCode: String? = null,

    @Column(name = "name", nullable = true, length = 64)
    open var name: String? = null,

    @Column(name = "club", nullable = true, length = 128)
    open var club: String? = null,

    @Column(name = "entered", length = 26)
    open var entered: OffsetDateTime? = null,

    @Column(name = "disqualified")
    open var disqualified: Boolean = false,

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "contender")
    open var ticks: MutableList<Tick> = mutableListOf()) : Serializable, AbstractEntity<Int>
